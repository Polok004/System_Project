import React, { useState } from 'react';
import './blogCard.scss';
import { Link } from 'react-router-dom';

function BlogCard({ blog }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className={`blogCard ${isExpanded ? 'expanded' : ''}`}>
      <div className="blogInfo">
        {/* Blog Author Info */}
        <p className="blogAuthor">
          <img
            src={blog.author.avatar || '/default-avatar.png'}
            alt={blog.author.username}
            className="authorAvatar"
          />
          <span>{blog.author.username}</span>
        </p>

        {/* Blog Title */}
        <h3 className="blogTitle">{blog.title}</h3>

        {/* Blog Content */}
        <p className={`blogContent ${isExpanded ? 'expanded' : ''}`}>
          {blog.content}
        </p>

        {/* Toggle Expand Button */}
        <button className="readMoreButton" onClick={toggleExpand}>
          {isExpanded ? 'Show Less' : 'Read More'}
        </button>
      </div>
    </div>
  );
}

export default BlogCard;
