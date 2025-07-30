const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const app = express();
const userRoutes = require("./routes/userRoutes");
const authRoute = require("./routes/authRoutes");
const clothesRoute = require("./routes/clothesRoute");
const wishlistRoutes = require("./routes/wishlistRoutes");
const shoppingRoutes = require("./routes/shoppingCartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const activitylogRoutes = require("./routes/activitylogRoutes");

connectDB();

app.use("/api/order/webhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(
  cors({
    origin: "https://localhost:5173",
    credentials: true,
  })
);

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoute);
app.use("/api/clothes", clothesRoute);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", shoppingRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/activitylog", activitylogRoutes);
app.use('/clothes_image', express.static("clothes_image"));
app.use('/uploads', express.static("uploads"));

const https = require("https");
const fs = require("fs");
const path = require("path");

if (require.main === module && process.env.NODE_ENV !== "test") {
  const options = {
    key: fs.readFileSync(path.resolve(__dirname, "./certs/localhost.key")),
    cert: fs.readFileSync(path.resolve(__dirname, "./certs/localhost.crt")),
  };

  https.createServer(options, app).listen(3000, "0.0.0.0", () => {
    console.log("HTTPS backend running on https://0.0.0.0:3000");
  });
}

module.exports = app;
