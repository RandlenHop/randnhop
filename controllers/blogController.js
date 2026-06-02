const { BlogPost, FeaturedArticle } = require('../models/Blog');

// ==========================================
// A. Public Routes Logic
// ==========================================

// GET /blog
const getPublishedPosts = async (req, res) => {
  const posts = await BlogPost.find({ status: 'Published' }).sort({ createdAt: -1 });
  res.status(200).json({ posts });
};

// GET /blog/:slug
const getPostBySlug = async (req, res) => {
  const { slug } = req.params;
  const post = await BlogPost.findOne({ slug, status: 'Published' });
  
  if (!post) {
    return res.status(404).json({ msg: `Post not found or is currently an unpublished draft.` });
  }
  res.status(200).json(post);
};

// GET /blog/featured
const getFeaturedArticle = async (req, res) => {
  const featured = await FeaturedArticle.findOne({});
  if (!featured) {
    return res.status(404).json({ msg: 'No featured article set yet.' });
  }
  res.status(200).json(featured);
};

// ==========================================
// B. Admin Routes Logic
// ==========================================

// GET /blog/admin/all
const getAllPostsForAdmin = async (req, res) => {
  const posts = await BlogPost.find({}).sort({ createdAt: -1 });
  res.status(200).json({ posts });
};

// POST /blog/admin
const createBlogPost = async (req, res) => {
  const post = await BlogPost.create(req.body);
  res.status(201).json(post);
};

// PATCH /blog/admin/:id
const updateBlogPost = async (req, res) => {
  const { id } = req.params;
  const post = await BlogPost.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!post) {
    return res.status(404).json({ msg: `No blog post found with id: ${id}` });
  }
  res.status(200).json(post);
};

// DELETE /blog/admin/:id
const deleteBlogPost = async (req, res) => {
  const { id } = req.params;
  const post = await BlogPost.findByIdAndDelete(id);

  if (!post) {
    return res.status(404).json({ msg: `No blog post found with id: ${id}` });
  }
  res.status(200).json({ message: "Post deleted successfully" });
};

// PUT /blog/admin/featured
const setFeaturedArticle = async (req, res) => {
  // Completely replaces the single featured record using upsert
  const featured = await FeaturedArticle.findOneAndUpdate(
    {}, 
    req.body, 
    { new: true, upsert: true, runValidators: true }
  );
  res.status(200).json(featured);
};

module.exports = {
  getPublishedPosts,
  getPostBySlug,
  getFeaturedArticle,
  getAllPostsForAdmin,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  setFeaturedArticle
};