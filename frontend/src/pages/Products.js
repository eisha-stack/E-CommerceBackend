import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Products.css";

const API_URL = "https://youtube-backend-ecru.vercel.app/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [success, setSuccess] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [search]);

  const fetchProducts = async () => {
    const res = await axios.get(`${API_URL}/products`, {
      params: { search },
    });
    setProducts(res.data.products);
  };

  const addToCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/cart/add`,
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Added to cart!");
      setTimeout(() => setSuccess(""), 1500);
    } catch (err) {
      setSuccess("Failed to add to cart");
      setTimeout(() => setSuccess(""), 1500);
    }
  };

  return (
    <div className="products-container">
      <div className="products-header">
        <h2>Products</h2>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        {user && user.type === "admin" && (
          <button className="add-product-btn" onClick={() => navigate("/admin")}>+ Add Product</button>
        )}
      </div>
      {/* <pre style={{ background: '#eee', padding: '1rem', borderRadius: '8px', margin: '1rem 0' }}>
        {JSON.stringify(user, null, 2)}
      </pre> */}
      {success && <div className="success" style={{marginBottom: '1rem'}}>{success}</div>}
      <div className="products-list">
        {products.map((product) => (
          <div className="product-card" key={product._id}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <div className="product-meta">
              <span>${product.price}</span>
              <span>{product.category}</span>
            </div>
            {user && user.type !== "admin" && (
              <button className="add-to-cart-btn" onClick={() => addToCart(product._id)}>
                Add to Cart
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products; 