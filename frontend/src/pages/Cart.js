import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Cart.css";

const API_URL = "https://youtube-backend-ecru.vercel.app/api";

function Cart() {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data);
    } catch (err) {
      setError("Please login to view your cart.");
    }
  };

  const updateQuantity = async (productId, quantity) => {
    const token = localStorage.getItem("token");
    await axios.put(
      `${API_URL}/cart/update`,
      { productId, quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchCart();
  };

  const removeItem = async (productId) => {
    const token = localStorage.getItem("token");
    await axios.delete(`${API_URL}/cart/remove`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { productId },
    });
    fetchCart();
  };

  const placeOrder = async () => {
    const token = localStorage.getItem("token");
    await axios.post(`${API_URL}/orders`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchCart(); // Refresh cart after order
    alert("Order placed successfully!");
  };

  if (error) return <div className="cart-error">{error}</div>;
  if (!cart) return <div>Loading...</div>;

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cart.items.length === 0 ? (
        <div>Your cart is empty.</div>
      ) : (
        <table className="cart-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cart.items.map((item) => (
              <tr key={item.product._id}>
                <td>{item.product.name}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.product._id, Number(e.target.value))
                    }
                  />
                </td>
                <td>
                  <button onClick={() => removeItem(item.product._id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {cart.items.length > 0 && (
        <button className="place-order-btn" onClick={placeOrder}>
          Place Order
        </button>
      )}
    </div>
  );
}

export default Cart; 