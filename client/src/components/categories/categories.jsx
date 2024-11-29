//import { categories } from "../data";
//import "./categories.scss"
import { Link } from "react-router-dom";
import React from "react";
import {VscSettings} from "react-icons/vsc"
import { Swiper, SwiperSlide } from "swiper/react";
import {Autoplay} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";


const Categories = () => {
 return (
    <section className='max-padd-container'>
    <div className="max-padd-container bg-primary  py-16 x1:py-32 rounded-3xl">
        <span className="medium-text">Your Dream Home</span>
        <h2 className="h2">Choose a Category</h2>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus
            accusamus asperiores quos.
        </p>    
            <div className="flexBetween mt-12 mb-8 ">
                 <Link to={'/'} className="big-white text-3xl rounded-md h-10 w-10 p-2 border">{VscSettings}</Link>
            </div>

            {/* categories */}
            <Swiper
            autoplay={{
                delay: 2500,
                disableOnInteraction: false,
            }}
            breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 4,
                  spaceBetween: 40,
                },
                1024: {
                  slidesPerView: 5,
                  spaceBetween: 50,
                },
            }} 
            modules={[Autoplay]}
            className="h-[488px] md:h-[533px] xl:h-[422px] mt-5"
            >
            


            </Swiper>
        </div>
    </section>
 );  
};

export default Categories;