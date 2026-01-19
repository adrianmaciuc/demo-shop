import { render, screen } from "@testing-library/react";
import Skeleton from "../../components/ui/Skeleton";

describe("Skeleton", () => {
  describe("rendering", () => {
    it("should render the skeleton component", () => {
      render(<Skeleton />);
      expect(screen.getByTestId("skeleton")).toBeInTheDocument();
    });

    it("should apply shimmer animation", () => {
      render(<Skeleton />);
      const skeleton = screen.getByTestId("skeleton");
      expect(skeleton).toHaveClass("animate-shimmer");
    });

    it("should apply gradient background", () => {
      render(<Skeleton />);
      const skeleton = screen.getByTestId("skeleton");
      expect(skeleton).toHaveClass("bg-gradient-to-r");
      expect(skeleton).toHaveClass("from-gray-200");
      expect(skeleton).toHaveClass("via-gray-300");
      expect(skeleton).toHaveClass("to-gray-200");
    });
  });

  describe("variants", () => {
    it("should render rectangular variant by default", () => {
      render(<Skeleton />);
      expect(screen.getByTestId("skeleton")).toHaveClass("rounded-lg");
    });

    it("should render rectangular variant explicitly", () => {
      render(<Skeleton variant="rectangular" />);
      expect(screen.getByTestId("skeleton")).toHaveClass("rounded-lg");
    });

    it("should render text variant", () => {
      render(<Skeleton variant="text" />);
      expect(screen.getByTestId("skeleton")).toHaveClass("rounded");
      expect(screen.getByTestId("skeleton")).toHaveClass("h-4");
    });

    it("should render circular variant", () => {
      render(<Skeleton variant="circular" />);
      expect(screen.getByTestId("skeleton")).toHaveClass("rounded-full");
    });
  });

  describe("custom dimensions", () => {
    it("should apply custom width", () => {
      render(<Skeleton width="200px" />);
      expect(screen.getByTestId("skeleton")).toHaveStyle({ width: "200px" });
    });

    it("should apply custom height", () => {
      render(<Skeleton height="50px" />);
      expect(screen.getByTestId("skeleton")).toHaveStyle({ height: "50px" });
    });

    it("should apply both width and height", () => {
      render(<Skeleton width="100px" height="100px" />);
      const skeleton = screen.getByTestId("skeleton");
      expect(skeleton).toHaveStyle({ width: "100px" });
      expect(skeleton).toHaveStyle({ height: "100px" });
    });
  });

  describe("custom className", () => {
    it("should apply custom className", () => {
      render(<Skeleton className="custom-skeleton" />);
      expect(screen.getByTestId("skeleton")).toHaveClass("custom-skeleton");
    });

    it("should combine custom className with base classes", () => {
      render(<Skeleton className="my-4" />);
      const skeleton = screen.getByTestId("skeleton");
      expect(skeleton).toHaveClass("my-4");
      expect(skeleton).toHaveClass("bg-gradient-to-r");
      expect(skeleton).toHaveClass("animate-shimmer");
    });
  });

  describe("custom test ID", () => {
    it("should use custom test ID", () => {
      render(<Skeleton data-testid="custom-skeleton" />);
      expect(screen.getByTestId("custom-skeleton")).toBeInTheDocument();
    });
  });

  describe("background size", () => {
    it("should have correct background size for shimmer effect", () => {
      render(<Skeleton />);
      expect(screen.getByTestId("skeleton")).toHaveStyle({
        backgroundSize: "200% 100%",
      });
    });
  });
});
