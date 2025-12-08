import {
  formatPrice,
  calculateShippingCost,
  calculateTax,
  calculateTotal,
  isValidShoeSize,
  filterByCategory,
  sortByPrice,
  sortByName,
  searchShoes,
} from "../../utils/test-helpers";

describe("Test Helper Utilities", () => {
  describe("formatPrice", () => {
    it("should format price as USD currency", () => {
      expect(formatPrice(99.99)).toMatch(/\$99\.99|$99.99/);
    });

    it("should handle whole numbers", () => {
      expect(formatPrice(100)).toMatch(/\$100\.00|$100.00/);
    });

    it("should handle large prices", () => {
      const formatted = formatPrice(1299.99);
      expect(formatted).toMatch(/1[,.]299/);
    });
  });

  describe("calculateShippingCost", () => {
    it("should return 0 for orders over $100", () => {
      expect(calculateShippingCost(150)).toBe(0);
    });

    it("should return $5 for orders $50-$100", () => {
      expect(calculateShippingCost(75)).toBe(5);
    });

    it("should return $10 for orders under $50", () => {
      expect(calculateShippingCost(25)).toBe(10);
    });

    it("should handle boundary at $100", () => {
      expect(calculateShippingCost(100)).toBe(0);
    });

    it("should handle boundary at $50", () => {
      expect(calculateShippingCost(50)).toBe(5);
    });
  });

  describe("calculateTax", () => {
    it("should calculate default 8% tax", () => {
      expect(calculateTax(100)).toBeCloseTo(8, 2);
    });

    it("should calculate custom tax rate", () => {
      expect(calculateTax(100, 0.1)).toBeCloseTo(10, 2);
    });

    it("should handle zero subtotal", () => {
      expect(calculateTax(0)).toBe(0);
    });

    it("should round to 2 decimal places", () => {
      const result = calculateTax(99.99);
      const decimalPart = result.toString().split(".")[1];
      expect(decimalPart?.length || 0).toBeLessThanOrEqual(2);
    });
  });

  describe("calculateTotal", () => {
    it("should include subtotal, tax, and shipping", () => {
      const total = calculateTotal(100);
      // $100 + $8 (8% tax) + $0 (over $100) = $108
      expect(total).toBeCloseTo(108, 2);
    });

    it("should calculate correctly for small orders", () => {
      const total = calculateTotal(25);
      // $25 + $2 (8% tax) + $10 (shipping) = $37
      expect(total).toBeCloseTo(37, 1);
    });

    it("should calculate correctly for medium orders", () => {
      const total = calculateTotal(75);
      // $75 + $6 (8% tax) + $5 (shipping) = $86
      expect(total).toBeCloseTo(86, 2);
    });
  });

  describe("isValidShoeSize", () => {
    it("should validate whole sizes", () => {
      expect(isValidShoeSize(8)).toBe(true);
      expect(isValidShoeSize(10)).toBe(true);
    });

    it("should validate half sizes", () => {
      expect(isValidShoeSize(8.5)).toBe(true);
      expect(isValidShoeSize(10.5)).toBe(true);
    });

    it("should reject invalid sizes", () => {
      expect(isValidShoeSize(5)).toBe(false);
      expect(isValidShoeSize(16)).toBe(false);
      expect(isValidShoeSize(8.3)).toBe(false);
    });

    it("should accept all valid range", () => {
      for (let i = 6; i <= 15; i += 0.5) {
        expect(isValidShoeSize(i)).toBe(true);
      }
    });
  });

  describe("filterByCategory", () => {
    const mockItems = [
      { id: 1, category: "sneakers", name: "Shoe 1" },
      { id: 2, category: "running", name: "Shoe 2" },
      { id: 3, category: "sneakers", name: "Shoe 3" },
    ];

    it("should filter items by category", () => {
      const filtered = filterByCategory(mockItems, "sneakers");
      expect(filtered).toHaveLength(2);
      expect(filtered.every((item) => item.category === "sneakers")).toBe(true);
    });

    it("should return empty array for non-matching category", () => {
      const filtered = filterByCategory(mockItems, "boots");
      expect(filtered).toHaveLength(0);
    });
  });

  describe("sortByPrice", () => {
    const mockItems = [
      { id: 1, price: 100, name: "Shoe 1" },
      { id: 2, price: 50, name: "Shoe 2" },
      { id: 3, price: 75, name: "Shoe 3" },
    ];

    it("should sort by price ascending", () => {
      const sorted = sortByPrice(mockItems, "asc");
      expect(sorted[0].price).toBe(50);
      expect(sorted[2].price).toBe(100);
    });

    it("should sort by price descending", () => {
      const sorted = sortByPrice(mockItems, "desc");
      expect(sorted[0].price).toBe(100);
      expect(sorted[2].price).toBe(50);
    });

    it("should not mutate original array", () => {
      const original = [...mockItems];
      sortByPrice(mockItems, "asc");
      expect(mockItems).toEqual(original);
    });
  });

  describe("sortByName", () => {
    const mockItems = [
      { id: 1, name: "Zebra Shoe" },
      { id: 2, name: "Apple Shoe" },
      { id: 3, name: "Mango Shoe" },
    ];

    it("should sort by name ascending", () => {
      const sorted = sortByName(mockItems, "asc");
      expect(sorted[0].name).toBe("Apple Shoe");
      expect(sorted[2].name).toBe("Zebra Shoe");
    });

    it("should sort by name descending", () => {
      const sorted = sortByName(mockItems, "desc");
      expect(sorted[0].name).toBe("Zebra Shoe");
      expect(sorted[2].name).toBe("Apple Shoe");
    });
  });

  describe("searchShoes", () => {
    const mockItems = [
      {
        id: 1,
        name: "Air Max",
        brand: "Nike",
        description: "Running shoe",
      },
      {
        id: 2,
        name: "Boost",
        brand: "Adidas",
        description: "Performance shoe",
      },
      {
        id: 3,
        name: "Classic",
        brand: "Puma",
        description: "Casual shoe",
      },
    ];

    it("should search by name", () => {
      const results = searchShoes(mockItems, "Air Max");
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe(1);
    });

    it("should search by brand", () => {
      const results = searchShoes(mockItems, "Nike");
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe(1);
    });

    it("should search by description", () => {
      const results = searchShoes(mockItems, "Running");
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe(1);
    });

    it("should be case insensitive", () => {
      const results = searchShoes(mockItems, "nike");
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe(1);
    });

    it("should return multiple matches", () => {
      const results = searchShoes(mockItems, "shoe");
      expect(results.length).toBeGreaterThan(0);
    });

    it("should return empty array for no matches", () => {
      const results = searchShoes(mockItems, "nonexistent");
      expect(results).toHaveLength(0);
    });
  });
});
