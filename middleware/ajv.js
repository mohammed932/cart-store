var Ajv = require("ajv");
var ajv = new Ajv();

module.exports = (req, res, next) => {
  req.validate = (schema, data) => {
    const valid = ajv.validate(schema, data);
    if (!valid) {
      return res.json({ message: ajv.errors });
    }
  };
  next();
};
