const Post = require("../models/Post");
const { normalizeUser } = require("./userRepository");

function normalizeDate(value) {
  if (!value) {
    return value;
  }

  return value instanceof Date ? value.toISOString() : value;
}

function normalizePost(post) {
  if (!post) {
    return null;
  }

  const plainPost = typeof post.toObject === "function" ? post.toObject() : post;
  const authorValue = plainPost.author;
  const authorId =
    authorValue && typeof authorValue === "object"
      ? String(authorValue._id || authorValue.id)
      : String(plainPost.author || plainPost.authorId);

  return {
    id: String(plainPost._id || plainPost.id),
    title: plainPost.title,
    content: plainPost.content,
    tags: plainPost.tags || [],
    imageUrl: plainPost.imageUrl || null,
    authorId,
    author:
      authorValue && typeof authorValue === "object" && (authorValue.username || authorValue.email)
        ? normalizeUser(authorValue)
        : undefined,
    createdAt: normalizeDate(plainPost.createdAt),
    updatedAt: normalizeDate(plainPost.updatedAt),
  };
}

async function getAllPosts() {
  const posts = await Post.find().sort({ createdAt: -1 }).lean();
  return posts.map(normalizePost);
}

async function findById(id, options = {}) {
  let query = Post.findById(id);

  if (options.populateAuthor) {
    query = query.populate("author", "username email role createdAt updatedAt");
  }

  const post = await query.lean();
  return normalizePost(post);
}

async function createPost(payload) {
  const createdPost = await Post.create({
    title: payload.title.trim(),
    content: payload.content.trim(),
    tags: payload.tags || [],
    imageUrl: payload.imageUrl || null,
    author: payload.authorId,
  });

  if (payload.populateAuthor) {
    const populatedPost = await Post.findById(createdPost._id)
      .populate("author", "username email role createdAt updatedAt")
      .lean();

    return normalizePost(populatedPost);
  }

  return normalizePost(createdPost);
}

async function updatePost(id, payload, options = {}) {
  let query = Post.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (options.populateAuthor) {
    query = query.populate("author", "username email role createdAt updatedAt");
  }

  const updatedPost = await query.lean();
  return normalizePost(updatedPost);
}

async function deletePost(id) {
  const deletedPost = await Post.findByIdAndDelete(id).lean();
  return normalizePost(deletedPost);
}

async function findPaginated({ filter = {}, page = 1, limit = 10, populateAuthor = false }) {
  let query = Post.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  if (populateAuthor) {
    query = query.populate("author", "username email role createdAt updatedAt");
  }

  const [items, totalItems] = await Promise.all([query.lean(), Post.countDocuments(filter)]);

  return {
    items: items.map(normalizePost),
    totalItems,
  };
}

module.exports = {
  createPost,
  deletePost,
  findById,
  findPaginated,
  getAllPosts,
  normalizePost,
  updatePost,
};
