// controllers/postController.js
const Post = require('../models/Post');

// Create Post
exports.createPost = async (req, res) => {
  try {
    const { title, content, image } = req.body;

    const post = await Post.create({
      title,
      content,
      image,
      author: req.user.id,
    });

    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating post' });
  }
};

// Get All Posts with Pagination
exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 3;
    const posts = await Post.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching posts' });
  }
};

// Update Post
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ error: 'Post not found' });

    // Only author can edit
    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ error: 'Unauthorized' });

    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error updating post' });
  }
};

// Delete Post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ error: 'Unauthorized' });

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting post' });
  }
};

// Like/Unlike Post
exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ error: 'Post not found' });

    const userId = req.user.id;
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json({ liked: !isLiked, likesCount: post.likes.length });
  } catch (err) {
    res.status(500).json({ error: 'Error toggling like' });
  }
};

// Add Comment
exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ error: 'Post not found' });

    const comment = {
      user: req.user.id,
      comment: req.body.comment,
    };

    post.comments.push(comment);
    await post.save();

    res.status(201).json(post.comments);
  } catch (err) {
    res.status(500).json({ error: 'Error adding comment' });
  }
};
