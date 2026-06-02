const express = require('express');
const router = express.Router();

const { 
  authenticateUser, 
  authorizeRoles 
} = require('../middlewares/auth'); 
const {
  getPublishedPosts,
  getPostBySlug,
  getFeaturedArticle,
  getAllPostsForAdmin,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  setFeaturedArticle
} = require('../controllers/blogController');

// --- Public Endpoints ---
router.route('/').get(getPublishedPosts);
router.route('/featured').get(getFeaturedArticle);
router.route('/:slug').get(getPostBySlug);

// --- Admin Protected Endpoints (Requires Login and Admin permissions) ---
router.use('/admin', [authenticateUser, authorizeRoles('admin')]);

router.route('/admin').post(createBlogPost);
router.route('/admin/all').get(getAllPostsForAdmin);
router.route('/admin/featured').put(setFeaturedArticle);
router.route('/admin/:id')
  .patch(updateBlogPost)
  .delete(deleteBlogPost);

module.exports = router;