const mongoose = require("mongoose");

const shoppingCartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", //Reference of usermodel
    require: true,
  },
  items: [
    {
      cloth: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Clothes",
        required: true,
      },

      quantity: {
        type: Number,
        default: 1,
      },
      size: {
        type: String,
      },
    },
  ],
});

const ShoppingCart = mongoose.model("Cart", shoppingCartSchema);

module.exports = ShoppingCart;
