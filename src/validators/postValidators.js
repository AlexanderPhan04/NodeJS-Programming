const Joi = require("joi");

const tagSchema = Joi.string().trim().min(1).max(30);

const createPostSchema = Joi.object({
  title: Joi.string().trim().min(3).max(150).required(),
  content: Joi.string().trim().min(10).required(),
  tags: Joi.array().items(tagSchema).max(10).default([]),
});

const updatePostSchema = Joi.object({
  title: Joi.string().trim().min(3).max(150),
  content: Joi.string().trim().min(10),
  tags: Joi.array().items(tagSchema).max(10),
  imageChanged: Joi.boolean(),
}).or("title", "content", "tags", "imageChanged");

const listPostsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  q: Joi.string().trim().allow(""),
  tag: Joi.string().trim(),
});

module.exports = {
  createPostSchema,
  listPostsQuerySchema,
  updatePostSchema,
};
