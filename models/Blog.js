const mongoose = require('mongoose');

// Sub-schema for the flexible, structured content array blocks
const ContentBlockSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['paragraph', 'heading', 'quote'],
    required: true
  },
  text: {
    type: String,
    required: true
  }
}, { _id: false });

// Main Blog Post Schema
const BlogPostSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: [true, 'Please provide a URL slug'],
    unique: true,
    trim: true
  },
  title: { type: String, required: true, trim: true },
  excerpt: { type: String, required: true },
  author: { type: String, default: 'R&H Editorial' },
  authorBio: { type: String },
  date: { type: String, required: true },
  readTime: { type: String, required: true },
  accent: { type: String, default: '#c8a96e' },
  category: { type: String, required: true },
  trending: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['Draft', 'Published'],
    default: 'Draft'
  },
  image: { type: String, required: true },
  content: [ContentBlockSchema]
}, { timestamps: true });

// Separate Schema for the single Featured Article record
const FeaturedArticleSchema = new mongoose.Schema({
  slug: { type: String, required: true },
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  author: { type: String, default: 'R&H Editorial' },
  authorBio: { type: String },
  date: { type: String, required: true },
  readTime: { type: String, required: true },
  accent: { type: String, default: '#2385cd' },
  category: { type: String, required: true },
  image: { type: String, required: true },
  content: [ContentBlockSchema]
}, { timestamps: true });

const BlogPost = mongoose.model('BlogPost', BlogPostSchema);
const FeaturedArticle = mongoose.model('FeaturedArticle', FeaturedArticleSchema);

module.exports = { BlogPost, FeaturedArticle };