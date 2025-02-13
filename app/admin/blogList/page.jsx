'use client'
import BlogTableItem from '@/Components/AdminComponents/BlogTableItem'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Page = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/blog');
      setBlogs(response.data.blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  }

  const deleteBlog = async (mongoId) => {
    try {
        console.log('Deleting blog with ID:', mongoId); // Debugging log
        const response = await axios.delete('/api/blog', {
            data: { id: mongoId } // Sending ID in request body
        });

        console.log('Response from server:', response.data); // Debugging log

        if (response.data.success) {
            toast.success(response.data.msg);
            await fetchBlogs(); // Refresh the list after successful deletion
        } else {
            toast.error(response.data.msg || 'Failed to delete blog');
        }
    } catch (error) {
        console.error('Error deleting blog:', error.response?.data || error);
        toast.error('Failed to delete blog');
    }
};


  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16'>
      <h1>All Blogs</h1>
      <div className='relative h-[80vh] max-w-[850px] overflow-x-auto mt-4 border border-gray-400 scrollbar-hide'>
        <table className='w-full text-sm text-gray-500'>
          <thead className='text-sm text-gray-700 text-left uppercase bg-gray-50'>
            <tr>
              <th scope='col' className='px-6 py-3'>
                Author Name
              </th>
              <th scope='col' className='px-6 py-3'>
                Blog Title
              </th>
              <th scope='col' className='px-6 py-3'>
                Date
              </th>
              <th scope='col' className='px-6 py-3'>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-4">Loading...</td>
              </tr>
            ) : blogs.length > 0 ? (
              blogs.map((item, index) => (
                <BlogTableItem
                  key={item._id || index}
                  mongoId={item._id}
                  authorImg={item.authorImg}
                  author={item.author}
                  title={item.title}
                  date={item.date}
                  deleteBlog={deleteBlog}
                />
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">No blogs found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Page;