// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
} = require('../controllers/postController');

// Routes
router.post('/', auth, createPost);            // Create post
router.get('/', getPosts);                     // Get paginated posts
router.put('/:id', auth, updatePost);          // Edit post
router.delete('/:id', auth, deletePost);       // Delete post
router.put('/like/:id', auth, toggleLike);     // Like/Unlike
router.post('/comment/:id', auth, addComment); // Add comment

module.exports = router;
