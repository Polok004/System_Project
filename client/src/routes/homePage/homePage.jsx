import "./homePage.scss";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useState, useEffect } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import PropertyCard from "../../components/ListingCard/listingCard";
import HomeAgent from "../../components/homeAgent/homeAgent";
import BlogCard from "../../components/blogCard/blogCard";
import axios from "axios";
import apiRequest from "../../lib/apiRequest";

function HomePage() {
  const { currentUser } = useContext(AuthContext);

  const [posts, setPosts] = useState([]);
  const [agents, setAgents] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await apiRequest.get("/home/random"); // Correct relative path
        setPosts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAgents = async () => {
      try {
        const response = await apiRequest.get("/home/randomAgents"); // Replace with your endpoint
        setAgents(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to fetch agents:", error);
        setAgents([]);
      }
    };

    const fetchLatestBlogs = async () => {
      try {
        const response = await apiRequest.get("/home/latestBlog"); // Correct relative path to the blog API
        setBlogs(Array.isArray(response.data) ? response.data : []); // Safeguard against unexpected responses
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
        setBlogs([]); // Handle errors by setting an empty array
      }
    };
    
  
      
    fetchPosts();
    fetchAgents();
    fetchLatestBlogs();
  }, []);

  return (
    <>
      <section className="home">
        <div className="homePage">
          <div className="textContainer">
            <div className="wrapper">
              <h1 className="title">Find Real Estate & Get Your Dream Place</h1>
              <p>
                Explore a wide variety of properties, connect with real estate
                agents, and discover your next dream home!
              </p>
              <SearchBar />
              <div className="boxes">
                <div className="box">
                  <h1>16+</h1>
                  <h2>Years of Experience</h2>
                </div>
                <div className="box">
                  <h1>200</h1>
                  <h2>Awards Gained</h2>
                </div>
                <div className="box">
                  <h1>2000+</h1>
                  <h2>Properties Ready</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="imgContainer">
            <img src="/bg.png" alt="Real estate background" />
          </div>
        </div>
      </section>

      <section className="propertyList">
        <div className="propertiesSection">
          <h2>Explore Properties</h2>
          <div className="propertiesGrid">
            {isLoading ? (
              <p>Loading properties...</p>
            ) : posts.length > 0 ? (
              posts.map((post) => <PropertyCard key={post.id} post={post} />)
            ) : (
              <p>No properties found.</p>
            )}
          </div>
        </div>
      </section>

      <section className="agentsList">
        <div className="agentsSection">
          <h2>Top Real Estate Agents</h2>
          <div className="agentsGrid">
  {agents.length > 0 ? (
    agents.map((agent) => (
      <HomeAgent key={agent.id} agent={agent} />
    ))
  ) : (
    <p>No agents found.</p>
  )}
</div>
        </div>
      </section>



      <section className="blogList">
      <div className="blogsSection">
        <h2>Latest Blogs</h2>
        <div className="blogsGrid">
          {isLoading ? (
            <p>Loading blogs...</p>
          ) : blogs.length > 0 ? (
            blogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)
          ) : (
            <p>No blogs found.</p>
          )}
        </div>
      </div>
    </section>

    </>
  );
}

export default HomePage;
