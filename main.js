const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv/config");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user");
const deliveryRoutes = require("./routes/delivery");

app.use(express.json());

let origin;
if (process.env.NODE_ENV === "production") {
  origin = ["https://www.aclshippingsinc.com"];
} else {
  origin = ["http://localhost:3000"];
}

const corsOptions = {
  origin: origin,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Connect Database
connectDB();

app.use("/api/user", userRoutes);
app.use("/api/delivery", deliveryRoutes);

// Error Middlewares
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

//Not found URL middleware
app.use(notFound);

//Error handler for the whole app
app.use(errorHandler);

const PORT = process.env.PORT || 4011;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
