import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { ExtendedUser } from "../types";
import { useToast } from "./ToastContext";

interface AuthContextType {
  user: ExtendedUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
    secretKey: string,
  ) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  error: string | null;
  updateProfile: (data: Partial<ExtendedUser>) => Promise<void>;
}

type AuthError =
  | "EMAIL_TAKEN"
  | "USERNAME_TAKEN"
  | "INVALID_CREDENTIALS"
  | "NETWORK_ERROR"
  | "SESSION_EXPIRED"
  | "SECRET_KEY_INVALID"
  | "UNKNOWN";

const ERROR_MESSAGES: Record<AuthError, string> = {
  EMAIL_TAKEN:
    "This email is already registered. Please use a different email or username.",
  USERNAME_TAKEN:
    "This username is already taken. Please choose a different username.",
  INVALID_CREDENTIALS: "Invalid email or password. Please try again.",
  NETWORK_ERROR: "Unable to connect. Please check your internet connection.",
  SESSION_EXPIRED: "Your session has expired. Please log in again.",
  SECRET_KEY_INVALID: "Secret key is not valid. Registration not allowed.",
  UNKNOWN: "An unexpected error occurred. Please try again.",
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = "apex_shoes_auth_token";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1337/api";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showError } = useToast();

  const parseAuthError = (errorMessage: string): AuthError => {
    const lowerMessage = errorMessage.toLowerCase();
    if (
      lowerMessage.includes("secret_key_invalid") ||
      lowerMessage.includes("secretkey") ||
      lowerMessage.includes("secret key")
    ) {
      return "SECRET_KEY_INVALID";
    }
    if (
      lowerMessage.includes("email") ||
      lowerMessage.includes("already used") ||
      lowerMessage.includes("duplicate")
    ) {
      return "EMAIL_TAKEN";
    }
    if (
      lowerMessage.includes("username") ||
      lowerMessage.includes("username")
    ) {
      return "USERNAME_TAKEN";
    }
    if (
      lowerMessage.includes("invalid") ||
      lowerMessage.includes("credential") ||
      lowerMessage.includes("password")
    ) {
      return "INVALID_CREDENTIALS";
    }
    if (
      lowerMessage.includes("network") ||
      lowerMessage.includes("fetch") ||
      lowerMessage.includes("connection")
    ) {
      return "NETWORK_ERROR";
    }
    return "UNKNOWN";
  };

  const getUserFriendlyError = (rawError: string): string => {
    const errorType = parseAuthError(rawError);
    return ERROR_MESSAGES[errorType];
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      if (storedToken) {
        try {
          setToken(storedToken);
          const response = await fetch(`${API_URL}/users/me`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            localStorage.removeItem(AUTH_TOKEN_KEY);
            setToken(null);
            if (response.status === 401) {
              showError("Your session has expired. Please log in again.");
            }
          }
        } catch {
          localStorage.removeItem(AUTH_TOKEN_KEY);
          setToken(null);
          showError("Unable to restore your session. Please log in again.");
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/auth/local`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const userMessage = getUserFriendlyError(data.error?.message || "");
        setError(userMessage);
        throw new Error(userMessage);
      }

      const { jwt, user: userData } = data;
      localStorage.setItem(AUTH_TOKEN_KEY, jwt);
      setToken(jwt);
      setUser(userData);
    } catch (err) {
      if (!(err instanceof Error && err.message in ERROR_MESSAGES)) {
        const message = err instanceof Error ? err.message : "Login failed";
        const userMessage = getUserFriendlyError(message);
        setError(userMessage);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    secretKey: string,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/auth/local/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, secretKey }),
      });

      const data = await response.json();

      if (!response.ok) {
        const userMessage = getUserFriendlyError(data.error?.message || "");
        setError(userMessage);
        throw new Error(userMessage);
      }

      const { jwt, user: userData } = data;
      localStorage.setItem(AUTH_TOKEN_KEY, jwt);
      setToken(jwt);
      setUser(userData);
    } catch (err) {
      if (!(err instanceof Error && err.message in ERROR_MESSAGES)) {
        const message =
          err instanceof Error ? err.message : "Registration failed";
        const userMessage = getUserFriendlyError(message);
        setError(userMessage);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setUser(null);
    setToken(null);
  };

  const clearError = () => {
    setError(null);
  };

  const updateProfile = async (data: Partial<ExtendedUser>) => {
    if (!user || !token) {
      throw new Error("Not authenticated");
    }

    try {
      const response = await fetch(`${API_URL}/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error?.message || "Update failed");
      }

      setUser(responseData);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Update failed";
      setError(message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        clearError,
        error,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
