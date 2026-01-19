import { Link } from "react-router-dom";
import { Star, Heart } from "lucide-react";
import type { Shoe } from "../../types";
import { motion } from "framer-motion";
import LazyImage from "../ui/LazyImage";
import { useWishlist } from "../../context/WishlistContext";

interface ProductCardProps {
  shoe: Shoe;
  index?: number;
  variant?: "default" | "compact" | "featured";
  showBadge?: "featured" | "new" | "sale" | null;
}

const ProductCard = ({
  shoe,
  index = 0,
  variant = "default",
  showBadge = null,
}: ProductCardProps) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(shoe.id);
  const getBadgeContent = () => {
    if (showBadge === "featured") {
      return (
        <div className="absolute top-4 left-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
          <Star className="w-4 h-4 fill-current" />
          Featured
        </div>
      );
    }
    if (showBadge === "new") {
      return (
        <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
          NEW
        </div>
      );
    }
    if (showBadge === "sale") {
      return (
        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
          SALE
        </div>
      );
    }
    return null;
  };

  const renderDefault = () => (
    <div
      className="card overflow-hidden"
      data-testid={`product-card-default-${shoe.id}`}
    >
      <div className="relative overflow-hidden group">
        <LazyImage
          src={shoe.images[0]}
          alt={shoe.name}
          aspectRatio="square"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          data-testid={`product-image-${shoe.id}`}
        />
        {getBadgeContent()}
        {/* Wishlist Button */}
        <motion.button
          onClick={(e) => {
            e.preventDefault();
            if (inWishlist) {
              removeFromWishlist(shoe.id);
            } else {
              addToWishlist(shoe);
            }
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          data-testid={`product-wishlist-button-${shoe.id}`}
        >
          <Heart
            className="w-5 h-5 transition-colors"
            style={{
              color: inWishlist ? "#ef4444" : "#9ca3af",
              fill: inWishlist ? "#ef4444" : "none",
            }}
            data-testid={`product-wishlist-icon-${shoe.id}`}
          />
        </motion.button>
      </div>
      <div className="p-6">
        <p
          className="text-sm font-medium mb-1"
          style={{ color: "var(--color-accent)" }}
          data-testid={`product-brand-${shoe.id}`}
        >
          {shoe.brand}
        </p>
        <h3
          className="text-xl font-display font-semibold mb-2 group-hover:text-gray-600 transition-colors"
          data-testid={`product-name-${shoe.id}`}
        >
          {shoe.name}
        </h3>
        <p
          className="text-gray-600 text-sm mb-4 line-clamp-2"
          data-testid={`product-description-${shoe.id}`}
        >
          {shoe.description}
        </p>
        <div className="flex items-center justify-between">
          <span
            className="text-2xl font-bold"
            style={{ color: "var(--color-primary)" }}
            data-testid={`product-price-${shoe.id}`}
          >
            ${shoe.price}
          </span>
          <span
            className="text-sm text-gray-500"
            data-testid={`product-colors-${shoe.id}`}
          >
            {shoe.colors.length} colors
          </span>
        </div>
      </div>
    </div>
  );

  const renderCompact = () => (
    <div
      className="card overflow-hidden"
      data-testid={`product-card-compact-${shoe.id}`}
    >
      <div className="relative overflow-hidden">
        <LazyImage
          src={shoe.images[0]}
          alt={shoe.name}
          aspectRatio="square"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          data-testid={`product-image-compact-${shoe.id}`}
        />
        {getBadgeContent()}
      </div>
      <div className="p-4">
        <p
          className="text-xs font-medium mb-1 uppercase tracking-wide"
          style={{ color: "var(--color-accent)" }}
          data-testid={`product-brand-compact-${shoe.id}`}
        >
          {shoe.brand}
        </p>
        <h3
          className="text-lg font-display font-semibold mb-2 group-hover:text-gray-600 transition-colors line-clamp-1"
          data-testid={`product-name-compact-${shoe.id}`}
        >
          {shoe.name}
        </h3>
        <p
          className="text-xl font-bold"
          style={{ color: "var(--color-primary)" }}
          data-testid={`product-price-compact-${shoe.id}`}
        >
          ${shoe.price}
        </p>
      </div>
    </div>
  );

  const renderFeatured = () => (
    <div
      className="card overflow-hidden"
      data-testid={`product-card-featured-${shoe.id}`}
    >
      <div className="relative overflow-hidden">
        <LazyImage
          src={shoe.images[0]}
          alt={shoe.name}
          aspectRatio="4/3"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          data-testid={`product-image-featured-${shoe.id}`}
        />
        {getBadgeContent()}
      </div>
      <div className="p-8">
        <p
          className="text-base font-medium mb-2"
          style={{ color: "var(--color-accent)" }}
          data-testid={`product-brand-featured-${shoe.id}`}
        >
          {shoe.brand}
        </p>
        <h3
          className="text-2xl font-display font-bold mb-3 group-hover:text-gray-600 transition-colors"
          data-testid={`product-name-featured-${shoe.id}`}
        >
          {shoe.name}
        </h3>
        <p
          className="text-gray-600 mb-6 line-clamp-3"
          data-testid={`product-description-featured-${shoe.id}`}
        >
          {shoe.description}
        </p>
        <div className="flex items-center justify-between">
          <span
            className="text-3xl font-bold"
            style={{ color: "var(--color-primary)" }}
            data-testid={`product-price-featured-${shoe.id}`}
          >
            ${shoe.price}
          </span>
          <div className="flex flex-col items-end">
            <span
              className="text-sm text-gray-500"
              data-testid={`product-colors-featured-${shoe.id}`}
            >
              {shoe.colors.length} colors
            </span>
            <span
              className="text-sm text-gray-500"
              data-testid={`product-sizes-featured-${shoe.id}`}
            >
              {shoe.sizes.length} sizes
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const getVariantContent = () => {
    switch (variant) {
      case "compact":
        return renderCompact();
      case "featured":
        return renderFeatured();
      default:
        return renderDefault();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      data-testid="product-card"
      data-product-id={shoe.id}
    >
      <Link
        to={`/shoe/${shoe.id}`}
        className="group block"
        data-testid={`product-card-link-${shoe.id}`}
      >
        {getVariantContent()}
      </Link>
    </motion.div>
  );
};

export default ProductCard;
