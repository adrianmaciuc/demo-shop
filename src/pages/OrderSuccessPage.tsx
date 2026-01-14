import { useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Home, Package } from "lucide-react";
import { useCart } from "../context/CartContext";
import type { CompletedOrder } from "../types";

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const orderData = location.state as CompletedOrder | null;
  const cartCleared = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Clear cart once on mount if we have order data
  useEffect(() => {
    if (!orderData) {
      navigate("/");
      return;
    }

    // Clear cart only once
    if (!cartCleared.current) {
      clearCart();
      cartCleared.current = true;
    }
  }, [orderData, clearCart, navigate]);

  if (!orderData) {
    return null;
  }

  const formattedDate = new Date(orderData.orderDate).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <div className="min-h-screen py-8" data-testid="order-success-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
            className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6"
          >
            <CheckCircle className="w-16 h-16 text-green-600" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-4xl md:text-5xl font-display font-bold mb-4"
            style={{ color: "var(--color-primary)" }}
          >
            Order Placed Successfully!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl text-gray-600 mb-2"
          >
            Thank you for your purchase
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="inline-flex items-center gap-2 bg-orange-50 px-6 py-3 rounded-lg"
          >
            <Package className="w-5 h-5 text-orange-600" />
            <span className="font-semibold text-gray-900">
              Order ID:{" "}
              <span className="text-orange-600">{orderData.orderId}</span>
            </span>
          </motion.div>

          <p className="text-gray-500 text-sm mt-4">{formattedDate}</p>
        </motion.div>

        {/* Order Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-6"
        >
          <h2 className="text-2xl font-display font-bold mb-6">
            Order Summary
          </h2>

          {/* Items */}
          <div className="space-y-4 mb-6">
            {orderData.cartItems.map((item) => (
              <div
                key={`${item.shoe.id}-${item.size}-${item.color}`}
                className="flex gap-4 pb-4 border-b border-gray-200 last:border-0"
              >
                <img
                  src={item.shoe.images[0]}
                  alt={item.shoe.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-semibold">{item.shoe.name}</p>
                  <p className="text-sm text-gray-600">{item.shoe.brand}</p>
                  <p className="text-sm text-gray-600">
                    Size: {item.size} | Color: {item.color} | Quantity:{" "}
                    {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">
                    ${(item.shoe.price * item.quantity).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    ${item.shoe.price.toFixed(2)} each
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-3 border-t border-gray-200 pt-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${orderData.subtotal.toFixed(2)}</span>
            </div>

            {orderData.voucherDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({orderData.appliedVoucher})</span>
                <span>-${orderData.voucherDiscount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-gray-600">
              <span>
                Shipping (
                {orderData.country === "romania" ? "Romania" : "International"})
              </span>
              <span>
                {orderData.shipping === 0 ? (
                  <span className="text-green-600 font-medium">FREE</span>
                ) : (
                  `$${orderData.shipping.toFixed(2)}`
                )}
              </span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Tax (8%)</span>
              <span>${orderData.tax.toFixed(2)}</span>
            </div>

            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">Total Paid</span>
                <span
                  className="text-3xl font-bold"
                  style={{ color: "var(--color-primary)" }}
                >
                  ${orderData.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payment Method */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-6"
        >
          <h3 className="text-lg font-display font-bold mb-3">
            Payment Method
          </h3>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "var(--color-accent)", color: "white" }}
            >
              {orderData.paymentMethod === "Credit Card" ? "💳" : "💵"}
            </div>
            <div>
              <p className="font-semibold">{orderData.paymentMethod}</p>
              <p className="text-sm text-gray-600">
                {orderData.paymentMethod === "Credit Card"
                  ? "Payment processed successfully"
                  : "Payment on delivery"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Delivery Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8"
        >
          <h3 className="font-semibold text-blue-900 mb-2">📦 What's Next?</h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li>• You will receive an order confirmation email shortly</li>
            <li>• Estimated delivery: 3-5 business days</li>
            <li>• Track your order using the Order ID above</li>
            <li>• Contact us if you have any questions</li>
          </ul>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="text-center"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 btn-accent text-lg"
          >
            <Home className="w-5 h-5" />
            Return to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
