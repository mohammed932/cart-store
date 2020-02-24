const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");
const validationSchema = require("../helpers/validation");
var _ = require("lodash");
// add new item in products
router.post("/carts/:id/addProduct", async (req, res) => {
  try {
    req.validate(validationSchema.productSchema, req.body);
    var cart = await Cart.findOne({ _id: req.params.id });
    if (
      cart.authorizedUsers.includes(req.user._id) ||
      cart.admin == req.user._id
    ) {
      console.log("user exist in authorized users");
      console.log("req.user._id :", req.user._id);
      cart.products.push({
        name: req.body.name,
        price: req.body.price,
        user: req.user._id
      });
      await cart.save();
      console.log("cartData", cart);
      res.send(cart);
    } else {
      res.json({ message: "this user is not authorized to add new product" });
    }
  } catch (error) {
    console.log(error);
  }
});

// remove product from cart
router.delete("/:id/carts/:cartId/removeProduct", async (req, res) => {
  try {
    console.log(" req.user._id :", req.user._id);
    var cart = await Cart.findOne({ _id: req.params.cartId });
    if (cart.admin == req.user._id) {
      cart.products.pull({ _id: req.params.id });
      var response = await cart.save();
      return res.json(response);
    } else if (cart.authorizedUsers.includes(req.user._id)) {
      const product = cart.products.find(obj => {
        return obj._id == req.params.id;
      });
      // check if this user who created this product.
      if (product) {
        if (product.user == req.user._id) {
          cart.products.pull({ _id: req.params.id });
          var response = await cart.save();
          return res.json(response);
        } else {
          return res.json({
            message: "this user not authorized to delete this product"
          });
        }
      } else {
        return res.json({
          message: "this product is not exist"
        });
      }
    } else {
      return res.json({
        message: "this user not allowed to delete this product"
      });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const response = await Cart.find();
    res.json(response);
  } catch (error) {
    console.log(error);
  }
});
// get all products in cart
router.get("/:id", async (req, res) => {
  try {
    const response = await Product.find({ cart: req.params.id }).populate(
      "user",
      "-token -password"
    );
    if (!response) return res.json({ message: "error occur" });
    res.json(response);
  } catch (error) {
    res.json(error);
    console.log(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const response = await Cart.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    res.json(response);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
