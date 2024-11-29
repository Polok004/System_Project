import SearchBar from "../../components/searchBar/SearchBar";
import "./homePage.scss";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

import { useState, useEffect } from 'react';
import PropertyCard from "../../components/ListingCard/listingCard";
import axios from 'axios';
import apiRequest from "../../lib/apiRequest";
import Categories from "../../components/categories/categories";

function HomePage() {
  const { currentUser } = useContext(AuthContext);

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await apiRequest.get('/home/random'); // Correct relative path
        setPosts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
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

    <section className="categories">

           <Categories />

    </section>
    </>
  );
}

export default HomePage;
