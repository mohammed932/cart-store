var Ajv = require("ajv");

module.exports = {
  userSchema: {
    type: "object",
    properties: {
      name: { type: "string" },
      email: { type: "string" },
      password: { type: "string" }
    },
    required: ["name", "email", "password"]
  },
  cartSchema: {
    type: "object",
    properties: {
      admin: { type: "string" },
      title: { type: "string" }
    },
    required: ["admin", "title"]
  },
  productSchema: {
    type: "object",
    properties: {
      name: { type: "string" },
      price: { type: "number" }
    },
    required: ["name", "price"]
  }
};
