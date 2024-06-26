const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Comment = require("../models/Comment");
const Post = require("../models/Post");

const router = express.Router();

// get all comments - limit 20
router.get("/", authMiddleware, async (req, res) => {
  const comments = await Comment.find({}).limit(20);
  res.status(200).json(comments);
});

// route for creating comments
router.post("/create/:postId", authMiddleware, async (req, res) => {
  const userId = req.id;
  const content = req.body.comment;
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(400).json({ msg: "Post not found" });
    }
    if (!content) {
      return res.status(400).json({ msg: "Please enter you comment" });
    }
    const comment = new Comment({
      user: userId,
      content,
    });
    await comment.save();
    post.comments.push(comment);
    await post.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
