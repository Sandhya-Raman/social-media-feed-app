
const express = require("express");
const multer = require("multer");
const path = require("path");
const Post = require("../models/Post");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ===============================
// MULTER IMAGE UPLOAD CONFIGURATION
// ===============================

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    }
});

// ALLOW ONLY IMAGE FILES
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp"
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

// ===============================
// CREATE A NEW POST WITH IMAGE
// ===============================

router.post(
    "/",
    authMiddleware,
    upload.single("image"),
    async (req, res) => {
        try {
            const content = req.body.content || "";

            if (!content.trim() && !req.file) {
                return res.status(400).json({
                    message: "Please provide text or an image"
                });
            }

            const image = req.file
                ? `/uploads/${req.file.filename}`
                : "";

            const newPost = new Post({
                user: req.user._id,
                content: content.trim(),
                image: image
            });

            await newPost.save();

            res.status(201).json({
                message: "Post created successfully",
                post: newPost
            });

        } catch (error) {
            console.error("Post creation error:", error.message);

            res.status(500).json({
                message: "Server error while creating post"
            });
        }
    }
);

// ===============================
// GET ALL POSTS
// ===============================

router.get("/", authMiddleware, async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("user", "name username profilePicture")
            .sort({ createdAt: -1 })
            .lean();

        const formattedPosts = posts.map((post) => ({
            ...post,
            likes: post.likes.map((id) => id.toString())
        }));

        res.status(200).json({
            message: "Posts fetched successfully",
            count: formattedPosts.length,
            posts: formattedPosts
        });

    } catch (error) {
        console.error("Fetching posts error:", error.message);

        res.status(500).json({
            message: "Server error while fetching posts"
        });
    }
});

// ===============================
// LIKE AND UNLIKE A POST
// ===============================

router.post("/:id/like", authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const alreadyLiked = post.likes.some(
            (userId) =>
                userId.toString() === req.user._id.toString()
        );

        if (alreadyLiked) {
            const updatedPost = await Post.findByIdAndUpdate(
                req.params.id,
                {
                    $pull: {
                        likes: req.user._id
                    }
                },
                { new: true }
            );

            return res.status(200).json({
                message: "Post unliked successfully",
                likesCount: updatedPost.likes.length
            });
        }

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            {
                $addToSet: {
                    likes: req.user._id
                }
            },
            { new: true }
        );

        res.status(200).json({
            message: "Post liked successfully",
            likesCount: updatedPost.likes.length
        });

    } catch (error) {
        console.error("Like error:", error.message);

        res.status(500).json({
            message: "Server error while liking post"
        });
    }
});

module.exports = router;
