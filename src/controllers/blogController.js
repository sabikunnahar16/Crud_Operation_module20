const fs = require("fs");
const path = require("path");
const Blog = require("../models/Blog");

function parseTags(tags) {
  if (Array.isArray(tags)) return tags;
  if (typeof tags === "string") return tags.split(",").map((tag) => tag.trim()).filter(Boolean);
  return [];
}

function imagePath(request) {
  return request.file ? `/uploads/${request.file.filename}` : undefined;
}

async function createBlog(request, response) {
  const { title, content, authorName } = request.body;
  if (!title || !content || !authorName) {
    return response.status(400).json({ success: false, message: "title, content, and authorName are required" });
  }
  const blog = await Blog.create({
    title,
    content,
    authorName,
    tags: parseTags(request.body.tags),
    blogImage: imagePath(request),
    author: request.user._id
  });
  return response.status(201).json({ success: true, blog });
}

async function getBlogs(_request, response) {
  const blogs = await Blog.find().sort({ createdAt: -1 }).populate("author", "name email");
  return response.json({ success: true, count: blogs.length, blogs });
}

async function getBlog(request, response) {
  const blog = await Blog.findById(request.params.id).populate("author", "name email");
  if (!blog) return response.status(404).json({ success: false, message: "Blog not found" });
  return response.json({ success: true, blog });
}

async function updateBlog(request, response) {
  const blog = await Blog.findById(request.params.id);
  if (!blog) return response.status(404).json({ success: false, message: "Blog not found" });
  if (blog.author.toString() !== request.user._id.toString()) {
    return response.status(403).json({ success: false, message: "Only the creator can update this blog" });
  }
  const fields = ["title", "content", "authorName"];
  for (const field of fields) if (request.body[field] !== undefined) blog[field] = request.body[field];
  if (request.body.tags !== undefined) blog.tags = parseTags(request.body.tags);
  if (request.file) blog.blogImage = imagePath(request);
  await blog.save();
  return response.json({ success: true, message: "Blog updated", blog });
}

async function deleteBlog(request, response) {
  const blog = await Blog.findById(request.params.id);
  if (!blog) return response.status(404).json({ success: false, message: "Blog not found" });
  if (blog.author.toString() !== request.user._id.toString()) {
    return response.status(403).json({ success: false, message: "Only the creator can delete this blog" });
  }
  if (blog.blogImage?.startsWith("/uploads/")) {
    const image = path.join(__dirname, "..", "..", blog.blogImage);
    if (fs.existsSync(image)) fs.unlinkSync(image);
  }
  await blog.deleteOne();
  return response.json({ success: true, message: "Blog deleted" });
}

module.exports = { createBlog, getBlogs, getBlog, updateBlog, deleteBlog };
