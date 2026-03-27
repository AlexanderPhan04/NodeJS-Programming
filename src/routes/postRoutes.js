const express = require("express");
const postController = require("../controllers/postController");
const { requireAuth } = require("../middlewares/auth");
const normalizePostBody = require("../middlewares/normalizePostBody");
const upload = require("../middlewares/upload");
const validate = require("../middlewares/validate");
const {
  createPostSchema,
  listPostsQuerySchema,
  updatePostSchema,
} = require("../validators/postValidators");

const router = express.Router();

router.get("/", validate(listPostsQuerySchema, "query"), postController.listPosts);
router.get("/my-posts", requireAuth, validate(listPostsQuerySchema, "query"), postController.listMyPosts);
router.get("/search", validate(listPostsQuerySchema, "query"), postController.searchPosts);
router.get("/:id", postController.getPostById);
router.post(
  "/",
  requireAuth,
  upload.single("image"),
  normalizePostBody,
  validate(createPostSchema),
  postController.createPost
);
router.put(
  "/:id",
  requireAuth,
  upload.single("image"),
  normalizePostBody,
  validate(updatePostSchema),
  postController.updatePost
);
router.delete("/:id", requireAuth, postController.deletePost);

module.exports = router;
