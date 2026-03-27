const postService = require("../services/postService");
const buildFileUrl = require("../utils/buildFileUrl");
const asyncHandler = require("../utils/asyncHandler");

const listPosts = asyncHandler(async (req, res) => {
  const result = await postService.listPosts(req.query);
  res.json(result);
});

const searchPosts = asyncHandler(async (req, res) => {
  const result = await postService.listPosts(req.query);
  res.json(result);
});

const getPostById = asyncHandler(async (req, res) => {
  const post = await postService.getPostById(req.params.id);
  res.json({ data: post });
});

const createPost = asyncHandler(async (req, res) => {
  const imageUrl = buildFileUrl(req, req.file);
  const post = await postService.createPost(req.body, req.user, imageUrl);

  res.status(201).json({
    message: "Post created successfully.",
    data: post,
  });
});

const updatePost = asyncHandler(async (req, res) => {
  const imageUrl = buildFileUrl(req, req.file);
  const post = await postService.updatePost(req.params.id, req.body, req.user, imageUrl);

  res.json({
    message: "Post updated successfully.",
    data: post,
  });
});

const deletePost = asyncHandler(async (req, res) => {
  await postService.deletePost(req.params.id, req.user);
  res.json({
    message: "Post deleted successfully.",
  });
});

const listMyPosts = asyncHandler(async (req, res) => {
  const result = await postService.listMyPosts(req.user, req.query);
  res.json(result);
});

module.exports = {
  createPost,
  deletePost,
  getPostById,
  listMyPosts,
  listPosts,
  searchPosts,
  updatePost,
};
