const router = require("express").Router();
const {
  generateId,
  register,
  login,
  forgotPassword,
  resetPassword,
  getAllId,
  deleteId,
  getSingleUser,
  acceptAndRole,
  updateProfile,
} = require("../controllers/user");
const {
  registrationValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} = require("../utilities/form-validation");
const protectAdminRoute = require("../middleware/adminMiddleware");
const protectPoster = require("../middleware/protectRoutes");

// generate-id
router.get("/generate-id", protectAdminRoute, generateId);

// api/user/register
router.post("/register", registrationValidation, register);

router.post("/login", loginValidation, login);

router.post("/forgot-password", forgotPasswordValidation, forgotPassword);
router.put("/reset-password/:token", resetPasswordValidation, resetPassword);

// /api/user/get-all-id/?user=yes || no
router.get("/get-all-id", protectAdminRoute, getAllId);

router.delete("/delete-id/:id", protectAdminRoute, deleteId);

router.get("/get-single-user/", protectPoster, getSingleUser);

// ?admin=yes || ?admin=no
router.put("/accept-user/:id", protectAdminRoute, acceptAndRole);

router.put("/update-profile", protectPoster, updateProfile);

module.exports = router;
