const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const helpers = require("../helpers/helper");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  token: {
    type: String
  }
});
userSchema.plugin(uniqueValidator);

userSchema.methods.generateToken = function() {
  const token = helpers.creatJwtToken({
    _id: this._id,
    email: this.email
  });
  return token;
};
userSchema.pre("save", function(next) {
  this.token = this.generateToken();
  next();
});
module.exports = mongoose.model("User", userSchema);
