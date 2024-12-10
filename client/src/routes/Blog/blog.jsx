import React, { useState } from "react";
import apiRequest from "../../lib/apiRequest";
import "./blog.scss"; // Import the new CSS file for styles

function Blog() {
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // ✅ Success message state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear any previous error messages
    setSuccessMessage(""); // Clear previous success message

    try {
      if (!formData.title || !formData.content) {
        setError("Title and content are required.");
        setLoading(false);
        return;
      }

      const response = await apiRequest.post("/blogs", formData);

      setFormData({ title: "", content: "" }); // Reset the form
      setSuccessMessage("🎉 Blog created successfully!"); // ✅ Show success message
      console.log("Blog created successfully:", response.data);
    } catch (error) {
      console.error("Error creating blog:", error);
      setError("Failed to create blog. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="blog-form-container">
      <div className="blog-form">
        <h1 className="form-title">📝 Create a New Blog</h1>

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>} {/* ✅ Success message display */}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="title">Blog Title</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter the title of your blog"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="content">Blog Content</label>
            <textarea
              id="content"
              name="content"
              placeholder="Write your amazing blog content here..."
              value={formData.content}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button className="submit-button" type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Create Blog"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Blog;
