import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Breadcrumb from "../../components/layout/Breadcrumb";
import type { BreadcrumbItem } from "../../components/layout/Breadcrumb";

const renderBreadcrumb = (items: BreadcrumbItem[]) => {
  return render(
    <BrowserRouter>
      <Breadcrumb items={items} />
    </BrowserRouter>,
  );
};

describe("Breadcrumb", () => {
  describe("rendering", () => {
    it("should render the breadcrumb component", () => {
      renderBreadcrumb([{ label: "Sneakers", path: "/category/sneakers" }]);
      expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    });

    it("should render home link", () => {
      renderBreadcrumb([{ label: "Sneakers", path: "/category/sneakers" }]);
      expect(screen.getByTestId("breadcrumb-home")).toBeInTheDocument();
      expect(screen.getByText("Home")).toBeInTheDocument();
    });

    it("should render breadcrumb items", () => {
      renderBreadcrumb([
        { label: "Sneakers", path: "/category/sneakers" },
        { label: "Air Max", path: "/shoe/snk-001" },
      ]);
      expect(
        screen.getByTestId("breadcrumb-link-sneakers"),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("breadcrumb-current-air max"),
      ).toBeInTheDocument();
    });

    it("should render separators between items", () => {
      renderBreadcrumb([
        { label: "Sneakers", path: "/category/sneakers" },
        { label: "Air Max", path: "/shoe/snk-001" },
      ]);
      expect(screen.getByTestId("breadcrumb-separator-0")).toBeInTheDocument();
    });
  });

  describe("navigation", () => {
    it("should have correct href for home link", () => {
      renderBreadcrumb([{ label: "Sneakers", path: "/category/sneakers" }]);
      expect(screen.getByTestId("breadcrumb-home")).toHaveAttribute(
        "href",
        "/",
      );
    });

    it("should have correct href for breadcrumb links", () => {
      renderBreadcrumb([
        { label: "Sneakers", path: "/category/sneakers" },
        { label: "Air Max", path: "/shoe/snk-001" },
      ]);
      expect(screen.getByTestId("breadcrumb-link-sneakers")).toHaveAttribute(
        "href",
        "/category/sneakers",
      );
    });
  });

  describe("current item styling", () => {
    it("should render last item as current (non-link)", () => {
      renderBreadcrumb([{ label: "Sneakers", path: "/category/sneakers" }]);
      const currentItem = screen.getByTestId("breadcrumb-current-sneakers");
      expect(currentItem).toBeInTheDocument();
      expect(currentItem.tagName).toBe("SPAN");
    });

    it("should have bold styling for current item", () => {
      renderBreadcrumb([{ label: "Sneakers", path: "/category/sneakers" }]);
      const currentItem = screen.getByTestId("breadcrumb-current-sneakers");
      expect(currentItem).toHaveClass("text-gray-900 font-semibold");
    });
  });

  describe("multiple items", () => {
    it("should render all items in correct order", () => {
      renderBreadcrumb([
        { label: "Home", path: "/" },
        { label: "Sneakers", path: "/category/sneakers" },
        { label: "Running", path: "/category/running" },
      ]);
      expect(screen.getByTestId("breadcrumb-home")).toBeInTheDocument();
      expect(
        screen.getByTestId("breadcrumb-link-sneakers"),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("breadcrumb-current-running"),
      ).toBeInTheDocument();
    });

    it("should have separators between all items", () => {
      renderBreadcrumb([
        { label: "Sneakers", path: "/category/sneakers" },
        { label: "Running", path: "/category/running" },
        { label: "Boots", path: "/category/boots" },
      ]);
      expect(screen.getByTestId("breadcrumb-separator-0")).toBeInTheDocument();
      expect(screen.getByTestId("breadcrumb-separator-1")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should have aria-label on nav element", () => {
      renderBreadcrumb([{ label: "Sneakers", path: "/category/sneakers" }]);
      expect(screen.getByTestId("breadcrumb")).toHaveAttribute(
        "aria-label",
        "Breadcrumb",
      );
    });
  });
});
