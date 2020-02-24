const Cart = require("../models/cart");
const mongoose = require("mongoose");
var _ = require("lodash");
class CartService {
  async createCart(request) {
    const response = await Cart.create(request);
    return response;
  }

  async editCart(cartId) {
    const response = await Cart.findOneAndUpdate({ _id: cartId }, req.body, {
      new: true
    });
    return response;
  }

  async inviteUserToCart(cartId, userId) {
    var cart = await Cart.findOne({ _id: cartId });
    if (!cart.authorizedUsers.includes(userId)) {
      cart.authorizedUsers.push(userId);
      const response = await cart.save();
      return response;
    } else {
      return { message: "User already invited" };
    }
  }
  async removeUserToCart(cartId, userWhoWantToRemove, authorizedUserId) {
    var cart = await Cart.findOne({ _id: cartId });
    if (authorizedUserId == cart.admin) {
      if (cart.authorizedUsers.includes(userWhoWantToRemove)) {
        cart.authorizedUsers.pull(userWhoWantToRemove);
        await Cart.update(
          { _id: cart._id },
          {
            $pull: {
              products: { user: mongoose.Types.ObjectId(userWhoWantToRemove) }
            }
          },
          { multi: true }
        );
        await cart.save();
        return cart;
      } else {
        return { message: "this user who want to delete not exist" };
      }
    } else if (cart.authorizedUsers.includes(userWhoWantToRemove)) {
      // user can remove him self only.
      if (authorizedUserId == userWhoWantToRemove) {
        cart.authorizedUsers.pull(userWhoWantToRemove);
        await Cart.update(
          { _id: cart._id },
          {
            $pull: {
              products: { user: mongoose.Types.ObjectId(userWhoWantToRemove) }
            }
          },
          { multi: true }
        );
        await cart.save();
        return cart;
      } else {
        return { message: "this user not allowed to remove other users" };
      }
    } else {
      return { message: "User not exist in authorized users" };
    }
  }

  async getAllCarts() {
    const response = await Cart.find().populate(
      "admin",
      "-token -password -__v"
    );
    return response;
  }

  async getCartDetails(cartId) {
    const response = await Cart.find({ _id: cartId });
    return response;
  }

  async deleteCart(cartId) {
    const result = await Cart.findOneAndRemove({ _id: cartId });
    if (result)
      return {
        message: `Cart ${deletedCart.name} deleted successfully !`
      };
    else
      return {
        message: `no cart with selected id ${req.params.id} found !`
      };
  }
}

module.exports = new CartService();
