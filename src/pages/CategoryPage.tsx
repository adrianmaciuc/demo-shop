import { useParams } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { Filter, SlidersHorizontal, Search, Package } from "lucide-react";
import { shoes, categories } from "../data/shoes";
import type { ShoeCategory } from "../types";
import ProductCard from "../components/product/ProductCard";
import Breadcrumb from "../components/layout/Breadcrumb";
import EmptyState from "../components/ui/EmptyState";

type SortOption =
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "newest";

const CategoryPage = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300]);
  const [showFilters, setShowFilters] = useState(false);

  // Scroll to top on mount and when category changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryName]);

  // Get category info
  const categoryInfo = categories.find((cat) => cat.id === categoryName);

  // Filter shoes by category
  const categoryShoes = shoes.filter(
    (shoe) => shoe.category === (categoryName as ShoeCategory),
  );

  // Get all available sizes and colors for this category
  const availableSizes = useMemo(() => {
    const sizes = new Set<number>();
    categoryShoes.forEach((shoe) =>
      shoe.sizes.forEach((size) => sizes.add(size)),
    );
    return Array.from(sizes).sort((a, b) => a - b);
  }, [categoryShoes]);

  const availableColors = useMemo(() => {
    const colors = new Set<string>();
    categoryShoes.forEach((shoe) =>
      shoe.colors.forEach((color) => colors.add(color)),
    );
    return Array.from(colors).sort();
  }, [categoryShoes]);

  // Filter and sort shoes
  const filteredShoes = useMemo(() => {
    let filtered = [...categoryShoes];

    // Filter by size
    if (selectedSizes.length > 0) {
      filtered = filtered.filter((shoe) =>
        selectedSizes.some((size) => shoe.sizes.includes(size)),
      );
    }

    // Filter by color
    if (selectedColors.length > 0) {
      filtered = filtered.filter((shoe) =>
        selectedColors.some((color) => shoe.colors.includes(color)),
      );
    }

    // Filter by price
    filtered = filtered.filter(
      (shoe) => shoe.price >= priceRange[0] && shoe.price <= priceRange[1],
    );

    // Sort
    switch (sortBy) {
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        // Already in order from mock data
        break;
    }

    return filtered;
  }, [categoryShoes, selectedSizes, selectedColors, priceRange, sortBy]);

  // Toggle size filter
  const toggleSize = (size: number) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  // Toggle color filter
  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange([0, 300]);
  };

  const hasActiveFilters =
    selectedSizes.length > 0 ||
    selectedColors.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 300;

  return (
    <div className="min-h-screen" data-testid="category-page">
      {/* Category Header */}
      <div
        className="relative h-64 bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center"
        style={{
          backgroundImage: categoryInfo?.image
            ? `url(${categoryInfo.image})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        data-testid="category-header-banner"
      >
        <div
          className="absolute inset-0 bg-black/50"
          data-testid="category-header-overlay"
        />
        <div
          className="relative z-10 text-center px-4"
          data-testid="category-header-content"
        >
          <h1
            className="text-5xl font-display font-bold text-white mb-4 capitalize"
            data-testid="category-header-title"
          >
            {categoryName}
          </h1>
          <p
            className="text-xl text-gray-200"
            data-testid="category-header-description"
          >
            {categoryInfo?.description || "Explore our collection"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        {categoryInfo && (
          <Breadcrumb
            items={[
              { label: categoryInfo.name, path: `/category/${categoryName}` },
            ]}
            data-testid="category-breadcrumb"
          />
        )}
        {/* Controls Bar */}
        <div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
          data-testid="category-controls-bar"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              data-testid="category-filter-toggle"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="font-medium">Filters</span>
              {hasActiveFilters && (
                <span
                  className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full"
                  data-testid="category-filter-active-badge"
                >
                  Active
                </span>
              )}
            </button>

            <p className="text-gray-600" data-testid="category-product-count">
              <span
                className="font-semibold"
                data-testid="category-product-count-number"
              >
                {filteredShoes.length}
              </span>{" "}
              products
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="sort"
              className="text-sm font-medium text-gray-700"
              data-testid="category-sort-label"
            >
              Sort by:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              data-testid="category-sort-dropdown"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside
            className={`lg:w-64 space-y-6 ${
              showFilters ? "block" : "hidden lg:block"
            }`}
            data-testid="category-filters-sidebar"
          >
            <div
              className="bg-white p-6 rounded-xl shadow-sm sticky top-20"
              data-testid="category-filters-panel"
            >
              <div className="flex items-center justify-between mb-6">
                <h3
                  className="text-lg font-display font-bold"
                  data-testid="category-filters-heading"
                >
                  Filters
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                    data-testid="category-clear-filters-button"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Size Filter */}
              <div
                className="mb-6 pb-6 border-b border-gray-200"
                data-testid="category-filter-size"
              >
                <h4
                  className="font-semibold mb-3 flex items-center gap-2"
                  data-testid="category-filter-size-heading"
                >
                  <Filter className="w-4 h-4" />
                  Size
                </h4>
                <div
                  className="grid grid-cols-4 gap-2"
                  data-testid="category-filter-size-options"
                >
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`px-3 py-2 rounded-lg border transition-all ${
                        selectedSizes.includes(size)
                          ? "border-orange-500 bg-orange-50 text-orange-700 font-semibold"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      data-testid={`category-filter-size-${size}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Filter */}
              <div
                className="mb-6 pb-6 border-b border-gray-200"
                data-testid="category-filter-color"
              >
                <h4
                  className="font-semibold mb-3 flex items-center gap-2"
                  data-testid="category-filter-color-heading"
                >
                  <Filter className="w-4 h-4" />
                  Color
                </h4>
                <div
                  className="space-y-2"
                  data-testid="category-filter-color-options"
                >
                  {availableColors.map((color) => (
                    <label
                      key={color}
                      className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      data-testid={`category-filter-color-${color}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedColors.includes(color)}
                        onChange={() => toggleColor(color)}
                        className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                        data-testid={`category-filter-color-checkbox-${color}`}
                      />
                      <span className="text-sm">{color}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div data-testid="category-filter-price">
                <h4
                  className="font-semibold mb-3 flex items-center gap-2"
                  data-testid="category-filter-price-heading"
                >
                  <Filter className="w-4 h-4" />
                  Price Range
                </h4>
                <div className="space-y-4">
                  <div
                    className="flex items-center gap-2 text-sm"
                    data-testid="category-filter-price-display"
                  >
                    <span
                      className="font-medium"
                      data-testid="category-filter-price-min"
                    >
                      ${priceRange[0]}
                    </span>
                    <span className="text-gray-400">-</span>
                    <span
                      className="font-medium"
                      data-testid="category-filter-price-max"
                    >
                      ${priceRange[1]}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="300"
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full accent-orange-500"
                    data-testid="category-filter-price-slider"
                  />
                  <div
                    className="flex gap-2"
                    data-testid="category-filter-price-inputs"
                  >
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([
                          parseInt(e.target.value) || 0,
                          priceRange[1],
                        ])
                      }
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                      data-testid="category-filter-price-min-input"
                    />
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([
                          priceRange[0],
                          parseInt(e.target.value) || 300,
                        ])
                      }
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                      data-testid="category-filter-price-max-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1" data-testid="category-products-container">
            {categoryShoes.length === 0 ? (
              // Category is completely empty
              <EmptyState
                icon={Package}
                title="Coming Soon"
                description={`We're working on bringing you amazing ${categoryName} products. Check back soon!`}
                actionLabel="Browse Other Categories"
                onAction={() => window.history.back()}
                showAnimation={true}
              />
            ) : filteredShoes.length > 0 ? (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                data-testid="category-products-grid"
              >
                {filteredShoes.map((shoe, index) => (
                  <ProductCard
                    key={shoe.id}
                    shoe={shoe}
                    index={index}
                    variant="default"
                    showBadge={shoe.featured ? "featured" : null}
                  />
                ))}
              </div>
            ) : (
              // Filters resulted in no products
              <EmptyState
                icon={Search}
                title="No products found"
                description="Try adjusting your filters to see more results"
                actionLabel="Clear Filters"
                onAction={clearFilters}
                showAnimation={true}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
