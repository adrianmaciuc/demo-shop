import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CreditCard,
  Banknote,
  ArrowLeft,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import type { OrderSummary } from "../types";
import {
  validateCardNumber,
  validateExpiryDate,
  validateCVV,
  formatCardNumber,
  formatExpiryDate,
} from "../utils/validation";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1337/api";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();
  const { clearCart } = useCart();
  const orderData = location.state as OrderSummary | null;

  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card");
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: "",
  });
  const [formErrors, setFormErrors] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: "",
  });
  const [showErrors, setShowErrors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (
      !orderData ||
      !orderData.cartItems ||
      orderData.cartItems.length === 0
    ) {
      navigate("/cart");
    }
  }, [orderData, navigate]);

  useEffect(() => {
    if (!isAuthenticated && !isSubmitting) {
      navigate("/login?redirect=/checkout");
    }
  }, [isAuthenticated, navigate, isSubmitting]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = formatCardNumber(value);
    } else if (name === "expiryDate") {
      formattedValue = formatExpiryDate(value);
    } else if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").substr(0, 3);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));

    if (showErrors && formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e?: FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (paymentMethod === "cash") {
      await proceedToSuccess();
      return;
    }

    const errors = {
      cardNumber: "",
      cardholderName: "",
      expiryDate: "",
      cvv: "",
    };

    const cardResult = validateCardNumber(formData.cardNumber);
    if (!cardResult.valid) {
      errors.cardNumber = cardResult.error || "Invalid card number";
    }

    if (formData.cardholderName.trim().length < 3) {
      errors.cardholderName = "Name must be at least 3 characters";
    }

    const expiryResult = validateExpiryDate(formData.expiryDate);
    if (!expiryResult.valid) {
      errors.expiryDate = expiryResult.error || "Invalid expiry date";
    }

    const cvvResult = validateCVV(formData.cvv);
    if (!cvvResult.valid) {
      errors.cvv = cvvResult.error || "Invalid CVV";
    }

    const hasErrors = Object.values(errors).some((error) => error !== "");

    if (hasErrors) {
      setFormErrors(errors);
      setShowErrors(true);
      return;
    }

    await proceedToSuccess();
  };

  const proceedToSuccess = async () => {
    if (!isAuthenticated || !token || !orderData) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const orderPayload = {
        items: orderData.cartItems.map((item) => ({
          shoe: item.shoe.id,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          price: item.shoe.price,
        })),
        shippingAddress: orderData.shippingAddress || {},
        billingAddress: orderData.billingAddress || {},
        paymentMethod:
          paymentMethod === "card" ? "Credit Card" : "Cash on Delivery",
        subtotal: orderData.subtotal,
        shipping: orderData.shipping,
        tax: orderData.tax,
        total: orderData.total,
      };

      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: orderPayload }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to create order");
      }

      const orderResult = await response.json();
      clearCart();

      navigate("/order-success", {
        state: {
          orderId: orderResult.orderNumber,
          orderDate: new Date(),
          cartItems: orderData.cartItems,
          subtotal: orderData.subtotal,
          shipping: orderData.shipping,
          tax: orderData.tax,
          total: orderData.total,
          voucherDiscount: orderData.voucherDiscount,
          appliedVoucher: orderData.appliedVoucher,
          paymentMethod:
            paymentMethod === "card" ? "Credit Card" : "Cash on Delivery",
          country: orderData.country,
        },
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create order";
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  if (!orderData) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" data-testid="checkout-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Cart</span>
          </Link>
          <h1
            className="text-4xl font-display font-bold"
            style={{ color: "var(--color-primary)" }}
          >
            Checkout
          </h1>
          <p className="text-gray-600 mt-2">Complete your order</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-display font-bold mb-6">
                Payment Method
              </h2>

              <div className="space-y-4 mb-8">
                <motion.label
                  className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "card"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-300"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value as "card")}
                    className="w-5 h-5"
                  />
                  <CreditCard className="w-6 h-6 text-orange-600" />
                  <span className="font-semibold">Credit / Debit Card</span>
                </motion.label>

                <motion.label
                  className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "cash"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-300"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={(e) => setPaymentMethod(e.target.value as "cash")}
                    className="w-5 h-5"
                  />
                  <Banknote className="w-6 h-6 text-green-600" />
                  <span className="font-semibold">Cash on Delivery</span>
                </motion.label>
              </div>

              {paymentMethod === "card" && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="1234 5678 9012 3456"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-offset-2 focus:outline-none transition-all ${
                        showErrors && formErrors.cardNumber
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {showErrors && formErrors.cardNumber && (
                      <p className="text-red-600 text-sm mt-1">
                        {formErrors.cardNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name *
                    </label>
                    <input
                      type="text"
                      name="cardholderName"
                      value={formData.cardholderName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-offset-2 focus:outline-none transition-all ${
                        showErrors && formErrors.cardholderName
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {showErrors && formErrors.cardholderName && (
                      <p className="text-red-600 text-sm mt-1">
                        {formErrors.cardholderName}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-offset-2 focus:outline-none transition-all ${
                          showErrors && formErrors.expiryDate
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {showErrors && formErrors.expiryDate && (
                        <p className="text-red-600 text-sm mt-1">
                          {formErrors.expiryDate}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        placeholder="123"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-offset-2 focus:outline-none transition-all ${
                          showErrors && formErrors.cvv
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {showErrors && formErrors.cvv && (
                        <p className="text-red-600 text-sm mt-1">
                          {formErrors.cvv}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.form>
              )}

              {paymentMethod === "cash" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-green-50 border border-green-200 rounded-lg p-4"
                >
                  <p className="text-green-900 font-medium">
                    You will pay in cash when your order arrives
                  </p>
                  <p className="text-green-700 text-sm mt-2">
                    Please keep the exact amount ready for a smooth delivery
                    experience.
                  </p>
                </motion.div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-20">
              <h2 className="text-2xl font-display font-bold mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {orderData.cartItems.map((item) => (
                  <div
                    key={`${item.shoe.id}-${item.size}-${item.color}`}
                    className="flex gap-3"
                  >
                    <img
                      src={item.shoe.images[0]}
                      alt={item.shoe.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {item.shoe.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        Size: {item.size} | Color: {item.color}
                      </p>
                      <p className="text-xs text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ${(item.shoe.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
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
                  <span>Shipping</span>
                  <span>
                    {orderData.shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `$${orderData.shipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Tax (8%)</span>
                  <span>${orderData.tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span
                      className="text-3xl font-bold"
                      style={{ color: "var(--color-primary)" }}
                    >
                      ${orderData.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full btn-accent text-lg mt-6 disabled:opacity-50 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 inline mr-2" />
                    Place Order
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing this order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
