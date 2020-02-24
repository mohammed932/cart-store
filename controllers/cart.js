const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");
const mongoose = require("mongoose");
const CartService = require("../services/CartService");
const validationSchema = require("../helpers/validation");
var _ = require("lodash");
// create new cart
router.post("/", async (req, res) => {
  try {
    req.validate(validationSchema.cartSchema, req.body);
    let response = await CartService(req.body);
    res.json(response);
  } catch (error) {
    console.log(error);
  }
});

// invite user for cart
router.post("/:id/invite", async (req, res) => {
  try {
    const response = await CartService.inviteUserToCart(
      req.params.id,
      req.body.userId
    );
    res.json(response);
  } catch (error) {
    console.log(error);
  }
});
// remove user from cart
router.post("/:id/revoke", async (req, res) => {
  try {
    console.log("req.body.userId :", req.body.userId);
    var cart = await Cart.findOne({ _id: req.params.id });
    if (req.user._id == cart.admin) {
      console.log("Iam admin of cart");
      if (cart.authorizedUsers.includes(req.body.userId)) {
        cart.authorizedUsers.pull(req.body.userId);
        await Cart.update(
          { _id: cart._id },
          {
            $pull: {
              products: { user: mongoose.Types.ObjectId(req.body.userId) }
            }
          },
          { multi: true }
        );
        await cart.save();
        res.json(cart);
      } else {
        res.json({ message: "this user who want to delete not exist" });
      }
    } else if (cart.authorizedUsers.includes(req.body.userId)) {
      // user can remove him self only.
      console.log("token user id :", req.user._id);
      if (req.user._id == req.body.userId) {
        console.log("this user has access to delete product");
        cart.authorizedUsers.pull(req.body.userId);
        await Cart.update(
          { _id: cart._id },
          {
            $pull: {
              products: { user: mongoose.Types.ObjectId(req.body.userId) }
            }
          },
          { multi: true }
        );
        await cart.save();
        res.json(cart);
      } else {
        res.json({ message: "this user not allowed to remove other users" });
      }
    } else {
      res.json({ message: "User not exist in authorized users" });
    }
  } catch (error) {
    console.log(error);
    res.json({ message: error });
  }
});
// get all carts
router.get("/", async (req, res) => {
  try {
    const response = await Cart.find().populate(
      "admin",
      "-token -password -__v"
    );
    res.json(response);
  } catch (error) {
    console.log(error);
  }
});
// get cart details
router.get("/:id", async (req, res) => {
  try {
    const response = await Cart.find({ _id: req.params.id });
    if (!response) return res.json({ message: "error occur" });
    res.json(response);
  } catch (error) {
    res.json(error);
    console.log(error);
  }
});
// edit cart
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
// delete cart
router.delete("/:id", async (req, res) => {
  try {
    const result = await Cart.findOneAndRemove({ _id: req.params.id });
    if (result)
      return res.json({
        message: `Cart ${deletedCart.name} deleted successfully !`
      });
    else
      return res.json({
        message: `no cart with selected id ${req.params.id} found !`
      });
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
