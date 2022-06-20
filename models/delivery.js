const mongoose = require("mongoose");

const timelineSchema = mongoose.Schema(
  {
    location: {
      type: String,
    },
  },
  { timestamps: true }
);

const deliverySchema = mongoose.Schema(
  {
    productImages: [
      {
        url: {
          type: String,
        },
      },
    ],
    productName: { type: String },
    user: {
      username: { type: String },
      id: { type: mongoose.Schema.Types.ObjectId },
    },
    delivered: {
      type: Boolean,
      default: false,
    },
    deliveryTime: {
      start: String,
      end: String,
    },
    timeline: [
      {
        address: String,
        position: {
          longitude: String,
          latitude: String,
        },
        timeframe: {
          start: String,
          end: String,
        },
      },
    ],
    receiver: {
      name: String,
      address: String,
      email: String,
      position: {
        longitude: String,
        latitude: String,
      },
    },

    sender: {
      name: String,
      address: String,
      email: String,
      position: {
        longitude: String,
        latitude: String,
      },
    },
    size: {
      type: Number,
    },
    origin: String,
    pickupDate: String,
    pickupComments: {
      type: String,
      default: "It is ready for pickup",
    },
    transportMode: String,

    deliveryStatus: {
      status: {
        type: String,
        default: "out-for-delivery",
        enum: [
          "pending",
          "picked-up",
          "on-hold",
          "out-for-delivery",
          "cancelled",
          "in-transit",
          "enroute",
          "delivered",
          "returned",
        ],
      },
      message: {
        type: String,
        default: "The product is out for delivery",
      },
    },
    deliveryLocation: {
      timeline: [timelineSchema],
      location: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

const Delivery = mongoose.model("Delivery", deliverySchema);

module.exports = Delivery;
