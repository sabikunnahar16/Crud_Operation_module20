const express = require("express");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const controller = require("../controllers/blogController");

const router = express.Router();
router.use(auth);
router.route("/").get(controller.getBlogs).post(upload.single("blogImage"), controller.createBlog);
router
  .route("/:id")
  .get(controller.getBlog)
  .patch(upload.single("blogImage"), controller.updateBlog)
  .delete(controller.deleteBlog);

module.exports = router;
