const asyncHandler = require("express-async-handler");
const {
  successResponse: success,
  errorResponse: error,
} = require("../utilities/handleResponse");
const MODEL = require("../models/delivery");

const cloudinary = require("../utilities/imageUpload");

const addImages = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(400);
    throw new Error("Please provide some Id");
  }
  let delivery;
  try {
    delivery = await MODEL.findById(id);
  } catch (error) {
    res.status(400);
    throw new Error("An invalid delivery id.");
  }

  //   let poster = req.poster;
  let pictureFiles = req.files;

  if (!pictureFiles) {
    res.status(400);
    throw new Error("No picture attached!");
  }

  let multiplePicturePromise = pictureFiles.map((picture, index) =>
    cloudinary.uploader.upload(picture.path, {
      public_id: `${Date.now()}_${delivery.productName}`,
    })
  );

  const imageResponse = await Promise.all(multiplePicturePromise);
  const imagesUrl = imageResponse.map((image) => {
    const url = image.secure_url;
    return { url };
  });
  if (imagesUrl) {
    delivery.productImages = imagesUrl;
  }

  const saved = await delivery.save();

  if (!saved) {
    res.status(500);
    throw new Error("Failed to save product image");
  }

  success(res, 201, "Product images added successfully.");
});

const create = asyncHandler(async (req, res) => {
  const {
    productName,
    deliveryTime,
    receiverName,
    receiverAddress,
    receiverEmail,
    size,
    senderName,
    senderAddress,
    senderEmail,
    origin,
    pickupDate,
    transportMode,
  } = req.body;

  let poster = req.poster;

  //   let poster = req.poster;
  let pictureFiles = req.files;

  if (!pictureFiles) {
    res.status(400);
    throw new Error("No picture attached!");
  }

  let multiplePicturePromise = pictureFiles.map((picture, index) =>
    cloudinary.uploader.upload(picture.path, {
      public_id: `${Date.now()}_${productName}`,
    })
  );

  const imageResponse = await Promise.all(multiplePicturePromise);
  const imagesUrl = imageResponse.map((image) => {
    const url = image.secure_url;
    return { url };
  });
  let createDelivery;
  if (imagesUrl) {
    createDelivery = await MODEL.create({
      user: {
        username: poster.username,
        id: poster._id,
      },
      productName,
      deliveryTime: {
        start: deliveryTime,
        end: pickupDate,
      },
      receiver: {
        name: receiverName,
        address: receiverAddress,
        email: receiverEmail,
      },
      size,
      sender: {
        name: senderName,
        address: senderAddress,
        email: senderEmail,
      },
      origin,
      pickupDate,
      transportMode,
      productImages: imagesUrl,
    });
  }

  if (createDelivery) {
    success(res, 200, "Delivery created successfully!", {
      createDelivery,
    });
  } else {
    res.status(500);
    throw new Error("Failed to create new delivery.");
  }
});

const getDeliveries = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const count = await MODEL.countDocuments({});

  const allDeliveries = await MODEL.find({})
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({
      createdAt: -1,
    });
  if (allDeliveries) {
    success(res, 200, "Deliveries retrieved successfully", {
      allDeliveries,
      page,
      pages: Math.ceil(count / pageSize),
    });
  } else {
    res.status(404);
    throw new Error("No deliveries at the moment.");
  }
});

const removeDelivery = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(400);
    throw new Error("Please provide some Id");
  }

  let delivery;
  try {
    delivery = await MODEL.findByIdAndDelete(id);

    if (delivery) {
      success(res, 200, "Delivery deleted successfully");
    }
  } catch (error) {
    res.status(400);
    throw new Error("Failed to remove delivery. Please try again");
  }
});

const singleDelivery = asyncHandler(async (req, res) => {
  const id = req.params.id.split("-")[1];

  if (!id) {
    res.status(400);
    throw new Error("Please provide some Id");
  }

  let delivery;
  try {
    delivery = await MODEL.findById(id);

    if (delivery) {
      success(res, 200, "Delivery gotten successfully.", { delivery });
    }
  } catch (error) {
    res.status(400);
    throw new Error("Failed to fetch delivery details. Please try again");
  }
});

const modifyStatus = asyncHandler(async (req, res) => {
  const id =
    req.params.id.split("-").length === 1
      ? req.params.id
      : req.params.id.split("-")[1];
  const { status, message } = req.body;
  let delivery;

  if (!id) {
    res.status(400);
    throw new Error("Please provide some Id");
  }

  try {
    delivery = await MODEL.updateOne(
      { _id: id },
      {
        deliveryStatus: {
          status,
          message,
        },
      }
    );
  } catch (error) {
    res.status(400);
    throw new Error("Failed to update status of delivery. Please try again.");
  }

  if (!delivery) {
    res.status(500);
    throw new Error("Failed to update delivery. Please try again");
  } else {
    success(res, 202, "Status updated successfully!");
  }
});

const modifyLocation = asyncHandler(async (req, res) => {
  const id =
    req.params.id.split("-").length === 1
      ? req.params.id
      : req.params.id.split("-")[1];
  const { newLocation } = req.body;

  let delivery;

  if (!id) {
    res.status(400);
    throw new Error("Please provide some Id");
  }

  try {
    delivery = await MODEL.updateOne(
      {
        _id: id,
      },
      {
        "deliveryLocation.location": newLocation,
        $push: {
          "deliveryLocation.timeline": {
            location: newLocation,
          },
        },
      }
    );
  } catch (error) {
    res.status(400);
    throw new Error("Failed to update location of delivery. Please try again.");
  }

  if (!delivery) {
    res.status(500);
    throw new Error("Failed to update location of delivery. Please try again");
  } else {
    success(res, 202, "location updated successfully!", delivery);
  }
});

module.exports = {
  create,
  addImages,
  getDeliveries,
  removeDelivery,
  singleDelivery,
  modifyStatus,
  modifyLocation,
};
