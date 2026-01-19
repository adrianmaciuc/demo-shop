import {
  render,
  screen,
  waitFor,
  act,
  fireEvent,
} from "@testing-library/react";
import LazyImage from "../../components/ui/LazyImage";

describe("LazyImage", () => {
  const defaultProps = {
    src: "https://example.com/image.jpg",
    alt: "Test Image",
  };

  describe("rendering", () => {
    it("should render the lazy image container", () => {
      render(<LazyImage {...defaultProps} />);
      expect(screen.getByTestId("lazy-image-container")).toBeInTheDocument();
    });

    it("should render skeleton loader initially", () => {
      render(<LazyImage {...defaultProps} />);
      expect(screen.getByTestId("lazy-image-skeleton")).toBeInTheDocument();
    });

    it("should apply correct aspect ratio for square", () => {
      render(<LazyImage {...defaultProps} aspectRatio="square" />);
      const container = screen.getByTestId("lazy-image-container");
      expect(container).toHaveClass("aspect-square");
    });

    it("should apply correct aspect ratio for 4/3", () => {
      render(<LazyImage {...defaultProps} aspectRatio="4/3" />);
      const container = screen.getByTestId("lazy-image-container");
      expect(container).toHaveClass("aspect-[4/3]");
    });

    it("should apply correct aspect ratio for 16/9", () => {
      render(<LazyImage {...defaultProps} aspectRatio="16/9" />);
      const container = screen.getByTestId("lazy-image-container");
      expect(container).toHaveClass("aspect-video");
    });

    it("should apply correct aspect ratio for 3/4", () => {
      render(<LazyImage {...defaultProps} aspectRatio="3/4" />);
      const container = screen.getByTestId("lazy-image-container");
      expect(container).toHaveClass("aspect-[3/4]");
    });

    it("should apply custom className", async () => {
      render(
        <LazyImage
          {...defaultProps}
          className="custom-class"
          data-testid="lazy-image"
        />,
      );
      const img = await screen.findByTestId("lazy-image");
      expect(img).toHaveClass("custom-class");
    });
  });

  describe("custom test ID", () => {
    it("should use custom test ID for container", () => {
      render(<LazyImage {...defaultProps} data-testid="custom-image" />);
      expect(screen.getByTestId("custom-image-container")).toBeInTheDocument();
    });

    it("should use custom test ID for skeleton", () => {
      render(<LazyImage {...defaultProps} data-testid="custom-image" />);
      expect(screen.getByTestId("custom-image-skeleton")).toBeInTheDocument();
    });

    it("should use custom test ID for image", async () => {
      render(<LazyImage {...defaultProps} data-testid="custom-image" />);
      const img = await screen.findByTestId("custom-image");
      expect(img).toBeInTheDocument();
    });
  });

  describe("loading behavior", () => {
    it("should start with skeleton visible", async () => {
      render(<LazyImage {...defaultProps} data-testid="lazy-image" />);
      expect(screen.getByTestId("lazy-image-skeleton")).toBeVisible();
      const img = await screen.findByTestId("lazy-image");
      expect(img).toHaveClass("opacity-0");
    });

    it("should hide skeleton and show image after load", async () => {
      render(<LazyImage {...defaultProps} data-testid="lazy-image" />);

      const img = await screen.findByTestId("lazy-image");

      await act(async () => {
        fireEvent.load(img);
      });

      await waitFor(() => {
        expect(
          screen.queryByTestId("lazy-image-skeleton"),
        ).not.toBeInTheDocument();
        expect(img).toHaveClass("opacity-100");
      });
    });

    it("should handle image error gracefully", async () => {
      render(<LazyImage {...defaultProps} data-testid="lazy-image" />);
      const img = await screen.findByTestId("lazy-image");

      await act(async () => {
        fireEvent.error(img);
      });

      expect(img).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should have alt text", async () => {
      render(<LazyImage {...defaultProps} data-testid="lazy-image" />);
      const img = await screen.findByTestId("lazy-image");
      expect(img).toHaveAttribute("alt", "Test Image");
    });

    it("should have lazy loading attribute", async () => {
      render(<LazyImage {...defaultProps} data-testid="lazy-image" />);
      const img = await screen.findByTestId("lazy-image");
      expect(img).toHaveAttribute("loading", "lazy");
    });

    it("should have correct src attribute", async () => {
      render(<LazyImage {...defaultProps} data-testid="lazy-image" />);
      const img = await screen.findByTestId("lazy-image");
      expect(img).toHaveAttribute("src", "https://example.com/image.jpg");
    });
  });
});
