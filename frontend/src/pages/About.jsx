import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Wand2, Headset } from "lucide-react";

const About = () => {
  return (
    <div className="about-bg min-h-screen flex flex-col">
      {/* TOP BIG TITLE WITH ANIMATION */}
<div className="text-center mt-40 mx-70">
  <h1 className="text-10xl md:text-9xl font-[Cinzel] tracking-[0.25em] uppercase mb-6">
    <span className="text-pink-600 font-bold glowup-animate">
      GLOWUP
    </span>
  </h1>

  <h2>
    <span className="text-gray-900 mb-6">
      The word cosmetics comes from the Greek kosmetikos, meaning
    </span>
    <span className="text-2xl text-pink-600"> "GLOWUP"</span>
  </h2>
</div>
      {/* ABOUT CONTENT */}
      <div className="max-w-6xl mx-auto mt-24 px-6 grid md:grid-cols-2 gap-12 items-start">
        
        {/* LEFT SIDE TEXT */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6"> Cosmetic</h1>

          <p className="text-gray-600 leading-relaxed mb-6">
            Cosmetics are substances that are intended for application to the body
            for cleansing, beautifying, promoting attractiveness, or altering appearance.
            They can be natural or synthetic and are widely used for skincare and makeup.
            Although modern makeup has been traditionally used mainly by women, men also use 
            makeup in order to enhance their own facial features or cover blemishes and dark 
            circles. The negative stigma of men wearing makeup in countries such as the United
             States has weakened over the years, with the number of men using makeup increasing
              in the 21st century.[18] Cosmetics brands have increasingly targeted men in the 
              sale of cosmetics, with some products targeted specifically at men.
          </p>

          <p className="text-gray-600 leading-relaxed mb-6">
            The word cosmetics comes from the Greek kosmetikos, meaning "skilled in arranging."
          </p>

          <p className="text-gray-700 mt-10">
            Any questions? Visit us at 8th floor, 379 Hudson St, New York, NY 10018  
            or call (+1) 96 716 6879
          </p>
        </div>

        {/* IMAGE 1 */}
       <div className="relative">
  <div className="absolute top-6 left-6 w-full h-full border border-gray-300"></div>

  <img
    src="https://images-static.nykaa.com/creatives/58972ccd-c185-40f7-9e00-12c1d6da9d25/default.jpg?tr=cm-pad_resize,w-450"
    alt="About"
    className="relative z-10 rounded-sm transition-transform duration-500 ease-out hover:-translate-y-3"
  />
</div>

        {/* IMAGE 2 */}
    <div className="relative">
  <div className="absolute top-6 left-6 w-full h-full border border-gray-300"></div>

  <img
    src="https://images-static.nykaa.com/uploads/97102f15-3762-4a17-90b7-1f08578330bc.jpg?tr=cm-pad_resize,w-900"
    alt="About"
    className="relative z-10 rounded-sm transition-transform duration-500 ease-out hover:-translate-y-3"
  />
</div>


        {/* SECOND TEXT BLOCK */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Natural features</h1>

          <p className="text-gray-600 leading-relaxed mb-6">
            Cosmetics designed for skincare help cleanse, exfoliate, protect,
            and replenish the skin using lotions, cleansers, toners, moisturizers,
            and more.
          </p>

          <p className="text-gray-600 leading-relaxed mb-6">
            Makeup enhances appearance, conceals blemishes, and adds beauty.
            Today, many men also use makeup, and cosmetics brands increasingly
            target male consumers.Cosmetics designed to enhance one's appearance (makeup) can be used to conceal blemishes, enhance one's natural features, or add color to a person's face. In some cases, more extreme forms of makeup are used for performances, fashion shows, and people in costume and can change the appearance of the face entirely to resemble a different person, creature, or object. Techniques for changing appearance include contouring, which aims to give shape to an area of the face.
            Cosmetics designed to enhance one's appearance (makeup) can be used to conceal blemishes, enhance one's natural features, or add color to a person's face. In some cases, more extreme forms of makeup are used for performances, fashion shows, and people in costume and can change the appearance of the face entirely to resemble a different person, creature, or object. Techniques for changing appearance include contouring, which aims to give shape to an area of the face.
          </p>

          <p className="text-gray-700 mt-10">
            Any questions? Visit us at 8th floor, 379 Hudson St, New York, NY 10018  
            or call (+1) 96 716 6879
          </p>
        </div>
      </div>
      {/* ================= FEATURE HIGHLIGHTS SECTION ================= */}
<div className="bg-gray-50 py-10 mt-20">
  <h1 className="text-4xl font-bold mb-6 text-center text-pink-600">HIGHLIGHTS </h1>
  <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center mt-12 mb-8">

    {/* SECURE PAYMENTS */}
    <div className="flex flex-col items-center">
      <div className="mb-4">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
          <ShieldCheck className="text-blue-400 w-10 h-10" />
        </div>
      </div>
      <h3 className="text-xl font-medium text-gray-800 mb-2">100% Secure Payments</h3>
      <p className="text-sm text-gray-500">All major credit & debit cards accepted.</p>
    </div>

    {/* BEAUTY ASSISTANT */}
    <div className="flex flex-col items-center">
      <div className="mb-4">
        <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center">
          <Wand2 className="text-pink-400 w-10 h-10" />
        </div>
      </div>
      <h3 className="text-xl font-medium text-gray-800 mb-2">Beauty Assistant</h3>
      <p className="text-sm text-gray-500 px-4">Tell me what you are looking for and I will work my magic to help you find your perfect match.</p>
    </div>

    {/* HELP CENTER */}
    <div className="flex flex-col items-center">
      <div className="mb-4">
        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center">
          <Headset className="text-orange-400 w-10 h-10" />
        </div>
      </div>
      <h3 className="text-xl font-medium text-gray-800 mb-2">Help Center</h3>
      <p className="text-sm text-gray-500 px-4">Got a question? Look no further. Browse FAQs or submit your query.</p>
    </div>

  </div>

  {/* SOCIAL MEDIA ICONS */}
  <div className="text-center mt-10">
    <p className="text-gray-700 font-semibold">
      Show us some love  on social media
    </p>

    <div className="flex items-center justify-center space-x-6 mt-4 text-gray-800">
      <i className="fab fa-instagram text-2xl hover:text-pink-600 cursor-pointer"></i>
      <i className="fab fa-facebook text-2xl hover:text-pink-600 cursor-pointer"></i>
      <i className="fab fa-youtube text-2xl hover:text-pink-600 cursor-pointer"></i>
      <i className="fab fa-twitter text-2xl hover:text-pink-600 cursor-pointer"></i>
      <i className="fab fa-pinterest text-2xl hover:text-pink-600 cursor-pointer"></i>
    </div>
  </div>
</div>


      {/* ================= FOOTER SECTION ================= */}
      <footer className="bg-pink-600 text-white py-12 mt-20">
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

          {/* Contact */}
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

export default About;
