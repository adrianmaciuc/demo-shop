import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useEffect } from 'react';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-3xl font-display font-bold mb-4" style={{ color: 'var(--color-primary)' }}>
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link to="/" className="btn-accent inline-flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Continue Shopping</span>
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-display font-bold" style={{ color: 'var(--color-primary)' }}>
              Shopping Cart
            </h1>
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 font-medium text-sm"
            >
              Clear Cart
            </button>
          </div>
          <p className="text-gray-600 mt-2">{cartItems.length} items in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={`${item.shoe.id}-${item.size}-${item.color}`}
                className="bg-white rounded-xl shadow-sm p-6 flex flex-col sm:flex-row gap-6"
              >
                {/* Image */}
                <Link
                  to={`/shoe/${item.shoe.id}`}
                  className="flex-shrink-0 w-full sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden"
                >
                  <img
                    src={item.shoe.images[0]}
                    alt={item.shoe.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link to={`/shoe/${item.shoe.id}`}>
                    <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-accent)' }}>
                      {item.shoe.brand}
                    </p>
                    <h3 className="text-xl font-display font-semibold mb-2 hover:text-gray-600 transition-colors">
                      {item.shoe.name}
                    </h3>
                  </Link>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    <span>Color: <span className="font-medium">{item.color}</span></span>
                    <span>Size: <span className="font-medium">US {item.size}</span></span>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center border-2 border-gray-300 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.shoe.id, item.size, item.color, item.quantity - 1)}
                        className="p-2 hover:bg-gray-50 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 font-semibold min-w-[50px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.shoe.id, item.size, item.color, item.quantity + 1)}
                        className="p-2 hover:bg-gray-50 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                        ${(item.shoe.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        ${item.shoe.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.shoe.id, item.size, item.color)}
                  className="flex-shrink-0 self-start p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-20">
              <h2 className="text-2xl font-display font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (8%)</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>

                {subtotal < 100 && subtotal > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <p className="text-sm text-orange-700">
                      Add <span className="font-semibold">${(100 - subtotal).toFixed(2)}</span> more for free shipping!
                    </p>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button className="w-full btn-accent text-lg mb-4">
                Proceed to Checkout
              </button>

              <Link
                to="/"
                className="block text-center text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Continue Shopping
              </Link>

              {/* Trust Badges */}
              <div className="mt-8 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Secure checkout with SSL encryption</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>30-day easy returns</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Free shipping on orders over $100</span>
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