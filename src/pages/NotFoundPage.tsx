import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
      data-testid="not-found-page"
    >
      <div
        className="max-w-md w-full text-center"
        data-testid="not-found-content"
      >
        <div className="mb-8" data-testid="not-found-illustration">
          <div
            className="mx-auto w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center"
            data-testid="not-found-icon-container"
          >
            <span
              className="text-6xl font-bold text-gray-400"
              data-testid="not-found-404"
            >
              404
            </span>
          </div>
        </div>

        <h1
          className="text-3xl font-display font-bold text-gray-900 mb-4"
          data-testid="not-found-title"
        >
          Page Not Found
        </h1>

        <p
          className="text-gray-600 text-lg mb-8"
          data-testid="not-found-message"
        >
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:opacity-90"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "white",
            }}
            data-testid="home-link"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 rounded-full font-semibold transition-all duration-300 hover:bg-gray-100"
            style={{
              borderColor: "var(--color-primary)",
              color: "var(--color-primary)",
            }}
            data-testid="back-link"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
