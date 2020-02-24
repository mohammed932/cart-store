const express = require("express");
const router = express.Router();
const CartService = require("../services/CartService");
const validationSchema = require("../helpers/validation");

// create new cart
router.post("/", async (req, res) => {
  try {
    req.validate(validationSchema.cartSchema, req.body);
    let response = await CartService(req.body);
    res.json(response);
  } catch (error) {
    res.json(error);
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
    const response = await CartService.removeUserToCart(
      req.params.id,
      req.body.userId,
      req.user._id
    );
    res.json(response);
  } catch (error) {
    console.log(error);
    res.json({ message: error });
  }
});
// get all carts
router.get("/", async (req, res) => {
  try {
    const response = await CartService.getAllCarts();
    res.json(response);
  } catch (error) {
    res.json(error);
  }
});
// get cart details
router.get("/:id", async (req, res) => {
  try {
    const response = await CartService.getCartDetails(req.params.id);
    res.json(response);
  } catch (error) {
    res.json(error);
  }
});
// edit cart
router.put("/:id", async (req, res) => {
  try {
    const response = await CartService.editCart(req.params.id);
    res.json(response);
  } catch (error) {
    console.log(error);
  }
});
// delete cart
router.delete("/:id", async (req, res) => {
  try {
    const response = await CartService.deleteCart(req.params.id);
    res.json(response);
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
