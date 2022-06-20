const Joi = require("joi");
const asyncHandler = require("express-async-handler");

const name = Joi.string().required().min(3).max(40).messages({
  "string.base": "Your name should be texts only",
  "string.empty": "Your name cannot be an empty field",
  "string.min": "Your name should have a minimum length of three characters",
  "string.max": "Your name should have a maximum length of forty characters",
  "any.required": "Please enter a valid name.",
});

const email = Joi.string()
  .required()
  .email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  })
  .messages({
    "string.base":
      "Your email should have the format of name@example.com or name@example.net",
    "string.empty": "Your email address cannot have an empty field",
    "string.email":
      "Please enter a valid email address. It should have the format of name@example.com or name@example.net",
    "any.required":
      "Please enter a valid email address. It should have the format of name@example.com or name@example.net",
  });

const username = Joi.string().required().alphanum().min(3).max(30).messages({
  "string.empty": "Your username cannot be an empty field",
  "string.min":
    "Your username should have a minimum length of three characters",
  "string.max":
    "Your username should have a maximum length of thirty characters",
  "string.alphanum":
    "Your username must contain only alphabets and/or numbers.",
  "any.required": "Please enter a valid username.",
});
const regCode = Joi.string().required().alphanum().messages({
  "string.empty": "Please enter your registraiton code.",
  "string.alphanum":
    "Your registration code must contain only alphabets and/or numbers.",
  "any.required": "Please enter a valid registration code.",
});

const password = Joi.string().required().min(6).messages({
  "string.empty": "Your password cannot be an empty field",
  "string.min": "Your password should have a minimum length of 6 characters",

  "any.required": "Please enter a secure password",
});

const usernameChecker = Joi.string().required().alphanum().messages({
  "string.empty": "Username cannot be an empty field",
  "string.alphanum":
    "Your username must contain only alphabets and/or numbers.",
  "any.required": "Please enter a valid username.",
});

const passwordChecker = Joi.string().required().messages({
  "string.empty": "Password cannot be an empty field",
  "any.required": "Please enter a valid password.",
});

// USER & POSTER registration

const registrationSchema = Joi.object({
  name,
  email,
  username,
  password,
  regCode,
});

const registrationValidation = asyncHandler(async (req, res, next) => {
  try {
    await registrationSchema.validateAsync(req.body);
    next();
  } catch (error) {
    res.status(422);
    throw new Error(error.details[0].message);
  }
});

// Send verification

const sendVerificationSchema = Joi.object({
  email,
});

const sendVerificationValidation = asyncHandler(async (req, res, next) => {
  try {
    await sendVerificationSchema.validateAsync(req.body);
    next();
  } catch (error) {
    res.status(422);
    throw new Error(error.details[0].message);
  }
});

// USER login

const loginSchema = Joi.object({
  username: usernameChecker,
  password: passwordChecker,
});

const loginValidation = asyncHandler(async (req, res, next) => {
  try {
    await loginSchema.validateAsync(req.body);
    next();
  } catch (error) {
    res.status(422);
    throw new Error(error.details[0].message);
  }
});

const forgotPasswordSchema = Joi.object({
  email,
});

const forgotPasswordValidation = asyncHandler(async (req, res, next) => {
  try {
    await forgotPasswordSchema.validateAsync(req.body);
    next();
  } catch (error) {
    res.status(422);
    throw new Error(error.details[0].message);
  }
});

const resetPasswordSchema = Joi.object({
  password,
});

const resetPasswordValidation = asyncHandler(async (req, res, next) => {
  try {
    await resetPasswordSchema.validateAsync(req.body);
    next();
  } catch (error) {
    res.status(422);
    throw new Error(error.details[0].message);
  }
});

const coverImage = Joi.string().required().messages({
  "string.empty": "Your cover image cannot be an empty field",
  "any.required": "Please enter a valid cover image url.",
});
const title = Joi.string().required().min(10).messages({
  "string.empty": "Your title cannot be an empty field",
  "string.min": "Your title should have a minimum length of ten characters",
  "any.required": "Please enter a valid title.",
});

const subTitle = Joi.string().required().min(10).messages({
  "string.empty": "Your sub title cannot be an empty field",
  "string.min": "Your sub title should have a minimum length of ten characters",
  "any.required": "Please enter a valid sub title.",
});
const markdown = Joi.string().required().min(200).messages({
  "string.empty": "Your markdown cannot be an empty field",
  "string.min":
    "Your markdown should have a minimum length of two hundred characters",
  "any.required": "Please enter a valid markdown.",
});
const category = Joi.string().required().messages({
  "string.empty": "Your category cannot be an empty field",
  "any.required": "Please enter a valid category.",
});

const message = Joi.string().required().min(10).messages({
  "string.empty": "Your message cannot be an empty field",
  "string.min": "Your message should have a minimum length of ten characters",
  "any.required": "Please enter a valid message.",
});
const status = Joi.string()
  .required()
  .valid(
    "pending",
    "picked-up",
    "on-hold",
    "out-for-delivery",
    "cancelled",
    "in-transit",
    "enroute",
    "delivered",
    "returned"
  )
  .messages({
    "string.empty": `Status must match  pending,
  picked-up,
  on-hold,
  out-for-delivery,
  cancelled,
  in-transit,
  enroute,
  delivered,
  returned`,
    "any.required": "Please choose a valid status.",
  });

const createPostSchema = Joi.object({
  coverImage,
  title,
  markdown,
  category,
  subTitle,
});

const createPostValidation = asyncHandler(async (req, res, next) => {
  try {
    await createPostSchema.validateAsync(req.body);
    next();
  } catch (error) {
    res.status(422);
    throw new Error(error.details[0].message);
  }
});

const modifyStatusSchema = Joi.object({
  status,
  message,
});

const modifyStatusValidation = asyncHandler(async (req, res, next) => {
  try {
    await modifyStatusSchema.validateAsync(req.body);
    next();
  } catch (error) {
    res.status(422);
    throw new Error(error.details[0].message);
  }
});

const comment = Joi.string()
  .required()
  .messages({ "any.required": "Please enter a valid comment" });
const usernameComment = Joi.string()
  .required()
  .messages({ "any.required": "Please enter a valid username" });

const reply = Joi.string()
  .required()
  .messages({ "any.required": "Please enter a valid reply" });

const commentSchema = Joi.object({
  comment: comment,
  username: usernameComment,
});

const replySchema = Joi.object({
  reply: reply,
  username: usernameComment,
});

const commentValidation = asyncHandler(async (req, res, next) => {
  try {
    await commentSchema.validateAsync(req.body);
    next();
  } catch (error) {
    res.status(422);
    throw new Error(error.details[0].message);
  }
});
const replyValidation = asyncHandler(async (req, res, next) => {
  try {
    await replySchema.validateAsync(req.body);
    next();
  } catch (error) {
    res.status(422);
    throw new Error(error.details[0].message);
  }
});

module.exports = {
  registrationValidation,
  sendVerificationValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  sendVerificationValidation,
  createPostValidation,
  commentValidation,
  replyValidation,
  modifyStatusValidation,
};
