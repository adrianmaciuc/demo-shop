import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import Navigation from "./components/layout/Navigation";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ProductCardSkeleton from "./components/product/ProductCardSkeleton";
import PageTransition from "./components/ui/PageTransition";
import ErrorBoundary from "./components/ui/ErrorBoundary";

const HomePage = lazy(() => import("./pages/HomePage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const ShoePage = lazy(() => import("./pages/ShoePage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const OrderProcessingPage = lazy(() => import("./pages/OrderProcessingPage"));
const OrderSuccessPage = lazy(() => import("./pages/OrderSuccessPage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const OrderDetailPage = lazy(() => import("./pages/OrderDetailPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const PageLoader = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <div
                className="min-h-screen flex flex-col"
                style={{ backgroundColor: "var(--color-secondary)" }}
              >
                <Navigation />
                <main className="flex-1">
                  <AnimatePresence mode="wait">
                    <Suspense fallback={<PageLoader />}>
                      <ErrorBoundary>
                        <PageTransition>
                          <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route
                              path="/category/:categoryName"
                              element={<CategoryPage />}
                            />
                            <Route path="/shoe/:id" element={<ShoePage />} />
                            <Route path="/cart" element={<CartPage />} />
                            <Route
                              path="/checkout"
                              element={<CheckoutPage />}
                            />
                            <Route
                              path="/order-processing"
                              element={<OrderProcessingPage />}
                            />
                            <Route
                              path="/order-success"
                              element={<OrderSuccessPage />}
                            />
                            <Route
                              path="/wishlist"
                              element={<WishlistPage />}
                            />
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/contact" element={<ContactPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route
                              path="/register"
                              element={<RegisterPage />}
                            />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/orders" element={<OrdersPage />} />
                            <Route
                              path="/orders/:id"
                              element={<OrderDetailPage />}
                            />
                            <Route
                              path="*"
                              element={
                                <ErrorBoundary>
                                  <NotFoundPage />
                                </ErrorBoundary>
                              }
                            />
                          </Routes>
                        </PageTransition>
                      </ErrorBoundary>
                    </Suspense>
                  </AnimatePresence>
                </main>
                <footer className="py-8 px-4 text-center text-gray-600 text-sm border-t border-gray-200">
                  <p>© 2026 Adrian Maciuc.</p>
                </footer>
              </div>
            </Router>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
