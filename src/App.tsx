import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/layout/Navigation';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ShoePage from './pages/ShoePage';
import CartPage from './pages/CartPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-secondary)' }}>
          <Navigation />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/category/:categoryName" element={<CategoryPage />} />
              <Route path="/shoe/:id" element={<ShoePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </main>
          <footer className="py-8 px-4 text-center text-gray-600 text-sm border-t border-gray-200">
            <p>© 2024 Sole Street. All rights reserved.</p>
          </footer>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;