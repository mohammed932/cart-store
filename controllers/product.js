const express = require("express");
const router = express.Router();
const ProductService = require("../services/ProductService");
const validationSchema = require("../helpers/validation");
// add new item in products
router.post("/carts/:id/addProduct", async (req, res) => {
  try {
    req.validate(validationSchema.productSchema, req.body);
    const response = await ProductService.addProductToCart(req);
    res.json(response);
  } catch (error) {
    console.log(error);
  }
});

// remove product from cart
router.delete("/:id/carts/:cartId/removeProduct", async (req, res) => {
  try {
    const response = await removeProductFromCart.addProductToCart(req);
    return res.json(response);
  } catch (error) {
    console.log(error);
  }
});

// get all products in cart
router.get("/:cartId", async (req, res) => {
  try {
    const response = await removeProductFromCart.getCartProducts(
      req.params.cartId
    );
    res.json(response);
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
