const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Post = require("../models/Post");

router.get("/getAllPosts", authMiddleware, async (req, res) => {
  const posts = await Post.find({}).sort({ createdAt: -1 });

  res.status(200).json(posts);
});

// Route to create a new post
router.post("/createPost", authMiddleware, async (req, res) => {
  try {
    const userId = req.id;
    const { content } = req.body;

    if (!content) return res.status(400).json({ msg: "Please enter post" });

    // Create a new post
    const newPost = new Post({
      user: userId,
      content: content,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:userPostId", authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userPostId })
      .populate("comments")
      .sort({ createdAt: -1 });

    if (!posts) {
      return res.status(400).json({ message: "not posts found" });
    }
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
  }
});

router.get("/:postId", authMiddleware, async (req, res) => {
  const post = await Post.findById(req.params.postId);

  if (!post) {
    return res.status(400).json({ msg: "Post not found" });
  }
  res.status(200).json(post);
});

module.exports = router;