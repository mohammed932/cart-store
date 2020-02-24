const jwt = require("jsonwebtoken");
const User = require("../models/user");
module.exports = (req, res, next) => {
  console.log("req are :", req.headers);
  const token = req.headers.authorization;
  if (!token) throw res.send("no token provided");
  jwt.verify(token, "myToken", async function(err, decoded) {
    console.log("decoded is :", decoded);
    if (err) throw res.send("token not exist !");
    const userId = decoded._id;
    const user = await User.findById(userId);
    if (!user) throw res.send("user not exist !");
    req.user = decoded;
    next();
  });
};
