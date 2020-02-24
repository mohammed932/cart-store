const express = require("express");
const router = express.Router();
const UserService = require("../services/UserService");
const Cart = require("../models/cart");
const validationSchema = require("../helpers/validation");
// create new user
router.post("/", async (req, res) => {
  try {
    req.validate(validationSchema.userSchema, req.body);
    const response = await UserService.register(req.body);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});
module.exports = router;
