/**
 * Utility Functions for Testing
 * Helpful functions for common test operations
 */

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

export const calculateShippingCost = (subtotal: number): number => {
  if (subtotal >= 100) return 0;
  if (subtotal >= 50) return 5;
  return 10;
};

export const calculateTax = (
  subtotal: number,
  taxRate: number = 0.08
): number => {
  return parseFloat((subtotal * taxRate).toFixed(2));
};

export const calculateTotal = (
  subtotal: number,
  taxRate: number = 0.08
): number => {
  const tax = calculateTax(subtotal, taxRate);
  const shipping = calculateShippingCost(subtotal);
  return parseFloat((subtotal + tax + shipping).toFixed(2));
};

export const isValidShoeSize = (size: number): boolean => {
  const validSizes = [
    6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14,
    14.5, 15,
  ];
  return validSizes.includes(size);
};

export const filterByCategory = (items: any[], category: string): any[] => {
  return items.filter((item) => item.category === category);
};

export const sortByPrice = (
  items: any[],
  order: "asc" | "desc" = "asc"
): any[] => {
  const sorted = [...items].sort((a, b) => a.price - b.price);
  return order === "desc" ? sorted.reverse() : sorted;
};

export const sortByName = (
  items: any[],
  order: "asc" | "desc" = "asc"
): any[] => {
  const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name));
  return order === "desc" ? sorted.reverse() : sorted;
};

export const searchShoes = (items: any[], query: string): any[] => {
  const lowerQuery = query.toLowerCase();
  return items.filter(
    (item) =>
      item.name.toLowerCase().includes(lowerQuery) ||
      item.brand.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery)
  );
};
