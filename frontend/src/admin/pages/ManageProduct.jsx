import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Edit3,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Package,
  BarChart3,
  Layers,
  ChevronLeft,
  ChevronRight,
  X,
  PlusCircle,
  IndianRupee,
  Activity
} from "lucide-react";


const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [sortOrder, setSortOrder] = useState("none");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 8;

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    image: "",
    stock: 0,
  });

  const [editingProduct, setEditingProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get("/admin/products", {
          params: {
            search,
            category: categoryFilter,
            sort: sortOrder,
            page: currentPage,
            limit: itemsPerPage
          },
        });
        const { products, totalItems, totalPages } = res.data;
        setProducts(Array.isArray(products) ? products : []);
        setTotalItems(totalItems || 0);
        setTotalPages(totalPages || 1);
      } catch (err) {
        console.error("Fetch products error:", err);
        toast.error("Network synchronization failed");
      } finally {
        setLoading(false);
      }
    };

    const handler = setTimeout(() => {
      fetchProducts();
    }, 400);

    return () => clearTimeout(handler);
  }, [search, categoryFilter, sortOrder, currentPage]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/admin/products", { params: { limit: 1000 } });
        const allProds = Array.isArray(res.data.products) ? res.data.products : [];
        const set = new Set();
        allProds.forEach((p) => p.category && set.add(p.category));
        setCategories(["All", ...Array.from(set)]);
      } catch (err) {
        console.error("Fetch categories error:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Archive Product?",
      text: "This product will be removed from the boutique.",
      icon: "warning",
      showCancelButton: true,
      background: '#1b0a24',
      color: '#fff',
      confirmButtonColor: '#db2777',
      cancelButtonColor: '#4b5563',
      confirmButtonText: "Yes, archive it!"
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/products/${id}`);
      toast.success("Artifact purged from registry");
      setProducts((prev) => prev.filter((p) => String(p._id) !== String(id)));
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.category || !newProduct.price || (!newProduct.image && !imageFile) || !newProduct.description) {
      toast.warn("Incomplete manifest entry");
      return;
    }

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("category", newProduct.category.toLowerCase());
    formData.append("price", newProduct.price.replace(/[^0-9]/g, ""));
    formData.append("description", newProduct.description);
    formData.append("stock", newProduct.stock);

    if (imageFile) formData.append("image", imageFile);
    else formData.append("image", newProduct.image);
    try {
      const res = await api.post("/products", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProducts((prev) => [res.data, ...prev]);
      setShowAddForm(false);
      setImageFile(null); 
      setNewProduct({ name: "", category: "", price: "", description: "", image: "", stock: 0 });
      toast.success(" New product registered");
    } catch (err) {
      console.error("Add Product Error:", err);
      console.error("Response data:", err.response?.data);
      const errorMsg = err.response?.data?.message || "Deployment failed";
      toast.error(`${errorMsg} (Status: ${err.response?.status || 'network'})`);
    }
  };

  const toggleStockStatus = async (product) => {
    const updated = { ...product, stock: product.stock > 0 ? 0 : 15 };
    try {
      await api.put(`/products/${product._id}`, updated);
      setProducts((prev) => prev.map((p) => String(p._id) === String(product._id) ? updated : p));
      toast.info(`Inventory status toggled`);
    } catch {
      toast.error("Sync error");
    }
  };

  const handleUpdateProduct = async () => {
    const numericPrice = typeof editingProduct.price === "number"
      ? editingProduct.price
      : Number(editingProduct.price.replace(/[^0-9]/g, ""));

    const formData = new FormData();
    formData.append("name", editingProduct.name);
    formData.append("category", editingProduct.category.toLowerCase());
    formData.append("price", numericPrice);
    formData.append("description", editingProduct.description);
    formData.append("stock", editingProduct.stock);

    if (editImageFile) formData.append("image", editImageFile);
    else formData.append("image", editingProduct.image);

    try {
      const res = await api.put(`/products/${editingProduct._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setProducts((prev) => prev.map((p) => String(p._id) === String(editingProduct._id) ? res.data : p));
      setEditingProduct(null);
      setEditImageFile(null);
      toast.success("Manifest record updated");
    } catch (err) {
      console.error("Update Product Error:", err);
      console.error("Response data:", err.response?.data);
      const errorMsg = err.response?.data?.message || "Edit failed";
      toast.error(`${errorMsg} (Status: ${err.response?.status || 'network'})`);
    }
  };

  return (
    <div className="p-0 md:p-6 w-full max-w-full overflow-hidden animate-in fade-in duration-700">

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 tracking-tight mb-2">
            Products
          </h1>
          <p className="text-gray-400 text-sm font-medium italic">Curate and manage the boutique's digital collection</p>
        </div>

        {/* QUICK STATS */}
        <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <div className="flex-none bg-[#1b0a24]/80 border border-pink-500/10 p-4 rounded-3xl flex items-center gap-4 backdrop-blur-md shadow-xl min-w-[160px]">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-400">
              <BarChart3 size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Total Products</p>
              <p className="text-xl font-black text-white">{totalItems}</p>
            </div>
          </div>

          <div className="flex-none bg-[#1b0a24]/80 border border-orange-500/10 p-4 rounded-3xl flex items-center gap-4 backdrop-blur-md shadow-xl min-w-[160px]">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400">
              <Activity size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">In Stock</p>
              <p className="text-xl font-black text-white">{products.filter(p => p.stock > 0).length}</p>
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(true)}
            className="flex-none bg-gradient-to-br from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold px-6 rounded-3xl flex items-center gap-2 shadow-xl shadow-pink-600/20 active:scale-95 transition-all outline-none h-[80px]"
          >
            <PlusCircle size={24} />
            <span className="uppercase tracking-widest text-[10px]">New Record</span>
          </button>
        </div>
      </div>

      {/* FILTER BAR - PREMIUM DESIGN */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-10">
        <div className="lg:col-span-2 relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-pink-400 group-focus-within:text-pink-300 transition-colors">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="search products database..."
            className="w-full bg-[#1b0a24]/50 border border-white/5 group-hover:border-pink-500/30 group-focus-within:border-pink-500/50 text-white pl-14 pr-6 py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-500/10 transition-all placeholder-gray-600 shadow-xl backdrop-blur-sm"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-pink-400">
            <Layers size={16} />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-[#1b0a24]/50 border border-white/5 hover:border-pink-500/30 text-white pl-14 pr-10 py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-500/10 transition-all appearance-none cursor-pointer text-[10px] font-black uppercase tracking-[0.2em]"
          >
            {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
          </select>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-pink-400/30">
            <Filter size={14} />
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-pink-400">
            <ArrowUpDown size={16} />
          </div>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full bg-[#1b0a24]/50 border border-white/5 hover:border-pink-500/30 text-white pl-14 pr-10 py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-500/10 transition-all appearance-none cursor-pointer text-[10px] font-black uppercase tracking-[0.2em]"
          >
            <option value="none">Sort: Stream</option>
            <option value="asc">Valuation: Low</option>
            <option value="desc">Valuation: High</option>
          </select>
        </div>
      </div>

      {/* MODAL: ADD PRODUCT */}
      {showAddForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xl transition-opacity animate-in fade-in duration-500" onClick={() => setShowAddForm(false)} />
          <div className="relative w-full max-w-2xl bg-[#0a050d] border border-white/10 rounded-[2.5rem] shadow-[0_0_80px_rgba(219,39,119,0.15)] overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="h-2 w-full bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500" />
            <div className="p-10 max-h-[85vh] overflow-y-auto custom-scrollbar">
              <button onClick={() => setShowAddForm(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-all bg-white/5 p-2.5 rounded-2xl"><X size={20} /></button>
              <div className="mb-10">
                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 tracking-tighter uppercase italic">ADD Product</h2>
                <p className="text-gray-500 text-xs mt-2 uppercase tracking-[0.3em] font-bold">New manifest entry specification</p>
              </div>

              <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-pink-500/60 uppercase tracking-[0.2em] block mb-3 ml-1">Asset Nomenclature</label>
                  <input
                    type="text"
                    placeholder="e.g. Midnight Amethyst Serum"
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:bg-white/[0.08] transition-all placeholder-gray-700 font-medium"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-pink-500/60 uppercase tracking-[0.2em] block mb-3 ml-1">Category</label>
                  <select
                    className="w-full bg-black/50 border border-white/5 rounded-2xl py-4 px-6 text-white appearance-none cursor-pointer focus:ring-2 focus:ring-pink-500/20 outline-none"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  >
                    <option value="" disabled>Select</option>
                    <option value="skincare">Skincare</option>
                    <option value="lipstick">Lipstick</option>
                    <option value="perfume">Perfume</option>
                    <option value="brush">Brush</option>
                    <option value="mascara">Mascara</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black text-pink-500/60 uppercase tracking-[0.2em] block mb-3 ml-1">Valuation (INR)</label>
                  <div className="relative">
                    <IndianRupee size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-pink-500/40" />
                    <input
                      type="text"
                      placeholder="0.00"
                      className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all font-mono"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value.replace(/[^0-9]/g, "") })}
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-pink-500/60 uppercase tracking-[0.2em] block mb-3 ml-1">Visual Token</label>
                  <div className="space-y-4">
                    <div className="relative group/upload">
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full bg-white/[0.02] border border-dashed border-white/10 rounded-2xl py-8 px-6 text-center text-xs text-gray-400 file:hidden cursor-pointer hover:border-pink-500/30 hover:bg-white/[0.05] transition-all"
                        onChange={(e) => setImageFile(e.target.files[0])}
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-2">
                        <Plus size={20} className="text-pink-500/40" />
                        <p className="font-bold tracking-widest uppercase text-[9px]">
                          {imageFile ? imageFile.name : "Secure Upload Fragment"}
                        </p>
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="...or external CDN link"
                      className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-6 text-white text-xs outline-none focus:ring-2 focus:ring-pink-500/10 placeholder-gray-700"
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-pink-500/60 uppercase tracking-[0.2em] block mb-3 ml-1">Inventory Allocation</label>
                  <input
                    type="number"
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-6 text-white focus:ring-2 focus:ring-pink-500/20 outline-none"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-pink-500/60 uppercase tracking-[0.2em] block mb-3 ml-1">Manifest Narrative</label>
                  <textarea
                    rows="3"
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-6 text-white focus:ring-2 focus:ring-pink-500/20 outline-none text-sm resize-none"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  />
                </div>

                <div className="md:col-span-2 flex gap-4 pt-6">
                  <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 bg-white/5 rounded-2xl hover:bg-white/10 transition-all italic">Abort</button>
                  <button type="submit" className="flex-[2] py-4 text-[10px] font-black uppercase tracking-widest text-white bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl shadow-xl shadow-pink-600/10 hover:shadow-pink-600/30 active:scale-95 transition-all">Establish Artifact</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT GRID/TABLE AREA */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 bg-[#1b0a24]/20 rounded-[3rem] border border-dashed border-pink-500/10 backdrop-blur-sm">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-2 border-pink-500/10 rounded-full" />
            <div className="absolute inset-0 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-pink-500/50">Fetching Encrypted Vault...</p>
        </div>
      ) : (
        <div className="w-full overflow-hidden rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] border border-white/5 bg-[#1b0a24]/40 backdrop-blur-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-pink-900/30 to-purple-900/30 text-pink-300">
                  <th className="px-8 py-7 font-black uppercase text-[10px] tracking-[0.25em]">img</th>
                  <th className="px-8 py-7 font-black uppercase text-[10px] tracking-[0.25em]">Product Details</th>
                  <th className="px-8 py-7 font-black uppercase text-[10px] tracking-[0.25em]">Category</th>
                  <th className="px-8 py-7 font-black uppercase text-[10px] tracking-[0.25em]">Price</th>
                  <th className="px-8 py-7 font-black uppercase text-[10px] tracking-[0.25em]">Allocation Status</th>
                  <th className="px-8 py-7 font-black uppercase text-[10px] tracking-[0.25em] text-center"> Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {products.map((product) => {
                  const isEditing = editingProduct?._id === product._id;
                  return (
                    <tr key={product._id} className="hover:bg-white/[0.02] transition-all duration-500 group">
                      <td className="px-8 py-5">
                        <div className="relative overflow-hidden w-14 h-14 rounded-2xl border border-white/10 group-hover:scale-110 transition-transform duration-500">
                          <img src={product.image} className="w-full h-full object-cover" alt="" />
                          {isEditing && (
                            <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-2">
                              <input type="file" className="w-full opacity-0 absolute cursor-pointer" onChange={(e) => setEditImageFile(e.target.files[0])} />
                              <Plus className="text-white/50" size={16} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        {isEditing ? (
                          <input className="bg-black/40 border border-pink-500/30 rounded-lg px-3 py-2 text-white text-xs w-full focus:ring-2 focus:ring-pink-500/20" value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} />
                        ) : (
                          <div className="flex flex-col gap-0.5 max-w-[200px]">
                            <span className="text-sm font-bold text-gray-100 group-hover:text-pink-400 transition-colors line-clamp-1 uppercase tracking-tighter">{product.name}</span>
                            <span className="text-[9px] text-gray-600 line-clamp-1 font-medium">{product.description || "No narrative established"}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-5">
                        {isEditing ? (
                          <input className="bg-black/40 border border-pink-500/30 rounded-lg px-3 py-2 text-white text-xs w-28 uppercase" value={editingProduct.category} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })} />
                        ) : (
                          <span className="px-3 py-1 bg-pink-500/10 text-pink-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-pink-500/20">
                            {product.category}
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-5">
                        {isEditing ? (
                          <input className="bg-black/40 border border-pink-500/30 rounded-lg px-3 py-2 text-white text-xs w-24 font-mono" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value.replace(/[^0-9]/g, "") })} />
                        ) : (
                          <div className="flex items-baseline gap-1 font-mono text-white">
                            <span className="text-[10px] text-pink-500/40">₹</span>
                            <span className="text-lg font-black">{Number(product.price).toLocaleString('en-IN')}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-5">
                        {isEditing ? (
                          <input type="number" className="bg-black/40 border border-pink-500/30 rounded-lg px-3 py-2 text-white text-xs w-20" value={editingProduct.stock} onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })} />
                        ) : (
                          <div className="flex items-center gap-3">
                            {product.stock > 0 ? (
                              <div className="flex items-center gap-2 group/stock">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] group-hover:animate-ping" />
                                <span className="text-[10px] font-black uppercase text-green-500 tracking-widest">Active ({product.stock})</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                <span className="text-[10px] font-black uppercase text-red-500 tracking-widest">Depleted</span>
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center justify-center gap-3">
                          {isEditing ? (
                            <>
                              <button onClick={handleUpdateProduct} className="text-green-500 hover:text-green-400 bg-green-500/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Commit</button>
                              <button onClick={() => setEditingProduct(null)} className="text-gray-500 hover:text-white bg-white/5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Cancel</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => toggleStockStatus(product)} className="p-2.5 text-blue-500 bg-blue-500/10 rounded-2xl hover:scale-110 active:scale-90 transition-all">
                                {product.stock > 0 ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                              </button>
                              <button onClick={() => setEditingProduct(product)} className="p-2.5 text-pink-400 bg-pink-500/10 rounded-2xl hover:scale-110 active:scale-90 transition-all">
                                <Edit3 size={18} />
                              </button>
                              <button onClick={() => handleDelete(product._id)} className="p-2.5 text-red-500 bg-red-500/10 rounded-2xl hover:scale-110 active:scale-90 transition-all">
                                <Trash2 size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PAGINATION */}
      <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6 px-6">
        <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.4em]">Vault Capacity: {totalItems} Entries Registered</p>
        <div className="flex items-center gap-4 bg-[#1b0a24]/80 border border-white/5 p-2 rounded-full backdrop-blur-md shadow-2xl">
          <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="w-12 h-12 flex items-center justify-center rounded-full text-pink-400 hover:bg-pink-500/10 disabled:opacity-20 transition-all">
            <ChevronLeft size={20} />
          </button>
          <div className="px-6 h-12 flex items-center justify-center bg-white/5 rounded-full border border-white/5">
            <span className="text-xs font-black text-white italic tracking-tighter">Sector {currentPage} of {totalPages}</span>
          </div>
          <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className="w-12 h-12 flex items-center justify-center rounded-full text-pink-400 hover:bg-pink-500/10 disabled:opacity-20 transition-all">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageProduct;
