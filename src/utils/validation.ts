export const validateCardNumber = (
  cardNumber: string,
): { valid: boolean; error?: string } => {
  const cleaned = cardNumber.replace(/\s/g, "");
  if (!/^\d{16}$/.test(cleaned)) {
    return { valid: false, error: "Card number must be 16 digits" };
  }
  if (!luhnCheck(cleaned)) {
    return { valid: false, error: "Invalid card number" };
  }
  return { valid: true };
};

const luhnCheck = (val: string): boolean => {
  let sum = 0;
  let shouldDouble = false;

  for (let i = val.length - 1; i >= 0; i--) {
    let digit = parseInt(val.charAt(i), 10);

    if (shouldDouble) {
      if ((digit *= 2) > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

export const validateExpiryDate = (
  expiry: string,
): { valid: boolean; error?: string } => {
  const [month, year] = expiry.split("/");
  if (!/^\d{2}\/\d{2}$/.test(expiry)) {
    return { valid: false, error: "Use format MM/YY" };
  }

  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(`20${year}`, 10);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (monthNum < 1 || monthNum > 12) {
    return { valid: false, error: "Invalid month" };
  }
  if (yearNum < currentYear) {
    return { valid: false, error: "Card has expired" };
  }
  if (yearNum === currentYear && monthNum < currentMonth) {
    return { valid: false, error: "Card has expired" };
  }

  return { valid: true };
};

export const validateCVV = (
  cvv: string,
): { valid: boolean; error?: string } => {
  if (!/^\d{3,4}$/.test(cvv)) {
    return { valid: false, error: "CVV must be 3 or 4 digits" };
  }
  return { valid: true };
};

export const formatCardNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");
  const chunks = cleaned.match(/.{1,4}/g) || [];
  return chunks.join(" ").substr(0, 19);
};

export const formatExpiryDate = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length >= 2) {
    return `${cleaned.substr(0, 2)}/${cleaned.substr(2, 2)}`;
  }
  return cleaned;
};

export const validateEmail = (
  email: string,
): { valid: boolean; error?: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return { valid: false, error: "Email is required" };
  }
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Please enter a valid email address" };
  }
  return { valid: true };
};

export const validatePassword = (
  password: string,
): { valid: boolean; error?: string } => {
  if (!password) {
    return { valid: false, error: "Password is required" };
  }
  if (password.length < 6) {
    return { valid: false, error: "Password must be at least 6 characters" };
  }
  return { valid: true };
};

export const validateUsername = (
  username: string,
): { valid: boolean; error?: string } => {
  if (!username) {
    return { valid: false, error: "Username is required" };
  }
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return {
      valid: false,
      error: "Username can only contain letters, numbers, and underscores",
    };
  }
  if (username.length < 3) {
    return { valid: false, error: "Username must be at least 3 characters" };
  }
  return { valid: true };
};

export const validateRequired = (
  value: string,
  fieldName: string,
): { valid: boolean; error?: string } => {
  if (!value.trim()) {
    return { valid: false, error: `${fieldName} is required` };
  }
  return { valid: true };
};
