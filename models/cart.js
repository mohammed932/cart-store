const mongoose = require("mongoose");
const schema = mongoose.Schema;
const productSchema = new schema({
  name: {
    type: String
  },
  price: {
    type: Number
  },
  user: {
    type: schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

const cartSchema = new schema({
  admin: {
    type: schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  authorizedUsers: [String],
  products: [productSchema]
});

module.exports = mongoose.model("Cart", cartSchema);
