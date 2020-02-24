const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Cart = require("../models/cart");

// get all users
router.get("/", async (req, res) => {
  try {
    const response = await User.find();
    res.json(response);
  } catch (error) {
    console.log(error);
  }
});
// get specific user
router.get("/:id", async (req, res) => {
  try {
    const response = await User.findById(req.params.id);
    res.json(response);
  } catch (error) {
    console.log(error);
  }
});
// get user carts
router.get("/:id/carts", async (req, res) => {
  console.log(req.params.id);
  try {
    // check token user id against param id
    if (req.user._id == req.params.id) {
      const response = await Cart.find({
        $or: [
          { products: { $elemMatch: { user: req.params.id } } },
          { admin: req.params.id },
          { authorizedUsers: req.params.id }
        ]
      }).populate("products.user", "-token -password -__v");
      res.json(response);
    } else {
      res.status(401).json({ message: "no authenticated user" });
    }
  } catch (error) {
    console.log(error);
  }
});
// edit user info
router.put("/:id", async (req, res) => {
  try {
    const response = await User.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    res.json(response);
  } catch (error) {
    console.log(error);
  }
});
// delete user
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findOneAndRemove({ _id: req.params.id });
    if (deletedUser)
      return res.json({
        message: `User ${deletedUser.name} deleted successfully !`
      });
    else
      return res.json({
        message: `no User with selected id ${req.params.id} found !`
      });
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
