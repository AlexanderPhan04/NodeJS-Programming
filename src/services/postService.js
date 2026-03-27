const postRepository = require("../repositories/postRepository");
const deleteUpload = require("../utils/deleteUpload");
const HttpError = require("../utils/httpError");
const { toPostResponse } = require("../utils/sanitize");

function normalizeTags(tags = []) {
  return [...new Set(tags.map((tag) => tag.trim()).filter(Boolean))];
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildSearchFilter(q, tag) {
  const normalizedQuery = q?.trim();
  const normalizedTag = tag?.trim();
  const filter = {};

  if (normalizedQuery) {
    const escapedQuery = escapeRegex(normalizedQuery);
    filter.$or = [
      { title: { $regex: escapedQuery, $options: "i" } },
      { content: { $regex: escapedQuery, $options: "i" } },
    ];
  }

  if (normalizedTag) {
    filter.tags = { $regex: `^${escapeRegex(normalizedTag)}$`, $options: "i" };
  }

  return filter;
}

function buildPagination(totalItems, page, limit) {
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const currentPage = Math.min(page, totalPages);

  return {
    page: currentPage,
    limit,
    totalItems,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
}

function ensureCanManagePost(post, currentUser) {
  const isOwner = post.authorId === currentUser.id;
  const isAdmin = currentUser.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new HttpError(403, "You are not allowed to modify this post.");
  }
}

async function listPosts(query) {
  const { items, totalItems } = await postRepository.findPaginated({
    filter: buildSearchFilter(query.q, query.tag),
    page: query.page,
    limit: query.limit,
    populateAuthor: true,
  });

  return {
    data: items.map((post) => toPostResponse(post, post.author)),
    pagination: buildPagination(totalItems, query.page, query.limit),
  };
}

async function getPostById(id) {
  const post = await postRepository.findById(id, { populateAuthor: true });
  if (!post) {
    throw new HttpError(404, "Post not found.");
  }

  return toPostResponse(post, post.author);
}

async function createPost(payload, currentUser, imageUrl) {
  const post = await postRepository.createPost({
    title: payload.title,
    content: payload.content,
    tags: normalizeTags(payload.tags),
    authorId: currentUser.id,
    imageUrl,
    populateAuthor: true,
  });

  return toPostResponse(post, post.author);
}

async function updatePost(id, payload, currentUser, imageUrl) {
  const existingPost = await postRepository.findById(id);
  if (!existingPost) {
    throw new HttpError(404, "Post not found.");
  }

  ensureCanManagePost(existingPost, currentUser);

  const nextPayload = {};
  if (typeof payload.title === "string") {
    nextPayload.title = payload.title.trim();
  }

  if (typeof payload.content === "string") {
    nextPayload.content = payload.content.trim();
  }

  if (Array.isArray(payload.tags)) {
    nextPayload.tags = normalizeTags(payload.tags);
  }

  if (imageUrl) {
    nextPayload.imageUrl = imageUrl;
  }

  const updatedPost = await postRepository.updatePost(id, nextPayload, {
    populateAuthor: true,
  });

  if (imageUrl) {
    await deleteUpload(existingPost.imageUrl);
  }

  return toPostResponse(updatedPost, updatedPost.author);
}

async function deletePost(id, currentUser) {
  const existingPost = await postRepository.findById(id);
  if (!existingPost) {
    throw new HttpError(404, "Post not found.");
  }

  ensureCanManagePost(existingPost, currentUser);

  const deletedPost = await postRepository.deletePost(id);
  await deleteUpload(existingPost.imageUrl);
  return deletedPost;
}

async function listMyPosts(currentUser, query) {
  const { items, totalItems } = await postRepository.findPaginated({
    filter: { author: currentUser.id },
    page: query.page,
    limit: query.limit,
    populateAuthor: true,
  });

  return {
    data: items.map((post) => toPostResponse(post, post.author)),
    pagination: buildPagination(totalItems, query.page, query.limit),
  };
}

module.exports = {
  createPost,
  deletePost,
  getPostById,
  listMyPosts,
  listPosts,
  updatePost,
};
