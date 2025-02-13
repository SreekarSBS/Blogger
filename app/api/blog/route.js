import { ConnectDB } from "@/lib/config/db";
import BlogModel from "@/lib/models/BlogModel";
import {writeFile} from 'fs/promises'
const fs = require('fs');
const { NextResponse } = require("next/server")

const LoadDB = async()=>{
    await ConnectDB();
}

LoadDB(); // Api gets connected tro the database

// API Endpoint fr getting all blogs
export async function GET(request) {
    const blogId  =request.nextUrl.searchParams.get("id");
    if (blogId) {
        const blog = await BlogModel.findById(blogId);
    return NextResponse.json(blog);
    }
    const blogs = await BlogModel.find({});
    return NextResponse.json({blogs})
}

// API Endpoint for uploading blogs


export async function POST(request) {  // code to store the image in publlic folder
    const formData = await request.formData();
    const timestamp = Date.now();

    const image = formData.get('image');
    const imageByteData = await image.arrayBuffer();
    const buffer = Buffer.from(imageByteData);
    const path = `./public/${timestamp}_${image.name}`;
    await writeFile(path,buffer);
    const imgUrl = `/${timestamp}_${image.name}`;
    
    const blogData = {
        title : `${formData.get('title')}`,
        description : `${formData.get('description')}`,
        category: `${formData.get('category')}`,
        author : `${formData.get('author')}`,
        image : `${imgUrl}`,
        authorImg : `${formData.get('authorImg')}`
    }

    await BlogModel.create(blogData);
    console.log('Blog Saved');

    return NextResponse.json({sucess:true,msg : "Blog added"});
}

//Creating API Endpoint to delete Blog



export async function DELETE(request) {
    try {
        const body = await request.json(); // Get JSON body from request
        console.log('Received DELETE request:', body); // Debugging log
        const id = body.id;

        if (!id) {
            return new Response(JSON.stringify({ success: false, msg: 'ID is required' }), { status: 400 });
        }

        const blog = await BlogModel.findById(id);
        if (!blog) {
            return new Response(JSON.stringify({ success: false, msg: 'Blog not found' }), { status: 404 });
        }

        // Delete the associated image file
        fs.unlink(`./public${blog.image}`, (err) => {
            if (err) console.error('Error deleting image:', err);
        });

        await BlogModel.findByIdAndDelete(id);

        return new Response(JSON.stringify({ success: true, msg: 'Blog deleted successfully' }), { status: 200 });
    } catch (error) {
        console.error('DELETE Error:', error); // Log the actual error
        return new Response(JSON.stringify({ success: false, msg: 'Internal Server Error' }), { status: 500 });
    }
}
