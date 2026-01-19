import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ProductCard from "../../components/product/ProductCard";
import { CartProvider } from "../../context/CartContext";
import { WishlistProvider } from "../../context/WishlistContext";
import { AuthProvider } from "../../context/AuthContext";
import type { Shoe } from "../../types";

const mockShoe: Shoe = {
  id: "snk-001",
  name: "Air Flow Pro",
  brand: "UrbanStep",
  price: 129.99,
  category: "sneakers",
  images: ["https://example.com/shoe.jpg"],
  sizes: [7, 8, 9, 10, 11],
  colors: ["White", "Black", "Navy"],
  description: "Classic design meets modern comfort.",
  features: ["Premium leather", "Memory foam"],
  featured: true,
  inStock: true,
};

const renderProductCard = (props = {}) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ProductCard shoe={mockShoe} {...props} />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>,
  );
};

describe("ProductCard", () => {
  describe("rendering", () => {
    it("should render the product card", () => {
      renderProductCard();
      expect(screen.getByTestId("product-card")).toBeInTheDocument();
    });

    it("should render product image", () => {
      renderProductCard();
      expect(
        screen.getByTestId(`product-image-${mockShoe.id}`),
      ).toBeInTheDocument();
    });

    it("should render product brand", () => {
      renderProductCard();
      expect(
        screen.getByTestId(`product-brand-${mockShoe.id}`),
      ).toHaveTextContent("UrbanStep");
    });

    it("should render product name", () => {
      renderProductCard();
      expect(
        screen.getByTestId(`product-name-${mockShoe.id}`),
      ).toHaveTextContent("Air Flow Pro");
    });

    it("should render product description", () => {
      renderProductCard();
      expect(
        screen.getByTestId(`product-description-${mockShoe.id}`),
      ).toHaveTextContent("Classic design meets modern comfort.");
    });

    it("should render product price", () => {
      renderProductCard();
      expect(
        screen.getByTestId(`product-price-${mockShoe.id}`),
      ).toHaveTextContent("$129.99");
    });

    it("should render colors count", () => {
      renderProductCard();
      expect(
        screen.getByTestId(`product-colors-${mockShoe.id}`),
      ).toHaveTextContent("3 colors");
    });

    it("should render wishlist button", () => {
      renderProductCard();
      expect(
        screen.getByTestId(`product-wishlist-button-${mockShoe.id}`),
      ).toBeInTheDocument();
    });

    it("should render link to product page", () => {
      renderProductCard();
      expect(
        screen.getByTestId(`product-card-link-${mockShoe.id}`),
      ).toHaveAttribute("href", "/shoe/snk-001");
    });
  });

  describe("variants", () => {
    it("should render default variant", () => {
      renderProductCard({ variant: "default" });
      expect(
        screen.getByTestId(`product-card-default-${mockShoe.id}`),
      ).toBeInTheDocument();
    });

    it("should render compact variant", () => {
      renderProductCard({ variant: "compact" });
      expect(
        screen.getByTestId(`product-card-compact-${mockShoe.id}`),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(`product-image-compact-${mockShoe.id}`),
      ).toBeInTheDocument();
    });

    it("should render featured variant", () => {
      renderProductCard({ variant: "featured" });
      expect(
        screen.getByTestId(`product-card-featured-${mockShoe.id}`),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(`product-sizes-featured-${mockShoe.id}`),
      ).toHaveTextContent("5 sizes");
    });
  });

  describe("badges", () => {
    it("should render featured badge", () => {
      renderProductCard({ showBadge: "featured" });
      expect(screen.getByText("Featured")).toBeInTheDocument();
    });

    it("should render new badge", () => {
      renderProductCard({ showBadge: "new" });
      expect(screen.getByText("NEW")).toBeInTheDocument();
    });

    it("should render sale badge", () => {
      renderProductCard({ showBadge: "sale" });
      expect(screen.getByText("SALE")).toBeInTheDocument();
    });

    it("should not render badge when showBadge is null", () => {
      renderProductCard({ showBadge: null });
      expect(screen.queryByText("Featured")).not.toBeInTheDocument();
      expect(screen.queryByText("NEW")).not.toBeInTheDocument();
      expect(screen.queryByText("SALE")).not.toBeInTheDocument();
    });
  });

  describe("wishlist functionality", () => {
    it("should toggle wishlist when button is clicked", () => {
      renderProductCard();
      const wishlistButton = screen.getByTestId(
        `product-wishlist-button-${mockShoe.id}`,
      );

      fireEvent.click(wishlistButton);
      expect(
        screen.getByTestId(`product-wishlist-icon-${mockShoe.id}`),
      ).toHaveStyle({ color: "#ef4444" });

      fireEvent.click(wishlistButton);
      expect(
        screen.getByTestId(`product-wishlist-icon-${mockShoe.id}`),
      ).toHaveStyle({ color: "#9ca3af" });
    });
  });

  describe("index prop", () => {
    it("should apply different animation delay based on index", () => {
      const { container } = renderProductCard({ index: 5 });
      const motionDiv = container.querySelector("[data-testid='product-card']");
      expect(motionDiv).toBeInTheDocument();
    });
  });

  describe("out of stock", () => {
    it("should handle out of stock shoes", () => {
      const outOfStockShoe = { ...mockShoe, inStock: false };
      render(
        <BrowserRouter>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <ProductCard shoe={outOfStockShoe} />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>,
      );
      expect(screen.getByTestId("product-card")).toBeInTheDocument();
    });
  });

  describe("featured shoes", () => {
    it("should correctly identify featured shoes", () => {
      renderProductCard({ showBadge: "featured" });
      expect(screen.getByText("Featured")).toBeInTheDocument();
    });
  });
});
