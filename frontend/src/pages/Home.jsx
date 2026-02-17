import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ===== Hero Section with Fullscreen Video ===== */}
      <section className="relative h-screen w-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source
            src="https://videos.pexels.com/video-files/3181792/3181792-uhd_3840_2160_25fps.mp4"
            type="video/mp4"
          />
        </video>
        {/* Video overlay */}
        <div className="absolute inset-0 bg-pink-900/30"></div>
        {/* Centered content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6 sm:px-8">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 drop-shadow-lg leading-snug">
            Unleash Your Inner Glow
          </h1>
          <p className="text-base sm:text-lg mb-6 max-w-2xl drop-shadow-md">
            Discover premium beauty products crafted to bring out your best look.
          </p>
          <Link
            to="/products"
            className="bg-pink-500 text-white px-6 sm:px-10 py-2 sm:py-3 rounded-full text-base sm:text-lg font-semibold hover:bg-pink-600 transition duration-300 shadow-md"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* ===== Footer Section ===== */}
      <footer className="bg-pink-600 text-white py-10 sm:py-12 mt-auto">
        <div className="max-w-6xl mx-auto px-6 grid gap-10 sm:gap-8 md:grid-cols-3 text-center md:text-left">
          {/* About Us */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">About Us</h3>
            <p className="text-sm sm:text-base leading-relaxed text-pink-100">
              We are a beauty-focused e-commerce platform bringing you the best
              products to enhance your glow. Our mission is to provide quality
              cosmetics that inspire confidence and style.
            </p>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm sm:text-base">
              <li>
                <Link to="/products" className="hover:underline">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          {/* Contact Info */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Contact</h3>
            <p className="text-sm sm:text-base text-pink-100">Email: support@beautyglow.com</p>
            <p className="text-sm sm:text-base text-pink-100">Phone: +91 98765 43210</p>
            <p className="text-sm sm:text-base text-pink-100">Address: 123 Beauty Street, City, Country</p>
          </div>
        </div>
        {/* Copyright/Bottom Line */}
        <div className="mt-8 text-center text-xs sm:text-sm text-pink-200 border-t border-pink-700 pt-4">
          &copy; {new Date().getFullYear()} BeautyGlow. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
