import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { toast } from "react-toastify";

const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddForm, setShowAddForm] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("none");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    image: "",
    stock: 0,
  });

  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data || []);
      } catch {
        alert("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const parsePrice = (p) => Number(String(p).replace(/[^0-9]/g, "") || 0);

  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => p.category && set.add(p.category));
    return ["All", ...Array.from(set)];
  }, [products]);

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete product?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("🗑️ Product Deleted Successfully!", {
        position: "top-right",
      });

      setProducts((prev) => prev.filter((p) => String(p._id) !== String(id)));
    } catch (err) {
      toast.error("Delete failed");
      console.log(err);
    }
  };
  // ADD PRODUCT (ID FIXED AS STRING)
  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.image) {
      alert("All fields required!");
      return;
    }

    const payload = {
      ...newProduct,
      price: newProduct.price.replace(/[^0-9]/g, ""),
      stock: Number(newProduct.stock),
    };

    try {
      const res = await api.post("/products", payload);

      // ⬇⬇ FIX: PUT NEW PRODUCT AT TOP + SHOW IT
      setProducts((prev) => [res.data, ...prev]);
      setSortOrder("none");           // 🔥 Sorting reset
      setCategoryFilter("All");       // 🔥 Show all products
      setCurrentPage(1);              // 🔥 Jump to page 1

      setShowAddForm(false);

      setNewProduct({
        name: "",
        category: "",
        price: "",
        image: "",
        stock: 0,
      });

    } catch {
      alert("Failed to add product");
    }
  };

  // STOCK TOGGLE (FIXED ID COMPARE)
  const toggleStockStatus = async (product) => {
    const updated = { ...product, stock: product.stock > 0 ? 0 : 10 };

    try {
      await api.put(`/products/${product._id}`, updated);
      setProducts((prev) =>
        prev.map((p) =>
          String(p._id) === String(product._id) ? updated : p
        )
      );
    } catch {
      alert("Stock update failed");
    }
  };

  // UPDATE PRODUCT (FIXED ID COMPARE)
  const handleUpdateProduct = async () => {
    const numericPrice =
      typeof editingProduct.price === "number"
        ? editingProduct.price
        : Number(editingProduct.price.replace(/[^0-9]/g, ""));

    const payload = {
      ...editingProduct,
      price: numericPrice,
      stock: Number(editingProduct.stock),
    };

    try {
      await api.put(
        `/products/${editingProduct._id}`,
        payload
      );
      setProducts((prev) =>
        prev.map((p) =>
          String(p._id) === String(editingProduct._id) ? payload : p
        )
      );
      setEditingProduct(null);

      toast.success("Product updated!", { position: "top-right" });
    } catch (err) {
      toast.error("Update failed");
      console.log(err);
    }
  };

  const filteredAndSorted = useMemo(() => {
    let list = [...products];

    const q = search.toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== "All") {
      list = list.filter((p) => p.category === categoryFilter);
    }

    if (sortOrder === "asc")
      list.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    if (sortOrder === "desc")
      list.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));

    return list;
  }, [products, search, categoryFilter, sortOrder]);

  const totalItems = filteredAndSorted.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginated = filteredAndSorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Manage Products</h1>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search..."
          className="border p-2 rounded w-full md:w-1/3"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border bg-black p-2 rounded w-full md:w-40"
        >
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border bg-black p-2 rounded w-full md:w-40"
        >
          <option value="none">Sort: None</option>
          <option value="asc">Low → High</option>
          <option value="desc">High → Low</option>
        </select>

        <button
          onClick={() => setShowAddForm((s) => !s)}
          className="bg-pink-700 text-white px-4 py-2 rounded w-full md:w-auto"
        >
          {showAddForm ? "Close" : "Add Product"}
        </button>
      </div>

      {/* ADD PRODUCT FORM */}
      {/* ADD PRODUCT POPUP MODAL */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-black p-6 rounded-lg shadow-xl w-[90%] max-w-lg relative">

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setShowAddForm(false)}
              className="absolute top-3 right-3 text-xl font-bold text-gray-700"
            >
              ✖
            </button>

            <h2 className="font-bold text-2xl mb-4 text-center">Add Product</h2>

            <form onSubmit={handleAddProduct} className="space-y-4">

              <input
                type="text"
                placeholder="Name"
                className="border p-2 w-full rounded"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Category"
                className="border p-2 w-full rounded"
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Price"
                className="border p-2 w-full rounded"
                value={newProduct.price ? `$${newProduct.price}` : ""}
                onChange={(e) => {
                  const numberOnly = e.target.value.replace(/[^0-9]/g, "");
                  setNewProduct({ ...newProduct, price: numberOnly });
                }}
              />

              <input
                type="text"
                placeholder="Image URL"
                className="border p-2 w-full rounded"
                value={newProduct.image}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, image: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Stock"
                className="border p-2 w-full rounded"
                value={newProduct.stock}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, stock: Number(e.target.value) })
                }
              />

              <button
                type="submit"
                className="bg-pink-700 w-full text-white py-2 rounded hover:bg-pink-800"
              >
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}


      {/* PRODUCT TABLE */}
      {!loading && (
        <div className="w-full overflow-x-auto rounded-lg shadow">
          <table className="min-w-max w-full border text-sm md:text-base">
            <thead className="bg-pink-600 text-white">
              <tr>
                <th className="px-2 py-2">#</th>
                <th className="px-2 py-2">Image</th>
                <th className="px-2 py-2">Name</th>
                <th className="px-2 py-2">Category</th>
                <th className="px-2 py-2">Price</th>
                <th className="px-2 py-2">Stock</th>
                <th className="px-2 py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((product, index) => {
                const isEditing = editingProduct?._id === product._id;

                return (
                  <tr key={product._id} className="border-b">
                    <td className="px-2 py-2">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>

                    <td className="px-2 py-2">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editingProduct.image}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              image: e.target.value,
                            })
                          }
                          className="border p-1 rounded w-24"
                        />
                      ) : (
                        <img
                          src={product.image}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                    </td>

                    <td className="px-2 py-2">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editingProduct.name}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              name: e.target.value,
                            })
                          }
                          className="border p-1 rounded w-28"
                        />
                      ) : (
                        product.name
                      )}
                    </td>

                    <td className="px-2 py-2">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editingProduct.category}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              category: e.target.value,
                            })
                          }
                          className="border p-1 rounded w-24"
                        />
                      ) : (
                        product.category
                      )}
                    </td>

                    <td className="px-2 py-2">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editingProduct.price}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              price: e.target.value.replace(/[^0-9]/g, ""),
                            })
                          }
                          className="border p-1 rounded w-20"
                        />
                      ) : (
                        `$${parsePrice(product.price)}`
                      )}
                    </td>


                    <td className="px-2 py-2">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editingProduct.stock}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              stock: Number(e.target.value),
                            })
                          }
                          className="border p-1 rounded w-20"
                        />
                      ) : product.stock > 0 ? (
                        <span className="text-green-700 font-semibold">
                          In Stock
                        </span>
                      ) : (
                        <span className="text-red-700 font-semibold">
                          Out of Stock
                        </span>
                      )}
                    </td>

                    <td className="px-2 py-2 flex flex-wrap gap-3 text-lg">
                      {isEditing ? (
                        <>
                          <button
                            onClick={handleUpdateProduct}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                          >
                            Save
                          </button>

                          <button
                            onClick={() => setEditingProduct(null)}
                            className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => toggleStockStatus(product)}
                            className="text-blue-600"
                          >
                            {product.stock > 0 ? <FaToggleOn /> : <FaToggleOff />}
                          </button>

                          <button
                            onClick={() => setEditingProduct(product)}
                            className="text-green-600"
                          >
                            <FaEdit />
                          </button>

                          <button
                            onClick={() => handleDelete(product._id)}
                            className="text-red-600"
                          >
                            <FaTrash />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINATION */}
      <div className="flex flex-col md:flex-row md:justify-between items-center mt-4 gap-3">
        <span className="text-sm md:text-base">
          Showing {(currentPage - 1) * itemsPerPage + 1}–
          {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
        </span>

        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 bg-black text-white rounded disabled:opacity-40"
          >
            Prev
          </button>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 bg-black text-white rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageProduct;
