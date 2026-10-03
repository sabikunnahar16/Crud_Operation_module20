const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 1, maxlength: 200 },
    content: { type: String, required: true, trim: true, minlength: 1 },
    authorName: { type: String, required: true, trim: true, maxlength: 80 },
    tags: [{ type: String, trim: true, lowercase: true, maxlength: 40 }],
    blogImage: { type: String, trim: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
