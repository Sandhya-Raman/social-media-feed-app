
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

function Home() {
    const { user, token, logout } = useAuth();
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [comments, setComments] = useState({});
    const [commentText, setCommentText] = useState({});
    const [activeCommentPost, setActiveCommentPost] = useState(null);

    const headers = {
        Authorization: `Bearer ${token}`
    };

    // FETCH ALL POSTS
    const fetchPosts = async () => {
        try {
            const response = await axios.get(
                `${API_URL}/api/posts`,
                { headers }
            );

            setPosts(response.data.posts);
        } catch (error) {
            setMessage("Unable to fetch posts.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // CREATE A POST
    const handleCreatePost = async (e) => {
        e.preventDefault();

        if (!content.trim() && !image) {
            setMessage("Please write something or select an image.");
            return;
        }

        const formData = new FormData();
        formData.append("content", content);

        if (image) {
            formData.append("image", image);
        }

        try {
            await axios.post(
                `${API_URL}/api/posts`,
                formData,
                { headers }
            );

            setContent("");
            setImage(null);
            e.target.reset();
            setMessage("Post created successfully!");

            await fetchPosts();

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Unable to create post."
            );
        }
    };

    // LIKE OR UNLIKE A POST
    const handleLike = async (postId) => {
        try {
            await axios.post(
                `${API_URL}/api/posts/${postId}/like`,
                {},
                { headers }
            );

            await fetchPosts();

        } catch (error) {
            setMessage("Unable to like this post.");
        }
    };

    // FETCH COMMENTS
    const handleViewComments = async (postId) => {
        if (activeCommentPost === postId) {
            setActiveCommentPost(null);
            return;
        }

        try {
            const response = await axios.get(
                `${API_URL}/api/comments/${postId}`,
                { headers }
            );

            setComments((previous) => ({
                ...previous,
                [postId]: response.data.comments
            }));

            setActiveCommentPost(postId);

        } catch (error) {
            setMessage("Unable to fetch comments.");
        }
    };

    // ADD A COMMENT
    const handleAddComment = async (postId) => {
        const text = commentText[postId] || "";

        if (!text.trim()) {
            return;
        }

        try {
            await axios.post(
                `${API_URL}/api/comments/${postId}`,
                { text },
                { headers }
            );

            setCommentText((previous) => ({
                ...previous,
                [postId]: ""
            }));

            const response = await axios.get(
                `${API_URL}/api/comments/${postId}`,
                { headers }
            );

            setComments((previous) => ({
                ...previous,
                [postId]: response.data.comments
            }));

        } catch (error) {
            setMessage("Unable to add comment.");
        }
    };

    // LOGOUT
    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="home-container">

            <header className="navbar">
                <h2>Connect</h2>

                <div className="navbar-user">
                    <span>{user?.name}</span>

                    <button onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </header>

            <main className="feed-container">

                <section className="create-post-card">
                    <h3>Create a Post</h3>

                    <form onSubmit={handleCreatePost}>

                        <textarea
                            placeholder="What's on your mind?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows="3"
                        />

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                        />

                        {image && (
                            <p>Selected image: {image.name}</p>
                        )}

                        <button type="submit">
                            Share Post
                        </button>

                    </form>
                </section>

                {message && (
                    <p className="feed-message">{message}</p>
                )}

                <section className="posts-section">
                    <h2>Latest Posts</h2>

                    {loading && <p>Loading posts...</p>}

                    {!loading && posts.length === 0 && (
                        <p>No posts yet. Be the first to share something!</p>
                    )}

                    {posts.map((post) => {

                        // IDENTIFY THE CURRENT USER
                        const currentUserId = String(
                            user?._id || user?.id || ""
                        );

                        // CHECK WHETHER THE CURRENT USER LIKED THIS POST
                        const isLiked = post.likes.some(
                            (likedUserId) =>
                                String(likedUserId) === currentUserId
                        );

                        return (
                            <article className="post-card" key={post._id}>

                                <div className="post-user">
                                    <strong>
                                        {post.user?.name || "User"}
                                    </strong>

                                    <span>
                                        @{post.user?.username}
                                    </span>
                                </div>

                                {post.content && (
                                    <p className="post-content">
                                        {post.content}
                                    </p>
                                )}

                                {post.image && (
                                    <img
                                        src={`${API_URL}${post.image}`}
                                        alt="Post"
                                        className="post-image"
                                    />
                                )}

                                <div className="post-actions">

                                    <button
                                        onClick={() => handleLike(post._id)}
                                    >
                                        {isLiked ? "❤️ Unlike" : "🤍 Like"}
                                        {" "}({post.likes.length})
                                    </button>

                                    <button
                                        onClick={() => handleViewComments(post._id)}
                                    >
                                        💬 Comments
                                    </button>

                                </div>

                                {activeCommentPost === post._id && (
                                    <div className="comments-section">

                                        {comments[post._id]?.map((comment) => (
                                            <div
                                                className="comment"
                                                key={comment._id}
                                            >
                                                <strong>
                                                    {comment.user?.name}
                                                </strong>

                                                <p>{comment.text}</p>
                                            </div>
                                        ))}

                                        <div className="add-comment">
                                            <input
                                                type="text"
                                                placeholder="Write a comment..."
                                                value={commentText[post._id] || ""}
                                                onChange={(e) =>
                                                    setCommentText({
                                                        ...commentText,
                                                        [post._id]: e.target.value
                                                    })
                                                }
                                            />

                                            <button
                                                onClick={() =>
                                                    handleAddComment(post._id)
                                                }
                                            >
                                                Send
                                            </button>
                                        </div>

                                    </div>
                                )}

                            </article>
                        );
                    })}
                </section>

            </main>
        </div>
    );
}

export default Home;
