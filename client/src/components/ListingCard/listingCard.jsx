import React from 'react';
import './listingCard.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Link } from 'react-router-dom';

function PropertyCard({ post }) {
  return (
    <div className="propertyCard">
      {/* Image Slider */}
      <div className="imageWrapper">
        <Swiper spaceBetween={10} slidesPerView={2} className="imageSlider">
          {post.images.map((image, index) => (
            <SwiperSlide key={index}>
              <img src={image} alt={`Property Image ${index + 1}`} className="propertyImage" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Property Information */}
      <div className="propertyInfo">
        <h3 className="propertyTitle">{post.title}</h3>
        <p className="propertyAddress">{post.address}, {post.city}</p>
        <p className="propertyPrice">${post.price.toLocaleString()}</p>
        <div className="propertyDetails">
          <span>{post.bedroom} Beds</span>
          <span>{post.bathroom} Baths</span>
        </div>
        <button className="viewDetailsButton"><Link to={`/${post.id}`} className="viewDetailsButton">
          View Details
        </Link></button>
      </div>
    </div>
  );
}

export default PropertyCard;
