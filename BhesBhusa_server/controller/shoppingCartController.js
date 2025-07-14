const Cart = require("../model/shoppingcartModel");

const addToCart = async (req, res) => {
  try {
    const { userId, items } = req.body;

    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid payload format" });
    }

    const { cloth, quantity = 1, size } = items[0]; // assuming only one item at a time

    if (!cloth || !size) {
      return res.status(400).json({ error: "Missing cloth or size in items" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ cloth, quantity, size }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.cloth?.toString() === cloth && item.size === size
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += Number(quantity);
      } else {
        cart.items.push({ cloth, quantity, size });
      }
    }

    const savedCart = await cart.save();
    const populatedCart = await Cart.findById(savedCart._id).populate("items.cloth");

    res.status(201).json(populatedCart);
  } catch (error) {
    console.error("Cart creation failed:", error);
    res.status(500).json({ error: "Failed to create or update the cart" });
  }
};


const getCartById = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId }).populate("items.cloth");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const removeFromCart = async (req, res) => {
  const { userId, clothId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.cloth?.toString() !== clothId
    );

    await cart.save();

    res.status(200).json({ message: "Item removed from cart", items: cart.items });
  } catch (error) {
    console.error("Failed to remove item from cart:", error);
    res.status(500).json({ error: "Failed to remove item from cart" });
  }
};

module.exports = {
  addToCart,
  getCartById,
  removeFromCart,
};
