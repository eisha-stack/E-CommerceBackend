import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Orders.css";

const API_URL = "https://youtube-backend-ecru.vercel.app/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch orders.");
      setLoading(false);
    }
  };

  if (loading) return <div className="orders-loading">Loading...</div>;
  if (error) return <div className="orders-error">{error}</div>;

  return (
    <div className="orders-container">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <div>No orders found.</div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order._id}>
              <div className="order-meta">
                <span>Order ID: {order._id}</span>
                <span>Status: {order.status}</span>
                <span>Total: ${order.total}</span>
                <span>Date: {new Date(order.createdAt).toLocaleString()}</span>
              </div>
              <ul>
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.product?.name || "Product"} x {item.quantity} (${item.price} each)
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders; 