import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getCartItemCount } = useCart();
  const cartItemCount = getCartItemCount();

  const categories = [
    { name: 'Sneakers', path: '/category/sneakers' },
    { name: 'Running', path: '/category/running' },
    { name: 'Casual', path: '/category/casual' },
    { name: 'Formal', path: '/category/formal' },
    { name: 'Boots', path: '/category/boots' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-display font-bold tracking-tight"
            style={{ color: 'var(--color-primary)' }}
          >
            Sole Street
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {categories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <Link
              to="/about"
              className="hidden md:block text-gray-700 hover:text-gray-900 transition-colors"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="hidden md:block text-gray-700 hover:text-gray-900 transition-colors"
            >
              Contact
            </Link>
            <Link
              to="/cart"
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-gray-200">
            {categories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <Link
                to="/about"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;