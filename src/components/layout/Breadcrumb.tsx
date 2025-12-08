import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 text-sm text-gray-600 mb-6"
      data-testid="breadcrumb"
    >
      <Link
        to="/"
        className="hover:text-gray-900 transition-colors font-medium"
        data-testid="breadcrumb-home"
      >
        Home
      </Link>
      {items.map((item, index) => (
        <div
          key={`${item.path}-${index}`}
          className="flex items-center gap-2"
          data-testid={`breadcrumb-item-${index}`}
        >
          <ChevronRight
            className="w-4 h-4 text-gray-400"
            data-testid={`breadcrumb-separator-${index}`}
          />
          {index === items.length - 1 ? (
            <span
              className="text-gray-900 font-semibold"
              data-testid={`breadcrumb-current-${item.label.toLowerCase()}`}
            >
              {item.label}
            </span>
          ) : (
            <Link
              to={item.path}
              className="hover:text-gray-900 transition-colors font-medium"
              data-testid={`breadcrumb-link-${item.label.toLowerCase()}`}
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
