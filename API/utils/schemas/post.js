const joi = require("@hapi/joi");

const postIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);

const postSchema = {
  title: joi.string().max(100).required(),
  message: joi.string().required(),
};

const createPostSchema = {
  ...postSchema,
};

module.exports = {
  postIdSchema,
  createPostSchema,
};
