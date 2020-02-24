const jwt = require("jsonwebtoken");
class Helpers {
  creatJwtToken(data) {
    const token = jwt.sign(data, "myToken");
    return token;
  }
}
module.exports = new Helpers();
