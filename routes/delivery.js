const router = require("express").Router();
const {
  create,
  addImages,
  getDeliveries,
  removeDelivery,
  singleDelivery,
} = require("../controllers/delivery");
const protectAdminRoute = require("../middleware/adminMiddleware");

const multer = require("multer");
const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, file.fieldname + "-" + Date.now());
  } else {
    cb("invalid image file!", false);
  }
};

const upload = multer({ storage, fileFilter });

router.post("/create", protectAdminRoute, upload.array("image"), create);
router.put(
  "/add-images/:id",
  protectAdminRoute,
  upload.array("image"),
  addImages
);

// api/delivery/all-deliveries
router.get("/all-deliveries", protectAdminRoute, getDeliveries);
router.delete("/delete/:id", protectAdminRoute, removeDelivery);
router.get("/single/:id", singleDelivery);

module.exports = router;
