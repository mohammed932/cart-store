const Cart = require("../models/cart");
class CartService {
  async createCart(request) {
    const response = await Cart.create(request);
    return response;
  }

  async inviteUserToCart(cartId, userId) {
    var cart = await Cart.findOne({ _id: cartId });
    if (!cart.authorizedUsers.includes(userId)) {
      cart.authorizedUsers.push(userId);
      const response = await cart.save();
      return response;
    } else {
      return { message: "User already authorized" };
    }
  }
}
module.exports = new CartService();
