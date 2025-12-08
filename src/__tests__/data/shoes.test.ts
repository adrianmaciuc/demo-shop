import { shoes } from "../../data/shoes";
import type { ShoeCategory } from "../../types";

describe("Shoes Data", () => {
  describe("data structure", () => {
    it("should have shoes array", () => {
      expect(Array.isArray(shoes)).toBe(true);
      expect(shoes.length).toBeGreaterThan(0);
    });

    it("each shoe should have all required fields", () => {
      const requiredFields = [
        "id",
        "name",
        "brand",
        "price",
        "category",
        "images",
        "sizes",
        "colors",
        "description",
        "features",
        "featured",
        "inStock",
      ];

      shoes.forEach((shoe) => {
        requiredFields.forEach((field) => {
          expect(shoe).toHaveProperty(field);
        });
      });
    });
  });

  describe("field validation", () => {
    it("should have unique IDs", () => {
      const ids = shoes.map((shoe) => shoe.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("should have valid names", () => {
      shoes.forEach((shoe) => {
        expect(typeof shoe.name).toBe("string");
        expect(shoe.name.length).toBeGreaterThan(0);
      });
    });

    it("should have valid brands", () => {
      shoes.forEach((shoe) => {
        expect(typeof shoe.brand).toBe("string");
        expect(shoe.brand.length).toBeGreaterThan(0);
      });
    });

    it("should have positive prices", () => {
      shoes.forEach((shoe) => {
        expect(typeof shoe.price).toBe("number");
        expect(shoe.price).toBeGreaterThan(0);
      });
    });

    it("should have valid categories", () => {
      const validCategories: ShoeCategory[] = [
        "sneakers",
        "running",
        "casual",
        "formal",
        "boots",
      ];

      shoes.forEach((shoe) => {
        expect(validCategories).toContain(shoe.category);
      });
    });

    it("should have at least one image", () => {
      shoes.forEach((shoe) => {
        expect(Array.isArray(shoe.images)).toBe(true);
        expect(shoe.images.length).toBeGreaterThan(0);
        shoe.images.forEach((image) => {
          expect(typeof image).toBe("string");
          expect(image.length).toBeGreaterThan(0);
        });
      });
    });

    it("should have valid sizes array", () => {
      shoes.forEach((shoe) => {
        expect(Array.isArray(shoe.sizes)).toBe(true);
        expect(shoe.sizes.length).toBeGreaterThan(0);
        shoe.sizes.forEach((size) => {
          expect(typeof size).toBe("number");
          expect(size).toBeGreaterThan(0);
        });
      });
    });

    it("should have valid colors array", () => {
      shoes.forEach((shoe) => {
        expect(Array.isArray(shoe.colors)).toBe(true);
        expect(shoe.colors.length).toBeGreaterThan(0);
        shoe.colors.forEach((color) => {
          expect(typeof color).toBe("string");
          expect(color.length).toBeGreaterThan(0);
        });
      });
    });

    it("should have description", () => {
      shoes.forEach((shoe) => {
        expect(typeof shoe.description).toBe("string");
        expect(shoe.description.length).toBeGreaterThan(0);
      });
    });

    it("should have features array", () => {
      shoes.forEach((shoe) => {
        expect(Array.isArray(shoe.features)).toBe(true);
        expect(shoe.features.length).toBeGreaterThan(0);
        shoe.features.forEach((feature) => {
          expect(typeof feature).toBe("string");
          expect(feature.length).toBeGreaterThan(0);
        });
      });
    });

    it("should have boolean featured field", () => {
      shoes.forEach((shoe) => {
        expect(typeof shoe.featured).toBe("boolean");
      });
    });

    it("should have boolean inStock field", () => {
      shoes.forEach((shoe) => {
        expect(typeof shoe.inStock).toBe("boolean");
      });
    });
  });

  describe("category distribution", () => {
    it("should have shoes in all categories", () => {
      const categories = new Set(shoes.map((shoe) => shoe.category));
      const expectedCategories: ShoeCategory[] = [
        "sneakers",
        "running",
        "casual",
        "formal",
        "boots",
      ];

      expectedCategories.forEach((category) => {
        expect(categories).toContain(category);
      });
    });

    it("should have multiple shoes per category", () => {
      const categories: Record<ShoeCategory, number> = {
        sneakers: 0,
        running: 0,
        casual: 0,
        formal: 0,
        boots: 0,
      };

      shoes.forEach((shoe) => {
        categories[shoe.category]++;
      });

      Object.values(categories).forEach((count) => {
        expect(count).toBeGreaterThan(0);
      });
    });
  });

  describe("featured shoes", () => {
    it("should have some featured shoes", () => {
      const featuredShoes = shoes.filter((shoe) => shoe.featured);
      expect(featuredShoes.length).toBeGreaterThan(0);
    });

    it("featured shoes should be valid", () => {
      const featuredShoes = shoes.filter((shoe) => shoe.featured);

      featuredShoes.forEach((shoe) => {
        expect(shoe.id).toBeDefined();
        expect(shoe.name).toBeDefined();
        expect(shoe.price).toBeGreaterThan(0);
      });
    });
  });

  describe("in stock shoes", () => {
    it("should have some shoes in stock", () => {
      const inStockShoes = shoes.filter((shoe) => shoe.inStock);
      expect(inStockShoes.length).toBeGreaterThan(0);
    });
  });

  describe("price range", () => {
    it("should have reasonable price range", () => {
      const prices = shoes.map((shoe) => shoe.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      expect(minPrice).toBeGreaterThan(0);
      expect(maxPrice).toBeLessThan(1000);
      expect(maxPrice).toBeGreaterThan(minPrice);
    });
  });
});
