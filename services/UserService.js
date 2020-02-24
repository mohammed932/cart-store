const User = require("../models/user");
class UserService {
  async register(request) {
    const response = await User.create(request);
    return response;
  }
}
module.exports = new UserService();
