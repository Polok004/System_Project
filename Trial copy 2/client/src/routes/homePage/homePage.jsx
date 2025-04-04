import "./homePage.scss";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useState, useEffect } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import PropertyCard from "../../components/ListingCard/listingCard";
import HomeAgent from "../../components/homeAgent/homeAgent";
import BlogCard from "../../components/blogCard/blogCard";
import axios from "axios";
import apiRequest from "../../lib/apiRequest";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "swiper/css/effect-coverflow";
import ContactSection from '../../components/ContactSection/ContactSection';
import { Link } from 'react-router-dom';


function HomePage() {
  const { currentUser } = useContext(AuthContext);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [posts, setPosts] = useState([]);
  const [agents, setAgents] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const city = data.address.city || data.address.town || data.address.state;
            setCurrentLocation(city);
          } catch (err) {
            console.error("Error getting location:", err);
          }
        },
        (err) => {
          console.error("Location error:", err);
        }
      );
    }
  }, []);


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
  }, [currentLocation]);

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
                {currentUser && currentUser.role === 'user' && !currentUser.isAgent && (
                  <Link to="/be_an_agent" className="be-agent-btn">
                    Become an Agent
                  </Link>
                )}
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
          {isLoading ? (
            <p>Loading properties...</p>
          ) : posts.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={4}
              navigation
              pagination={{ clickable: true }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
              loop={true}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                  spaceBetween: 20
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 30
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 30
                },
                1280: {
                  slidesPerView: 4,
                  spaceBetween: 30
                }
              }}
            >
              {posts.map((post) => (
                <SwiperSlide key={post.id}>
                  <PropertyCard post={post} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p>No properties found.</p>
          )}
        </div>
      </section>

      <section className="agentsList">
        <div className="agentsSection">
          <h2>Top Real Estate Agents</h2>
          {isLoading ? (
            <p>Loading agents...</p>
          ) : agents.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={4}
              navigation
              pagination={{ clickable: true }}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
              loop={true}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                  spaceBetween: 10
                },
                640: {
                  slidesPerView: 2,
                  spaceBetween: 15
                },
                968: {
                  slidesPerView: 3,
                  spaceBetween: 20
                },
                1280: {
                  slidesPerView: 4,
                  spaceBetween: 20
                }
              }}
              className="agents-swiper"
            >
              {agents.map((agent) => (
                <SwiperSlide key={agent.id}>
                  <HomeAgent agent={agent} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p>No agents found.</p>
          )}
        </div>
      </section>

      <section className="blogList">
        <div className="blogsSection">
          <h2>Latest Blogs</h2>
          {isLoading ? (
            <p>Loading blogs...</p>
          ) : blogs.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={3}
              navigation
              pagination={{ clickable: true }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
              loop={true}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                  spaceBetween: 20
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 30
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 30
                }
              }}
            >
              {blogs.map((blog) => (
                <SwiperSlide key={blog.id}>
                  <BlogCard blog={blog} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p>No blogs found.</p>
          )}
        </div>
      </section>

      <ContactSection />
    </>
  );
}

export default HomePage;
