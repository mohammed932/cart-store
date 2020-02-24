const Cart = require("../models/cart");
var _ = require("lodash");

class ProductService {
  async addProductToCart(request) {
    var cart = await Cart.findOne({ _id: request.params.id });
    if (
      cart.authorizedUsers.includes(request.user._id) ||
      cart.admin == request.user._id
    ) {
      cart.products.push({
        name: request.body.name,
        price: request.body.price,
        user: request.user._id
      });
      await cart.save();
      return cart;
    } else {
      return { message: "this user is not authorized to add new product" };
    }
  }

  async removeProductFromCart(req) {
    var cart = await Cart.findOne({ _id: req.params.cartId });
    if (cart.admin == req.user._id) {
      cart.products.pull({ _id: req.params.id });
      await cart.save();
      return cart;
    } else if (cart.authorizedUsers.includes(req.user._id)) {
      const product = cart.products.find(obj => {
        return obj._id == req.params.id;
      });
      // check if this user who created this product.
      if (product) {
        if (product.user == req.user._id) {
          cart.products.pull({ _id: req.params.id });
          await cart.save();
          return cart;
        } else {
          return {
            message: "this user not authorized to delete this product"
          };
        }
      } else {
        return {
          message: "this product is not exist"
        };
      }
    } else {
      return {
        message: "this user not allowed to delete this product"
      };
    }
  }

  async getCartProducts(cartId) {
    const response = await Product.find({ cart: cartId }).populate(
      "user",
      "-token -password"
    );
    return response;
  }
}
module.exports = new ProductService();
