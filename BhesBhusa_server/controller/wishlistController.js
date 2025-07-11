const WishList = require("../model/wishlistModel");

const createWishList = async (req, res) => {
  const { userId, items } = req.body;

  if (!userId || !items || !items.length || !items[0]?.cloth) {
    return res
      .status(400)
      .json({ error: "User ID and at least one cloth ID are required" });
  }

  try {
    let wishlist = await WishList.findOne({ userId });

    const clothId = items[0].cloth;

    if (!wishlist) {
      wishlist = new WishList({
        userId,
        items: [{ cloth: clothId }],
      });
    } else {
      wishlist.items = wishlist.items.filter((item) => item.cloth); // Remove invalid items

      const exists = wishlist.items.some(
        (item) => item.cloth.toString() === clothId
      );

      if (!exists) {
        wishlist.items.push({ cloth: clothId });
      }
    }

    await wishlist.save();

    const populatedWishlist = await WishList.findOne({ userId }).populate(
      "items.cloth"
    );

    return res.status(200).json(populatedWishlist);
  } catch (error) {
    console.error("Error creating wishlist:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get Wishlist by User ID
const getWishlistById = async (req, res) => {
  const { userId } = req.params;

  try {
    const wishlist = await WishList.findOne({ userId }).populate("items.cloth");

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    res.status(200).json(wishlist);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Remove from Wishlist
const removeFromWishlist = async (req, res) => {
  const { userId, clothId } = req.params;

  try {
    const wishlist = await WishList.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ error: "Wishlist not found" });
    }

    wishlist.items = wishlist.items.filter(
      (item) => item.cloth.toString() !== clothId
    );

    await wishlist.save();

    const updatedWishlist = await WishList.findOne({ userId }).populate(
      "items.cloth"
    );

    res.status(200).json({
      message: "Item removed from wishlist",
      items: updatedWishlist.items,
    });
  } catch (error) {
    console.error("Failed to remove from wishlist:", error);
    res.status(500).json({ error: "Failed to remove from wishlist" });
  }
};

module.exports = {
  createWishList,
  getWishlistById,
  removeFromWishlist,
};
