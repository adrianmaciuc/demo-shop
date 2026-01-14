import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Tag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import LazyImage from "../components/ui/LazyImage";

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } =
    useCart();
  const [voucher, setVoucher] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<string | null>(null);
  const [voucherError, setVoucherError] = useState("");
  const [country, setCountry] = useState("romania");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Voucher definitions
  const voucherCodes: { [key: string]: number } = {
    "10OFF": 0.1, // 10% off
    "20OFF": 0.2, // 20% off
  };

  const applyVoucher = () => {
    const upperVoucher = voucher.toUpperCase().trim();
    if (voucherCodes[upperVoucher]) {
      setAppliedVoucher(upperVoucher);
      setVoucherError("");
      setVoucher("");
    } else {
      setVoucherError("Invalid voucher code");
      setAppliedVoucher(null);
    }
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
    setVoucher("");
    setVoucherError("");
  };

  const subtotal = getCartTotal();
  const voucherDiscount = appliedVoucher
    ? subtotal * voucherCodes[appliedVoucher]
    : 0;
  const subtotalAfterVoucher = subtotal - voucherDiscount;
  const shipping = country === "romania" ? 0 : 20;
  const tax = subtotalAfterVoucher * 0.08; // 8% tax
  const total = subtotalAfterVoucher + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        data-testid="empty-cart-container"
      >
        <div className="text-center max-w-md" data-testid="empty-cart-content">
          <div
            className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6"
            data-testid="empty-cart-icon-wrapper"
          >
            <ShoppingBag
              className="w-10 h-10 text-gray-400"
              data-testid="empty-cart-icon"
            />
          </div>
          <h2
            className="text-3xl font-display font-bold mb-4"
            style={{ color: "var(--color-primary)" }}
            data-testid="empty-cart-heading"
          >
            Your cart is empty
          </h2>
          <p
            className="text-gray-600 mb-8"
            data-testid="empty-cart-description"
          >
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link
            to="/"
            className="btn-accent inline-flex items-center gap-2"
            data-testid="empty-cart-continue-link"
          >
            <ArrowLeft
              className="w-5 h-5"
              data-testid="empty-cart-arrow-icon"
            />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" data-testid="cart-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8" data-testid="cart-header">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
            data-testid="cart-continue-shopping-link"
          >
            <ArrowLeft className="w-5 h-5" data-testid="cart-back-arrow" />
            <span className="font-medium">Continue Shopping</span>
          </Link>
          <div className="flex items-center justify-between">
            <h1
              className="text-4xl font-display font-bold"
              style={{ color: "var(--color-primary)" }}
              data-testid="cart-title"
            >
              Shopping Cart
            </h1>
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 font-medium text-sm"
              data-testid="cart-clear-button"
            >
              Clear Cart
            </button>
          </div>
          <p className="text-gray-600 mt-2" data-testid="cart-item-count">
            {cartItems.length} items in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div
            className="lg:col-span-2 space-y-4"
            data-testid="cart-items-list"
          >
            {cartItems.map((item) => (
              <div
                key={`${item.shoe.id}-${item.size}-${item.color}`}
                className="bg-white rounded-xl shadow-sm p-6 flex flex-col sm:flex-row gap-6"
                data-testid={`cart-item-${item.shoe.id}`}
              >
                {/* Image */}
                <Link
                  to={`/shoe/${item.shoe.id}`}
                  className="flex-shrink-0 w-full sm:w-32 rounded-lg overflow-hidden"
                  data-testid={`cart-item-image-link-${item.shoe.id}`}
                >
                  <div className="w-full h-32">
                    <LazyImage
                      src={item.shoe.images[0]}
                      alt={item.shoe.name}
                      aspectRatio="square"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      data-testid={`cart-item-image-${item.shoe.id}`}
                    />
                  </div>
                </Link>

                {/* Details */}
                <div
                  className="flex-1 min-w-0"
                  data-testid={`cart-item-details-${item.shoe.id}`}
                >
                  <Link
                    to={`/shoe/${item.shoe.id}`}
                    data-testid={`cart-item-name-link-${item.shoe.id}`}
                  >
                    <p
                      className="text-sm font-medium mb-1"
                      style={{ color: "var(--color-accent)" }}
                      data-testid={`cart-item-brand-${item.shoe.id}`}
                    >
                      {item.shoe.brand}
                    </p>
                    <h3
                      className="text-xl font-display font-semibold mb-2 hover:text-gray-600 transition-colors"
                      data-testid={`cart-item-name-${item.shoe.id}`}
                    >
                      {item.shoe.name}
                    </h3>
                  </Link>
                  <div
                    className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4"
                    data-testid={`cart-item-specs-${item.shoe.id}`}
                  >
                    <span data-testid={`cart-item-color-${item.shoe.id}`}>
                      Color: <span className="font-medium">{item.color}</span>
                    </span>
                    <span data-testid={`cart-item-size-${item.shoe.id}`}>
                      Size: <span className="font-medium">US {item.size}</span>
                    </span>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between">
                    <div
                      className="inline-flex items-center border-2 border-gray-300 rounded-lg"
                      data-testid={`cart-item-quantity-container-${item.shoe.id}`}
                    >
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.shoe.id,
                            item.size,
                            item.color,
                            item.quantity - 1,
                          )
                        }
                        className="p-2 hover:bg-gray-50 transition-colors"
                        aria-label="Decrease quantity"
                        data-testid={`cart-item-quantity-decrease-${item.shoe.id}`}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span
                        className="px-4 py-2 font-semibold min-w-[50px] text-center"
                        data-testid={`cart-item-quantity-value-${item.shoe.id}`}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.shoe.id,
                            item.size,
                            item.color,
                            item.quantity + 1,
                          )
                        }
                        className="p-2 hover:bg-gray-50 transition-colors"
                        aria-label="Increase quantity"
                        data-testid={`cart-item-quantity-increase-${item.shoe.id}`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div
                      className="text-right"
                      data-testid={`cart-item-price-container-${item.shoe.id}`}
                    >
                      <p
                        className="text-2xl font-bold"
                        style={{ color: "var(--color-primary)" }}
                        data-testid={`cart-item-total-price-${item.shoe.id}`}
                      >
                        ${(item.shoe.price * item.quantity).toFixed(2)}
                      </p>
                      <p
                        className="text-sm text-gray-500"
                        data-testid={`cart-item-unit-price-${item.shoe.id}`}
                      >
                        ${item.shoe.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() =>
                    removeFromCart(item.shoe.id, item.size, item.color)
                  }
                  className="flex-shrink-0 self-start p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Remove item"
                  data-testid={`cart-item-remove-${item.shoe.id}`}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div
              className="bg-white rounded-xl shadow-sm p-6 sticky top-20 space-y-6"
              data-testid="cart-order-summary"
            >
              <h2
                className="text-2xl font-display font-bold"
                data-testid="order-summary-heading"
              >
                Order Summary
              </h2>

              {/* Voucher Section */}
              <div
                className="bg-orange-50 border border-orange-200 rounded-lg p-4"
                data-testid="voucher-section"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-orange-900">
                    Apply Voucher
                  </h3>
                </div>

                {appliedVoucher ? (
                  <div
                    className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between"
                    data-testid="applied-voucher-display"
                  >
                    <div>
                      <p className="text-sm font-medium text-green-900">
                        {appliedVoucher}
                      </p>
                      <p className="text-sm text-green-700">
                        {voucherCodes[appliedVoucher] * 100}% discount applied
                      </p>
                    </div>
                    <button
                      onClick={removeVoucher}
                      className="text-green-600 hover:text-green-700 font-medium text-sm"
                      data-testid="remove-voucher-button"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div
                    className="space-y-2"
                    data-testid="voucher-input-section"
                  >
                    <input
                      type="text"
                      placeholder="Enter code (e.g., 10OFF, 20OFF)"
                      value={voucher}
                      onChange={(e) => {
                        setVoucher(e.target.value);
                        setVoucherError("");
                      }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") applyVoucher();
                      }}
                      className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                      data-testid="voucher-input"
                    />
                    <button
                      onClick={applyVoucher}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 rounded-lg transition-colors"
                      data-testid="apply-voucher-button"
                    >
                      Apply Code
                    </button>
                    {voucherError && (
                      <p
                        className="text-sm text-red-600 font-medium"
                        data-testid="voucher-error"
                      >
                        {voucherError}
                      </p>
                    )}
                    <p className="text-xs text-orange-700 mt-2">
                      <span className="font-semibold">Available codes:</span>{" "}
                      10OFF (10%), 20OFF (20%)
                    </p>
                  </div>
                )}
              </div>

              {/* Shipping Calculator Section */}
              <div
                className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                data-testid="shipping-calculator-section"
              >
                <h3 className="font-semibold text-blue-900 mb-3">
                  Shipping Location
                </h3>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                  data-testid="country-selector"
                >
                  <option value="romania" data-testid="country-romania">
                    Romania (FREE Shipping)
                  </option>
                  <option
                    value="international"
                    data-testid="country-international"
                  >
                    International ($20 Shipping)
                  </option>
                </select>
              </div>

              {/* Order Details */}
              <div className="space-y-4" data-testid="order-summary-details">
                <div
                  className="flex justify-between text-gray-600"
                  data-testid="order-subtotal"
                >
                  <span>Subtotal</span>
                  <span
                    className="font-semibold"
                    data-testid="order-subtotal-amount"
                  >
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                {appliedVoucher && (
                  <div
                    className="flex justify-between text-green-600"
                    data-testid="order-discount"
                  >
                    <span>
                      {appliedVoucher} ({voucherCodes[appliedVoucher] * 100}%
                      off)
                    </span>
                    <span
                      className="font-semibold"
                      data-testid="order-discount-amount"
                    >
                      -${voucherDiscount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div
                  className="flex justify-between text-gray-600"
                  data-testid="order-shipping"
                >
                  <span>Shipping</span>
                  <span
                    className="font-semibold"
                    data-testid="order-shipping-amount"
                  >
                    {shipping === 0 ? (
                      <span
                        className="text-green-600"
                        data-testid="order-shipping-free"
                      >
                        FREE
                      </span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div
                  className="flex justify-between text-gray-600"
                  data-testid="order-tax"
                >
                  <span>Tax (8%)</span>
                  <span
                    className="font-semibold"
                    data-testid="order-tax-amount"
                  >
                    ${tax.toFixed(2)}
                  </span>
                </div>

                <div
                  className="border-t border-gray-200 pt-4"
                  data-testid="order-total-container"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span
                      className="text-3xl font-bold"
                      style={{ color: "var(--color-primary)" }}
                      data-testid="order-total-amount"
                    >
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                state={{
                  cartItems,
                  subtotal,
                  voucherDiscount,
                  appliedVoucher,
                  shipping,
                  tax,
                  total,
                  country,
                }}
                className="w-full btn-accent text-lg block text-center"
                data-testid="cart-checkout-button"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/"
                className="block text-center text-gray-600 hover:text-gray-900 font-medium transition-colors"
                data-testid="cart-continue-shopping-button"
              >
                Continue Shopping
              </Link>

              {/* Trust Badges */}
              <div
                className="mt-8 pt-6 border-t border-gray-200 space-y-3"
                data-testid="cart-trust-badges"
              >
                <div
                  className="flex items-start gap-3 text-sm text-gray-600"
                  data-testid="trust-badge-security"
                >
                  <svg
                    className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Secure checkout with SSL encryption</span>
                </div>
                <div
                  className="flex items-start gap-3 text-sm text-gray-600"
                  data-testid="trust-badge-returns"
                >
                  <svg
                    className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>30-day easy returns</span>
                </div>
                <div
                  className="flex items-start gap-3 text-sm text-gray-600"
                  data-testid="trust-badge-shipping"
                >
                  <svg
                    className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Free shipping to Romania</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
