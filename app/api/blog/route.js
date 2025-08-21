import { ConnectDB } from "@/lib/config/db";
import BlogModel from "@/lib/models/BlogModel";
import { writeFile } from "fs/promises";
import mongoose from "mongoose";
const fs = require("fs");
const { NextResponse } = require("next/server");

// ✅ GET: Fetch All Blogs or One by ID
export async function GET(request) {
  await ConnectDB(); // ensure DB is connected
  console.log("Mongoose Ready State:", mongoose.connection.readyState); // 1 = connected

  const blogId = request.nextUrl.searchParams.get("id");

  if (blogId) {
    try {
      const blog = await BlogModel.findById(blogId);
      if (!blog) {
        return NextResponse.json({ success: false, msg: "Blog not found" }, { status: 404 });
      }
      return NextResponse.json(blog);
    } catch (err) {
      return NextResponse.json({ success: false, msg: "Invalid Blog ID" }, { status: 400 });
    }
  }

  const blogs = await BlogModel.find({});
  console.log("Fetched blogs count:", blogs.length);
  return NextResponse.json({ blogs });
}

// ✅ POST: Upload and Save New Blog
export async function POST(request) {
  await ConnectDB();

  const formData = await request.formData();
  const timestamp = Date.now();

  const image = formData.get("image");
  const imageBytes = await image.arrayBuffer();
  const buffer = Buffer.from(imageBytes);
  const imgPath = `./public/${timestamp}_${image.name}`;
  await writeFile(imgPath, buffer);
  const imgUrl = `/${timestamp}_${image.name}`;

  const blogData = {
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    author: formData.get("author"),
    image: imgUrl,
    authorImg: formData.get("authorImg"),
  };

  await BlogModel.create(blogData);
  console.log("✅ Blog Saved");

  return NextResponse.json({ success: true, msg: "Blog added" });
}

// ✅ DELETE: Remove Blog by ID
export async function DELETE(request) {
  await ConnectDB();

  try {
    const body = await request.json();
    console.log("Received DELETE request:", body);

    const id = body.id;
    if (!id) {
      return new Response(JSON.stringify({ success: false, msg: "ID is required" }), { status: 400 });
    }

    const blog = await BlogModel.findById(id);
    if (!blog) {
      return new Response(JSON.stringify({ success: false, msg: "Blog not found" }), { status: 404 });
    }

    // Delete image file from public
    fs.unlink(`./public${blog.image}`, (err) => {
      if (err) console.error("Error deleting image:", err);
    });

    await BlogModel.findByIdAndDelete(id);

    return new Response(JSON.stringify({ success: true, msg: "Blog deleted successfully" }), { status: 200 });
  } catch (error) {
    console.error("DELETE Error:", error);
    return new Response(JSON.stringify({ success: false, msg: "Internal Server Error" }), { status: 500 });
  }
}
