import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Navigation from "../../components/layout/Navigation";
import { CartProvider } from "../../context/CartContext";
import { WishlistProvider } from "../../context/WishlistContext";
import { AuthProvider } from "../../context/AuthContext";

const renderNavigation = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Navigation />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>,
  );
};

describe("Navigation", () => {
  describe("rendering", () => {
    it("should render the navigation component", () => {
      renderNavigation();
      expect(screen.getByTestId("navigation")).toBeInTheDocument();
    });

    it("should render the logo", () => {
      renderNavigation();
      expect(screen.getByTestId("nav-logo")).toBeInTheDocument();
      expect(screen.getByText("Apex Shoes")).toBeInTheDocument();
    });

    it("should render all category links", () => {
      renderNavigation();
      expect(screen.getByTestId("nav-category-sneakers")).toBeInTheDocument();
      expect(screen.getByTestId("nav-category-running")).toBeInTheDocument();
      expect(screen.getByTestId("nav-category-casual")).toBeInTheDocument();
      expect(screen.getByTestId("nav-category-formal")).toBeInTheDocument();
      expect(screen.getByTestId("nav-category-boots")).toBeInTheDocument();
    });

    it("should render About and Contact links", () => {
      renderNavigation();
      expect(screen.getByTestId("nav-about-link")).toBeInTheDocument();
      expect(screen.getByTestId("nav-contact-link")).toBeInTheDocument();
    });

    it("should render wishlist link", () => {
      renderNavigation();
      expect(screen.getByTestId("nav-wishlist-link")).toBeInTheDocument();
    });

    it("should render cart link", () => {
      renderNavigation();
      expect(screen.getByTestId("nav-cart-link")).toBeInTheDocument();
    });

    it("should render login and register links when not authenticated", () => {
      renderNavigation();
      expect(screen.getByText("Login")).toBeInTheDocument();
      expect(screen.getByText("Register")).toBeInTheDocument();
    });

    it("should render mobile menu button", () => {
      renderNavigation();
      expect(screen.getByTestId("nav-mobile-menu-button")).toBeInTheDocument();
    });
  });

  describe("mobile menu", () => {
    it("should toggle mobile menu when button is clicked", () => {
      renderNavigation();
      const mobileMenuButton = screen.getByTestId("nav-mobile-menu-button");

      expect(screen.queryByTestId("nav-mobile-menu")).not.toBeInTheDocument();

      fireEvent.click(mobileMenuButton);
      expect(screen.getByTestId("nav-mobile-menu")).toBeInTheDocument();

      fireEvent.click(mobileMenuButton);
      expect(screen.queryByTestId("nav-mobile-menu")).not.toBeInTheDocument();
    });

    it("should show all categories in mobile menu", () => {
      renderNavigation();
      const mobileMenuButton = screen.getByTestId("nav-mobile-menu-button");
      fireEvent.click(mobileMenuButton);

      expect(
        screen.getByTestId("nav-mobile-category-sneakers"),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("nav-mobile-category-running"),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("nav-mobile-category-casual"),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("nav-mobile-category-formal"),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("nav-mobile-category-boots"),
      ).toBeInTheDocument();
    });

    it("should show mobile About and Contact links", () => {
      renderNavigation();
      const mobileMenuButton = screen.getByTestId("nav-mobile-menu-button");
      fireEvent.click(mobileMenuButton);

      expect(screen.getByTestId("nav-mobile-about-link")).toBeInTheDocument();
      expect(screen.getByTestId("nav-mobile-contact-link")).toBeInTheDocument();
    });
  });

  describe("cart badge", () => {
    it("should not show cart badge when cart is empty", () => {
      renderNavigation();
      expect(screen.queryByTestId("nav-cart-count")).not.toBeInTheDocument();
    });
  });

  describe("wishlist badge", () => {
    it("should not show wishlist badge when wishlist is empty", () => {
      renderNavigation();
      expect(
        screen.queryByTestId("nav-wishlist-count"),
      ).not.toBeInTheDocument();
    });
  });

  describe("user menu", () => {
    it("should not show user menu when not authenticated", () => {
      renderNavigation();
      expect(
        screen.queryByRole("button", { name: /user menu/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe("category navigation", () => {
    it("should have correct href for category links", () => {
      renderNavigation();
      expect(screen.getByTestId("nav-category-sneakers")).toHaveAttribute(
        "href",
        "/category/sneakers",
      );
      expect(screen.getByTestId("nav-category-running")).toHaveAttribute(
        "href",
        "/category/running",
      );
      expect(screen.getByTestId("nav-category-casual")).toHaveAttribute(
        "href",
        "/category/casual",
      );
      expect(screen.getByTestId("nav-category-formal")).toHaveAttribute(
        "href",
        "/category/formal",
      );
      expect(screen.getByTestId("nav-category-boots")).toHaveAttribute(
        "href",
        "/category/boots",
      );
    });

    it("should have correct href for wishlist and cart", () => {
      renderNavigation();
      expect(screen.getByTestId("nav-wishlist-link")).toHaveAttribute(
        "href",
        "/wishlist",
      );
      expect(screen.getByTestId("nav-cart-link")).toHaveAttribute(
        "href",
        "/cart",
      );
    });
  });
});
