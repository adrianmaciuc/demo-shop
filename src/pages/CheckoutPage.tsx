import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard, Banknote, ArrowLeft, ShoppingBag } from "lucide-react";
import type { OrderSummary } from "../types";
import {
  validateCardNumber,
  validateExpiryDate,
  validateCVV,
  formatCardNumber,
  formatExpiryDate,
} from "../utils/validation";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Redirect to cart if no order data
  useEffect(() => {
    if (
      !orderData ||
      !orderData.cartItems ||
      orderData.cartItems.length === 0
    ) {
      navigate("/cart");
    }
  }, [orderData, navigate]);

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

    // Clear error for this field
    if (showErrors && formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e?: FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (paymentMethod === "cash") {
      // No validation needed for cash on delivery
      proceedToSuccess();
      return;
    }

    // Validate card payment
    const errors = {
      cardNumber: "",
      cardholderName: "",
      expiryDate: "",
      cvv: "",
    };

    if (!validateCardNumber(formData.cardNumber)) {
      errors.cardNumber = "Please enter a valid 16-digit card number";
    }

    if (formData.cardholderName.trim().length < 3) {
      errors.cardholderName = "Name must be at least 3 characters";
    }

    if (!validateExpiryDate(formData.expiryDate)) {
      errors.expiryDate = "Please enter a valid expiry date (MM/YY)";
    }

    if (!validateCVV(formData.cvv)) {
      errors.cvv = "CVV must be 3 digits";
    }

    const hasErrors = Object.values(errors).some((error) => error !== "");

    if (hasErrors) {
      setFormErrors(errors);
      setShowErrors(true);
      return;
    }

    proceedToSuccess();
  };

  const proceedToSuccess = () => {
    navigate("/order-success", {
      state: {
        ...orderData,
        paymentMethod:
          paymentMethod === "card" ? "Credit Card" : "Cash on Delivery",
        orderDate: new Date(),
        orderId: `ORD-${Date.now()}`,
      },
    });
  };

  if (!orderData) {
    return null;
  }

  return (
    <div className="min-h-screen py-8" data-testid="checkout-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-display font-bold mb-6">
                Payment Method
              </h2>

              {/* Payment Method Selection */}
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

              {/* Card Form */}
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
                    ✓ You will pay in cash when your order arrives
                  </p>
                  <p className="text-green-700 text-sm mt-2">
                    Please keep the exact amount ready for a smooth delivery
                    experience.
                  </p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Order Summary */}
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
                className="w-full btn-accent text-lg mt-6"
              >
                <ShoppingBag className="w-5 h-5 inline mr-2" />
                Place Order
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
