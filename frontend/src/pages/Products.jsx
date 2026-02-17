import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { toast } from "react-toastify";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const itemsPerPage = 8;

  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  const [searchParams, setSearchParams] = useSearchParams();

  const searchTerm = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "all";
  const sortOrder = searchParams.get("sort") || "none";

  const [searchInput, setSearchInput] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchParams({
        search: searchInput,
        category: selectedCategory,
        sort: sortOrder,
      });
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchInput]);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const productsRes = await api.get("/products", {
          params: {
            search: searchTerm,
            category: selectedCategory,
            sort: sortOrder,
            page: currentPage,
            limit: itemsPerPage,
          },
        });

        // Extract paginated data from response
        const { products: fetchedProducts, totalPages: pages, totalProducts: total } = productsRes.data;

        setProducts(fetchedProducts);
        setTotalPages(pages);
        setTotalProducts(total);
      } catch (error) {
        console.error("Error fetching filtered products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFilteredProducts();
  }, [searchTerm, selectedCategory, sortOrder, currentPage]);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const handleWishlistToggle = (product) => {
    toggleWishlist(product);
  };

  const updateSearchParams = (newParams) => {
    setSearchParams({
      search: newParams.search ?? searchTerm,
      category: newParams.category ?? selectedCategory,
      sort: newParams.sort ?? sortOrder,
    });
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="p-6 bg-pink-50 min-h-screen">
        <h2 className="text-4xl font-bold mb-6 text-center text-pink-600">
          All Products
        </h2>

        {/* Filter + Sort + Search Bar */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6 px-6 py-6 bg-gradient-to-r from-pink-100 via-white to-pink-100 rounded-2xl shadow-lg border border-pink-200 mb-10 backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) =>
                  updateSearchParams({ category: e.target.value })
                }
                className="appearance-none px-5 py-2.5 border border-pink-300 rounded-full bg-white text-gray-700 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all"
              >
                <option value="all"> All Categories</option>
                <option value="perfume"> Perfumes</option>
                <option value="lipstick"> Lipsticks</option>
                <option value="skincare"> Skincare</option>
                <option value="brush"> Brushes</option>
                <option value="mascara"> Mascara</option>
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortOrder}
                onChange={(e) => updateSearchParams({ sort: e.target.value })}
                className="appearance-none px-5 py-2.5 border border-pink-300 rounded-full bg-white text-gray-700 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all"
              >
                <option value="none"> Sort by</option>
                <option value="lowToHigh"> Price: Low → High</option>
                <option value="highToLow"> Price: High → Low</option>
              </select>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder=" Search your favorite product..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full border border-pink-300 rounded-full px-5 py-2.5 pl-10 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all placeholder-gray-400"
            />
            <span className="absolute left-4 top-2.5 text-pink-400">🔎</span>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="text-center mt-10 text-xl text-pink-500">
            Updating results...
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-10 px-4 sm:px-6 lg:px-10">
              {products.map((product) => {
                const isWishlisted = wishlist.some(
                  (wishItem) => wishItem._id === product._id
                );
                return (
                  <div
                    key={product._id}
                    className={`border rounded-2xl shadow-md transition p-5 text-center bg-white relative duration-300 ${product.stock === 0 ? "opacity-50 grayscale" : "hover:-translate-y-1 hover:border-pink-300"
                      }`}
                  >
                    {/* Wishlist Button */}
                    <button
                      onClick={() => handleWishlistToggle(product)}
                      disabled={product.stock === 0}
                      className={`absolute top-3 right-3 text-xl transition z-10 ${product.stock === 0 ? "cursor-not-allowed opacity-40" : ""
                        }`}
                    >
                      {isWishlisted ? "❤️" : "🤍"}
                    </button>

                    {/* OUT OF STOCK BADGE */}
                    {product.stock === 0 && (
                      <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full shadow-md">
                        OUT OF STOCK
                      </span>
                    )}

                    {/* Product Image */}
                    <Link
                      to={`/products/${product.category}/${product._id}`}
                      className={product.stock === 0 ? "pointer-events-none" : ""}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-64 object-cover rounded-lg mb-4"
                      />

                      <h3 className="text-lg font-semibold text-gray-800 hover:text-pink-600">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Price */}
                    <p className="text-gray-700 mt-2 font-medium">${product.price}</p>

                    {/* STOCK STATUS */}
                    <p
                      className={`mt-1 font-semibold text-sm ${product.stock > 0 ? "text-green-600" : "text-red-600"
                        }`}
                    >
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </p>

                    {/* LOW STOCK WARNING (≤5) */}
                    {product.stock > 0 && product.stock <= 5 && (
                      <p className="text-red-500 font-semibold mt-1 text-sm">
                        ⚠️ Only {product.stock} left!
                      </p>
                    )}

                    {/* Buttons */}
                    <div className="mt-4 flex justify-center space-x-3">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        className={`text-white px-4 py-2 rounded-lg transition text-sm flex-1 ${product.stock === 0
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-pink-500 hover:bg-pink-600"
                          }`}
                      >
                        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                      </button>

                      <Link
                        to={`/products/${product.category}/${product._id}`}
                        className={`border px-4 py-2 rounded-lg transition text-sm flex-1 ${product.stock === 0
                          ? "border-gray-400 text-gray-400 cursor-not-allowed"
                          : "text-pink-600 border-pink-500 hover:bg-pink-100"
                          }`}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>

                );
              })}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-pink-400 text-white rounded-lg disabled:opacity-50"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-2 rounded-lg ${currentPage === index + 1
                    ? "bg-pink-600 text-white"
                    : "bg-white border border-pink-300 text-pink-600 hover:bg-pink-100"
                    }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-pink-400 text-white rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-600 mt-10 text-lg">
            No products found for “{searchTerm}”
          </p>
        )}
      </div>

      {/* ===== FOOTER SECTION ===== */}
      <footer className="bg-pink-600 text-white py-10 sm:py-12 mt-16">
        <div className="max-w-6xl mx-auto px-6 grid gap-10 sm:gap-8 md:grid-cols-3 text-center md:text-left">
          {/* About Us */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
              About Us
            </h3>
            <p className="text-sm sm:text-base leading-relaxed text-pink-100">
              We are a beauty-focused e-commerce platform bringing you the best
              products to enhance your glow. Our mission is to provide quality
              cosmetics that inspire confidence and style.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm sm:text-base">
              <li>
                <Link to="/category" className="hover:underline">
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
              <li>
                <Link to="/faq" className="hover:underline">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
              Contact
            </h3>
            <p className="text-sm sm:text-base text-pink-100">
              Email: support@beautyglow.com
            </p>
            <p className="text-sm sm:text-base text-pink-100">
              Phone: +91 98765 43210
            </p>
            <p className="text-sm sm:text-base text-pink-100">
              Address: 123 Beauty Street, City, Country
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-xs sm:text-sm text-pink-200 border-t border-pink-700 pt-4">
          &copy; {new Date().getFullYear()} BeautyGlow. All rights reserved.
        </div>
      </footer>
    </>
  );
};

export default ProductPage;
