import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminPanel.css";

const API_URL = "https://youtube-backend-ecru.vercel.app/api";

function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "", stock: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get(`${API_URL}/products`);
    setProducts(res.data.products);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`${API_URL}/products/${editingId}`, form, { headers: { Authorization: `Bearer ${token}` } });
        setSuccess("Product updated successfully!");
      } else {
        await axios.post(`${API_URL}/products`, form, { headers: { Authorization: `Bearer ${token}` } });
        setSuccess("Product added successfully!");
      }
      setForm({ name: "", description: "", price: "", category: "", stock: "" });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Action failed");
    }
    setLoading(false);
    setTimeout(() => setSuccess(""), 2000);
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditingId(product._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setSuccess("Product deleted successfully!");
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
    setLoading(false);
    setTimeout(() => setSuccess(""), 2000);
  };

  return (
    <div className="admin-panel-container">
      <h2>Admin Panel</h2>
      <form className="admin-form" onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required />
        <button type="submit" disabled={loading}>{editingId ? "Update" : "Add"} Product</button>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
      </form>
      <div className="admin-products-list">
        {products.map((product) => (
          <div className="admin-product-card" key={product._id}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <div className="product-meta">
              <span>${product.price}</span>
              <span>{product.category}</span>
              <span>Stock: {product.stock}</span>
            </div>
            <button onClick={() => handleEdit(product)}>Edit</button>
            <button onClick={() => handleDelete(product._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPanel; 