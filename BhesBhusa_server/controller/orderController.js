const mongoose = require("mongoose");
const Order = require("../model/checkoutModel");
const Clothes = require("../model/clothesModel");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create new order from cart
const createOrder = async (req, res) => {
  try {
    const { userId, items, shipping, payment, customerNotes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    const clothIds = items.map((item) => item.clothId);
    const dbClothes = await Clothes.find({ _id: { $in: clothIds } });

    if (dbClothes.length !== clothIds.length) {
      return res
        .status(400)
        .json({ message: "One or more clothing items not found." });
    }

    // ✅ Build detailed items array with title and price included
    const itemsWithDetails = items.map((item) => {
      const cloth = dbClothes.find((c) => c._id.toString() === item.clothId);
      return {
        clothId: item.clothId,
        title: cloth.title,
        price: cloth.price,
        quantity: item.quantity,
        size: item.size || "Free",
      };
    });

    const subtotal = itemsWithDetails.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const shippingCost = shipping?.cost || 0;
    const total = subtotal + shippingCost;

    const order = new Order({
      userId,
      items: itemsWithDetails, // ✅ store detailed items here
      shipping,
      payment,
      subtotal,
      shippingCost,
      total,
      customerNotes,
    });

    await order.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to place order", error: err.message });
  }
};

//get order by id
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(id).populate("items.clothId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch order", error: err.message });
  }
};

// Get all orders by user
const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId })
      .populate("items.clothId")
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this user." });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error.message);
    res.status(500).json({ message: "Failed to fetch orders." });
  }
};

// Cancel a pending order
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "PENDING") {
      return res
        .status(400)
        .json({ message: "Only pending orders can be cancelled" });
    }

    order.status = "CANCELLED";
    await order.save();

    res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error cancelling order", error: err.message });
  }
};

// Admin: Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate("userId", "name email")
      .populate("items.clothId");

    res.status(200).json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch all orders", error: err.message });
  }
};

const statusupdate = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "PENDING",
      "CONFIRMED",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const createCheckoutSession = async (req, res) => {
  try {
    const { orderId, items, total, title } = req.body;

    if (!orderId || !total || !items || items.length === 0) {
      return res.status(400).json({ message: "Missing required order data." });
    }

    // Build line_items for Stripe
    const line_items = items.map((item) => ({
      price_data: {
        currency: "usd", // Change currency if needed
        product_data: {
          name: item.title || "Clothing Item",
        },
        unit_amount: Math.round((item.price || 0) * 100), // Convert to cents
      },
      quantity: item.quantity || 1,
    }));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  line_items,
  mode: "payment",
  success_url: "https://localhost:5173/success?session_id=cs_test_b13mCwVFnA6JcHXb3C5kF32Xk86pAHH6MOuIpynGrx2agz2VEpbGg775Gu",
  cancel_url: "https://localhost:5173/payment-cancel",
  metadata: {
    orderId: orderId,
  },
});

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ message: "Failed to create checkout session" });
  }
};

const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_KEY
    );
    console.log("Webhook event received:", event.type);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("Checkout session completed:", session);

    const orderId = session.metadata?.orderId;
    console.log("orderId from metadata:", orderId);

    if (!orderId) {
      console.error("No orderId found in session metadata!");
      return res.status(400).send("Missing orderId in metadata");
    }

    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { paymentStatus: "PAID", status: "CONFIRMED" }, // You might want to update order status too
        { new: true }
      );
      if (!updatedOrder) {
        console.error("Order not found for updating paymentStatus!");
        return res.status(404).send("Order not found");
      }
      console.log(`Order ${orderId} paymentStatus updated to Paid.`);
    } catch (err) {
      console.error("Error updating order payment status:", err);
      return res.status(500).send("Database update failed");
    }
  }

  res.status(200).send("Webhook received");
};


module.exports = {
  createOrder,
  getOrderById,
  getOrdersByUser,
  cancelOrder,
  getAllOrders,
  statusupdate,
  createCheckoutSession,
  stripeWebhook,
};
