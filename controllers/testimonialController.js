const Testimonial = require('../models/Testimonial');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

// 🟢 PUBLIC ACCESS: Fetch approved testimonials for the main landing page website
const getApprovedTestimonials = async (req, res) => {
  const testimonials = await Testimonial.find({ isApproved: true }).sort('-createdAt');
  res.status(StatusCodes.OK).json({ count: testimonials.length, testimonials });
};

// 🔴 ADMIN ACCESS: Get ALL testimonials for the Admin Dashboard list view
const getAllTestimonialsForAdmin = async (req, res) => {
  const testimonials = await Testimonial.find({}).sort('-createdAt');
  res.status(StatusCodes.OK).json({ count: testimonials.length, testimonials });
};

// 🔴 ADMIN ACCESS: Create a new testimonial directly from the form
const createTestimonialByAdmin = async (req, res) => {
  const { name, role, company, content, rating, avatar, isApproved } = req.body;

  if (!name || !content || !rating) {
    throw new BadRequestError('Full name, testimonial text, and rating are required fields.');
  }

  const testimonial = await Testimonial.create({
    name,
    role,
    company,
    content,
    rating,
    avatar,
    isApproved: isApproved || false, // Matches the "Show on website" visibility toggle
  });

  res.status(StatusCodes.CREATED).json({ msg: 'Testimonial created successfully!', testimonial });
};

// 🔴 ADMIN ACCESS: Edit / Update an existing testimonial (Handles form changes + visibility switch)
const updateTestimonial = async (req, res) => {
  const { id } = req.params;

  // This will dynamically update whatever fields the admin changed in the edit form
  const testimonial = await Testimonial.findByIdAndUpdate(
    id,
    req.body, 
    { new: true, runValidators: true }
  );

  if (!testimonial) {
    throw new NotFoundError(`No testimonial found with id ${id}`);
  }

  res.status(StatusCodes.OK).json({ msg: 'Testimonial updated successfully', testimonial });
};

// 🔴 ADMIN ACCESS: Delete a testimonial completely
const deleteTestimonial = async (req, res) => {
  const { id } = req.params;

  const testimonial = await Testimonial.findByIdAndDelete(id);

  if (!testimonial) {
    throw new NotFoundError(`No testimonial found with id ${id}`);
  }

  res.status(StatusCodes.OK).json({ msg: 'Testimonial permanently deleted' });
};

module.exports = {
  getApprovedTestimonials,
  getAllTestimonialsForAdmin,
  createTestimonialByAdmin,
  updateTestimonial,
  deleteTestimonial,
};