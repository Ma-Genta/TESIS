const joi = require("@hapi/joi");

const userIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);

const userSchema = {
  name: joi.string().max(100).required(),
  email: joi.string().email().required(),
  password: joi.string().required(),
  passwordRepeat: joi.string().required(),
  tel: joi.string().max(10).required(),
};

const createUserSchema = {
  ...userSchema,
  admin: joi.boolean,
};

module.exports = {
  userIdSchema,
  createUserSchema,
};
