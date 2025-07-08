const mongoose = require("mongoose");

const wishListSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },

    items: [
        {
          cloth: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Clothes",
            required: true,
          }
        },
      ],
  },
  { timestamps: true }
);

const WishList = mongoose.model("WishList", wishListSchema);

module.exports = WishList;
