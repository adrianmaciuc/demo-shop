import { render, screen, fireEvent } from "@testing-library/react";
import { ShoppingBag, Search, Heart } from "lucide-react";
import EmptyState from "../../components/ui/EmptyState";

describe("EmptyState", () => {
  const defaultProps = {
    icon: ShoppingBag,
    title: "Your cart is empty",
    description: "Looks like you haven't added anything to your cart yet.",
  };

  describe("rendering", () => {
    it("should render the empty state component", () => {
      render(<EmptyState {...defaultProps} />);
      expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
    });

    it("should render the icon", () => {
      render(<EmptyState {...defaultProps} />);
      const icon = screen.getByTestId("empty-state-icon");
      expect(icon).toBeInTheDocument();
    });

    it("should render the title", () => {
      render(<EmptyState {...defaultProps} />);
      expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
    });

    it("should render the description", () => {
      render(<EmptyState {...defaultProps} />);
      expect(
        screen.getByText(
          "Looks like you haven't added anything to your cart yet.",
        ),
      ).toBeInTheDocument();
    });
  });

  describe("action button", () => {
    it("should not render action button when no action is provided", () => {
      render(<EmptyState {...defaultProps} />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("should render action button when actionLabel and onAction are provided", () => {
      render(
        <EmptyState
          {...defaultProps}
          actionLabel="Start Shopping"
          onAction={() => {}}
        />,
      );
      expect(
        screen.getByRole("button", { name: "Start Shopping" }),
      ).toBeInTheDocument();
    });

    it("should call onAction when button is clicked", () => {
      const onAction = jest.fn();
      render(
        <EmptyState
          {...defaultProps}
          actionLabel="Start Shopping"
          onAction={onAction}
        />,
      );
      fireEvent.click(screen.getByRole("button", { name: "Start Shopping" }));
      expect(onAction).toHaveBeenCalledTimes(1);
    });
  });

  describe("different icons", () => {
    it("should render different icon types", () => {
      render(
        <EmptyState
          icon={Search}
          title="No results found"
          description="Try adjusting your search or filter criteria."
        />,
      );
      expect(screen.getByTestId("empty-state-icon")).toBeInTheDocument();
    });

    it("should render heart icon", () => {
      render(
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save items you love to your wishlist."
        />,
      );
      expect(screen.getByTestId("empty-state-icon")).toBeInTheDocument();
    });
  });

  describe("animation control", () => {
    it("should animate by default", () => {
      render(<EmptyState {...defaultProps} />);
      const container = screen.getByText("Your cart is empty").closest("div");
      expect(container).toBeInTheDocument();
    });

    it("should disable animation when showAnimation is false", () => {
      render(<EmptyState {...defaultProps} showAnimation={false} />);
      expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("should have centered layout", () => {
      render(<EmptyState {...defaultProps} />);
      const container = screen.getByText("Your cart is empty").closest("div");
      expect(container).toHaveClass("text-center");
      expect(container).toHaveClass("py-16");
    });

    it("should have icon container with correct styling", () => {
      render(<EmptyState {...defaultProps} />);
      const iconContainer = screen
        .getByTestId("empty-state-icon")
        .closest("div");
      expect(iconContainer).toHaveClass("inline-flex");
      expect(iconContainer).toHaveClass("items-center");
      expect(iconContainer).toHaveClass("justify-center");
      expect(iconContainer).toHaveClass("w-20");
      expect(iconContainer).toHaveClass("h-20");
      expect(iconContainer).toHaveClass("rounded-full");
    });

    it("should have styled title", () => {
      render(<EmptyState {...defaultProps} />);
      const title = screen.getByText("Your cart is empty");
      expect(title).toHaveClass("text-2xl");
      expect(title).toHaveClass("font-display");
      expect(title).toHaveClass("font-semibold");
      expect(title).toHaveClass("mb-2");
    });

    it("should have styled description", () => {
      render(<EmptyState {...defaultProps} />);
      const description = screen.getByText(
        "Looks like you haven't added anything to your cart yet.",
      );
      expect(description).toHaveClass("text-gray-600");
      expect(description).toHaveClass("mb-6");
      expect(description).toHaveClass("max-w-md");
      expect(description).toHaveClass("mx-auto");
    });
  });
});
