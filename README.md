# 👟 Apex Shoes - E-Commerce Shoe Shop

A modern, fully-functional e-commerce shoe shop built with React, TypeScript, and Tailwind CSS. This is a **demo project** designed for learning and experimentation with modern web development practices.

![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-blue)
![Vite](https://img.shields.io/badge/Vite-6.0-purple)

## ✨ Features

### Core Functionality

- 🏠 **Home Page** - Hero section, featured products, category showcase
- 🔍 **Category Pages** - Filter by size, color, price range with real-time sorting
- 👟 **Product Details** - Image gallery, size/color selection, detailed specifications
- 🛒 **Shopping Cart** - Add/remove items, quantity management, order summary
- 📱 **Fully Responsive** - Mobile-first design that works on all devices
- 🎨 **Modern UI/UX** - Smooth animations, hover effects, toast notifications

### Technical Features

- ⚛️ Built with **React 18** and **TypeScript** for type safety
- 🎨 **Tailwind CSS v4** for modern, utility-first styling
- 🚀 **Vite** for lightning-fast development
- 🔄 **React Router** for seamless navigation
- 💾 **Context API** for global state management
- ✨ **Framer Motion** for smooth animations
- 🎯 **Lucide React** for beautiful icons

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn**

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/adrianmaciuc/demo-shop.git
cd demo-shop
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the development server**

```bash
npm run dev
```

4. **Open your browser**

```
http://localhost:5173
```

---

## 📜 Available Scripts

### Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Code Quality

```bash
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors automatically
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run type-check   # Run TypeScript type checking
```

---

## 🛠️ Tech Stack

| Technology           | Purpose                                         |
| -------------------- | ----------------------------------------------- |
| **React 18**         | UI library for building interactive interfaces  |
| **TypeScript**       | Static typing for safer, more maintainable code |
| **Vite**             | Fast build tool and development server          |
| **Tailwind CSS v4**  | Utility-first CSS framework                     |
| **React Router DOM** | Client-side routing                             |
| **Framer Motion**    | Animation library                               |
| **Lucide React**     | Icon library                                    |

---

## 📁 Project Structure

```
sole-street/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   └── Navigation.tsx      # Main navigation component
│   │   └── product/
│   │       └── ProductCard.tsx     # Reusable product card
│   ├── context/
│   │   └── CartContext.tsx         # Global cart state management
│   ├── data/
│   │   └── shoes.ts                # Mock product data
│   ├── pages/
│   │   ├── HomePage.tsx            # Landing page
│   │   ├── CategoryPage.tsx        # Category listing with filters
│   │   ├── ShoePage.tsx            # Individual product page
│   │   ├── CartPage.tsx            # Shopping cart
│   │   ├── AboutPage.tsx           # About page
│   │   └── ContactPage.tsx         # Contact page
│   ├── types/
│   │   └── index.ts                # TypeScript type definitions
│   ├── App.tsx                     # Main app component with routing
│   ├── index.css                   # Global styles and Tailwind config
│   └── main.tsx                    # App entry point
├── .eslintrc.cjs                   # ESLint configuration
├── .prettierrc                     # Prettier configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite configuration
└── package.json                    # Dependencies and scripts
```

---

## 🎨 Design System

### Color Palette (Warm Minimal)

- **Primary**: `#2D2D2D` - Dark gray for text and primary elements
- **Secondary**: `#FAF9F6` - Cream background
- **Accent**: `#E07A5F` - Terracotta/burnt orange for CTAs
- **Accent Dark**: `#C25E45` - Darker accent for hover states

### Typography

- **Headings**: Space Grotesk (bold, modern)
- **Body**: Inter (clean, readable)

---

## 🧪 Code Quality & Linting

This project uses ESLint and Prettier to maintain code quality and consistency.

### ESLint Configuration

- **TypeScript support** with `@typescript-eslint`
- **React-specific rules** with `eslint-plugin-react-hooks`
- **Import sorting** with `eslint-plugin-simple-import-sort`
- **Unused imports detection** with `eslint-plugin-unused-imports`

### Prettier Configuration

- **Print width**: 100 characters
- **Single quotes** for strings
- **Trailing commas** in ES5
- **Tab width**: 2 spaces

### Running Linters

```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix

# Check code formatting
npm run format:check

# Format code
npm run format

# Type check
npm run type-check
```

---

## 🎯 Key Features Breakdown

### Shopping Cart System

- **Add to Cart** - Select size, color, and quantity
- **Cart Management** - Update quantities, remove items
- **Order Summary** - Real-time calculation of subtotal, shipping, tax
- **Free Shipping** - Automatic free shipping over $100
- **Toast Notifications** - Success messages on actions

### Product Filtering

- **Size Filter** - Filter by available shoe sizes
- **Color Filter** - Filter by color options
- **Price Range** - Adjustable min/max price slider
- **Sorting** - Sort by price, name, newest

### Responsive Design

- **Mobile-first** approach
- **Breakpoints**:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px

---

## 🌟 Demo Features

This is a **demo project** with the following characteristics:

### What's Included

✅ Fully functional shopping cart
✅ Product browsing and filtering
✅ Responsive design
✅ Modern UI with animations
✅ TypeScript for type safety
✅ Mock data (18 products across 5 categories)

### What's NOT Included (Intentionally)

❌ Backend/API integration
❌ Payment processing
❌ User authentication
❌ Database persistence
❌ Order management

### Use Cases

- 📚 **Learning React & TypeScript**
- 🎨 **UI/UX experimentation**
- 🛠️ **Testing state management patterns**
- 🚀 **Portfolio project**
- 🎓 **Educational purposes**

---

## 🤝 Contributing

This is a demo project, but contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- **Product Images** - [Unsplash](https://unsplash.com)
- **Icons** - [Lucide Icons](https://lucide.dev)
- **Design Inspiration** - Modern e-commerce best practices

---

## 📧 Contact

For questions or feedback, feel free to reach out or open an issue on GitHub.

---

**Happy Coding! 🎉**
