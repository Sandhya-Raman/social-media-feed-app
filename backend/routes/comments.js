const express = require("express");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ADD A COMMENT
router.post("/:postId", authMiddleware, async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({
                message: "Comment text is required"
            });
        }

        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const comment = new Comment({
            post: post._id,
            user: req.user._id,
            text: text.trim()
        });

        await comment.save();

        await comment.populate("user", "name username profilePicture");

        res.status(201).json({
            message: "Comment added successfully",
            comment
        });

    } catch (error) {
        console.error("Add comment error:", error.message);

        res.status(500).json({
            message: "Server error while adding comment"
        });
    }
});

// GET COMMENTS FOR A POST
router.get("/:postId", authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const comments = await Comment.find({
            post: req.params.postId
        })
            .populate("user", "name username profilePicture")
            .sort({ createdAt: 1 });

        res.status(200).json({
            message: "Comments fetched successfully",
            count: comments.length,
            comments
        });

    } catch (error) {
        console.error("Fetch comments error:", error.message);

        res.status(500).json({
            message: "Server error while fetching comments"
        });
    }
});

module.exports = router;