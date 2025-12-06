import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ChevronLeft, ShoppingCart, Heart, Share2, Check, Minus, Plus, ChevronDown } from 'lucide-react';
import { shoes } from '../data/shoes';
import ProductCard from '../components/product/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const ShoePage = () => {
  const { id } = useParams<{ id: string }>();
  const shoe = shoes.find((s) => s.id === id);
  const { addToCart } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>('description');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!shoe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold mb-4">Product Not Found</h2>
          <Link to="/" className="text-orange-600 hover:text-orange-700 font-medium">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Initialize selected color
  if (!selectedColor && shoe.colors.length > 0) {
    setSelectedColor(shoe.colors[0]);
  }

  // Get recommended shoes (same category, different shoes)
  const recommendedShoes = shoes
    .filter((s) => s.category === shoe.category && s.id !== shoe.id)
    .slice(0, 4);

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    
    addToCart(shoe, selectedSize, selectedColor, quantity);
    setShowSuccessMessage(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen">
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3"
          >
            <Check className="w-5 h-5" />
            <div>
              <p className="font-semibold">Added to cart!</p>
              <p className="text-sm text-green-100">
                {quantity} x {shoe.name}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link
          to={`/category/${shoe.category}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">Back to {shoe.category}</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden"
            >
              <img
                src={shoe.images[selectedImage]}
                alt={shoe.name}
                className="w-full h-full object-cover"
              />
              {shoe.featured && (
                <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-semibold">
                  Featured
                </div>
              )}
            </motion.div>

            {/* Thumbnail Gallery */}
            {shoe.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {shoe.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-orange-500 ring-2 ring-orange-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={image} alt={`${shoe.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand & Name */}
            <div>
              <p className="text-lg font-semibold mb-2" style={{ color: 'var(--color-accent)' }}>
                {shoe.brand}
              </p>
              <h1 className="text-4xl font-display font-bold mb-4" style={{ color: 'var(--color-primary)' }}>
                {shoe.name}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">{shoe.description}</p>
            </div>

            {/* Price */}
            <div className="py-4 border-y border-gray-200">
              <p className="text-4xl font-bold" style={{ color: 'var(--color-primary)' }}>
                ${shoe.price}
              </p>
              <p className="text-sm text-gray-500 mt-1">Free shipping on orders over $100</p>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-semibold mb-3">
                Color: <span className="font-normal text-gray-600">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {shoe.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-6 py-3 rounded-lg border-2 font-medium transition-all ${
                      selectedColor === color
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <label className="block text-sm font-semibold mb-3">
                Size: {selectedSize && <span className="font-normal text-gray-600">US {selectedSize}</span>}
              </label>
              <div className="grid grid-cols-5 gap-3">
                {shoe.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                      selectedSize === size
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {!selectedSize && (
                <p className="text-sm text-red-500 mt-2">Please select a size</p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold mb-3">Quantity</label>
              <div className="inline-flex items-center border-2 border-gray-300 rounded-lg">
                <button
                  onClick={decrementQuantity}
                  className="p-3 hover:bg-gray-50 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="px-6 py-3 font-semibold min-w-[60px] text-center">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="p-3 hover:bg-gray-50 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleAddToCart}
                className="w-full btn-accent flex items-center justify-center gap-2 text-lg"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5" />
                  Wishlist
                </button>
                <button className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>

            {/* Stock & Delivery Info */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-green-700">
                <Check className="w-5 h-5" />
                <span className="font-semibold">In Stock</span>
              </div>
              <p className="text-sm text-gray-600">
                Order within <span className="font-semibold">2 hours 30 minutes</span> for delivery by tomorrow
              </p>
            </div>
          </div>
        </div>

        {/* Product Details Accordion */}
        <div className="mt-16 max-w-7xl mx-auto">
          <h2 className="text-2xl font-display font-bold mb-6">Product Details</h2>
          <div className="space-y-4">
            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <button
                onClick={() => toggleAccordion('description')}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-lg">Description</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    openAccordion === 'description' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openAccordion === 'description' && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-gray-600">
                      <p className="mb-4">{shoe.description}</p>
                      <ul className="space-y-2">
                        {shoe.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Shipping & Returns */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <button
                onClick={() => toggleAccordion('shipping')}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-lg">Shipping & Returns</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    openAccordion === 'shipping' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openAccordion === 'shipping' && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-gray-600 space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Free Shipping</h4>
                        <p>Free standard shipping on orders over $100. Express shipping available.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Easy Returns</h4>
                        <p>30-day return policy. Items must be unworn and in original packaging.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Delivery Time</h4>
                        <p>Standard: 3-5 business days. Express: 1-2 business days.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Care Instructions */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <button
                onClick={() => toggleAccordion('care')}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-lg">Care Instructions</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    openAccordion === 'care' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openAccordion === 'care' && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-gray-600">
                      <ul className="space-y-2">
                        <li>• Clean with a soft, damp cloth</li>
                        <li>• Avoid harsh chemicals and solvents</li>
                        <li>• Air dry away from direct heat</li>
                        <li>• Store in a cool, dry place</li>
                        <li>• Use shoe trees to maintain shape</li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        {recommendedShoes.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-display font-bold mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedShoes.map((recommendedShoe, index) => (
                <ProductCard
                  key={recommendedShoe.id}
                  shoe={recommendedShoe}
                  index={index}
                  variant="compact"
                  showBadge={recommendedShoe.featured ? 'featured' : null}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoePage;