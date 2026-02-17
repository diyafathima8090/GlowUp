import React, { useState } from "react";
import { Link } from "react-router-dom";


const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Send message to Gmail using mailto:
  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, message } = formData;

    const mailtoLink = `mailto:thasnee8090@gmail.com?subject=Message from ${encodeURIComponent(
      name
    )}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    )}`;

    window.location.href = mailtoLink;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Contact Section */}
      <div
        className="min-h-screen flex justify-center items-center bg-cover bg-center bg-no-repeat px-6"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/1115128/pexels-photo-1115128.jpeg?auto=compress&cs=tinysrgb&w=1920')",
        }}
      >
        <div className="max-w-5xl w-full bg-white/10 backdrop-blur-md mt-20 px-6 py-20 sm:py-24 rounded-2xl shadow-xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>

          <p className="text-lg text-gray-900 mb-8">
            Have questions, feedback or need help? Reach out to our support team!
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="font-semibold text-gray-900">
                Email: <span className="text-gray-800">thasnee8090@gmail.com</span>
              </p>
              <p className="font-semibold text-gray-900">
                Phone: <span className="text-gray-800">+91 9567288224</span>
              </p>
              <p className="font-semibold text-gray-900">
                Address:{" "}
                <span className="text-gray-800">
                  123 Main Street, New York, USA
                </span>
              </p>
            </div>

            {/* Contact Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded"
                required
              />

              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded"
                required
              >
              </textarea>

              <button
                type="submit"
                className="bg-pink-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-pink-700 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ===== Footer Section ===== */}
      <footer className="bg-pink-600 text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6 grid gap-10 sm:gap-8 md:grid-cols-3 text-center md:text-left">

          {/* About Us */}
          <div>
            <h3 className="text-xl font-bold mb-4">About Us</h3>
            <p className="text-sm leading-relaxed text-pink-100">
              BeautyGlow is your trusted destination for premium beauty and self-care
              products. We bring quality, style, and confidence together in one place.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/category" className="hover:text-pink-300 transition">Shop</Link></li>
              <li><Link to="/about" className="hover:text-pink-300 transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-pink-300 transition">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-pink-300 transition">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p className="text-sm text-pink-100">Email: support@beautyglow.com</p>
            <p className="text-sm text-pink-100">Phone: +91 98765 43210</p>
            <p className="text-sm text-pink-100">Address: 123 Beauty Street, City, Country</p>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-10 text-center text-sm text-pink-200 border-t border-pink-700 pt-4">
          © {new Date().getFullYear()} BeautyGlow • All Rights Reserved
        </div>
      </footer>
    </div>
  );
};
export default Contact;


