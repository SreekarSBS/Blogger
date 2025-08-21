import React, { useEffect, useState } from 'react';
import Blogitem from './Blogitem';
import axios from 'axios';

const BlogList = () => {
  const [menu, setMenu] = useState("All");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/blog');
      setBlogs(response.data.blogs || []);
      console.log("Fetched blogs:", response.data.blogs);
    } catch (err) {
      setError("Failed to fetch blogs");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  if (loading) return <div>Loading blogs...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div className='flex justify-center gap-6 my-10'>
        <button onClick={() => setMenu('All')} className={menu === 'All' ? 'bg-black text-white py-1 px-4 rounded-sm' : ""}>All</button>
        <button onClick={() => setMenu('Technology')} className={menu === 'Technology' ? 'bg-black text-white py-1 px-4 rounded-sm' : ""}>Technology</button>
        <button onClick={() => setMenu('Startup')} className={menu === 'Startup' ? 'bg-black text-white py-1 px-4 rounded-sm' : ""}>Startup</button>
        <button onClick={() => setMenu('Lifestyle')} className={menu === 'Lifestyle' ? 'bg-black text-white py-1 px-4 rounded-sm' : ""}>Lifestyle</button>
      </div>
      <div className='flex flex-wrap justify-around gap-1 gap-y-10 mb-16 xl:mx-24'>
        {blogs.length === 0 ? (
          <p>No blogs available.</p>
        ) : (
          blogs.filter((item) => menu === 'All' ? true : item.category === menu).map((item, index) => (
            <Blogitem key={index} id={item._id} image={item.image} title={item.title} description={item.description} category={item.category} />
          ))
        )}
      </div>
    </div>
  );
};

export default BlogList;