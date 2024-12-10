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
      {/* Blog Information */}
      <div className="blogInfo">
        <p className="blogAuthor">
          <img
            src={blog.author.avatar || '/default-avatar.png'}
            alt={blog.author.username}
            className="authorAvatar"
          />
          <span>{blog.author.username}</span>
        </p>
        <h3 className="blogTitle">{blog.title}</h3>

        {/* Conditionally show full or truncated content */}
        <p className="blogContent">
          {isExpanded ? blog.content : `${blog.content.slice(0, 120)}...`}
        </p>

        {/* Toggle button */}
        <button className="readMoreButton" onClick={toggleExpand}>
          {isExpanded ? 'Show Less' : 'Read More'}
        </button>
      </div>
    </div>
  );
}

export default BlogCard;
