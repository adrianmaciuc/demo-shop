import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { validateEmail, validatePassword } from "../utils/validation";
import PageTransition from "../components/ui/PageTransition";

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const redirect = searchParams.get("redirect") || "/";
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const formik = useFormik({
    initialValues: {
      identifier: "",
      password: "",
    },
    validate: (values) => {
      const errors: Record<string, string> = {};

      const emailResult = validateEmail(values.identifier);
      if (!values.identifier) {
        errors.identifier = "Email is required";
      } else if (!emailResult.valid) {
        errors.identifier = emailResult.error || "Invalid email address";
      }

      const passwordResult = validatePassword(values.password);
      if (!values.password) {
        errors.password = "Password is required";
      } else if (!passwordResult.valid) {
        errors.password =
          passwordResult.error || "Password must be at least 6 characters";
      }

      return errors;
    },
    onSubmit: async (values) => {
      setLoginError(null);
      clearError();

      try {
        await login(values.identifier, values.password);
        navigate(redirect, { replace: true });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Invalid email or password";
        setLoginError(errorMessage);
      }
    },
  });

  return (
    <PageTransition>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Sign in to your account to continue shopping
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {(loginError || error) && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {loginError || error}
              </div>
            )}

            <form onSubmit={formik.handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="identifier"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  id="identifier"
                  name="identifier"
                  type="email"
                  autoComplete="email"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    formik.touched.identifier && formik.errors.identifier
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-primary focus:border-primary"
                  } focus:outline-none focus:ring-2 transition-colors`}
                  placeholder="you@example.com"
                  value={formik.values.identifier}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.identifier && formik.errors.identifier && (
                  <p className="mt-1 text-sm text-red-500">
                    {formik.errors.identifier}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      formik.touched.password && formik.errors.password
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-primary focus:border-primary"
                    } focus:outline-none focus:ring-2 transition-colors pr-12`}
                    placeholder="Enter your password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {formik.errors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-primary text-white font-medium rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  to={`/register${redirect ? `?redirect=${redirect}` : ""}`}
                  className="text-primary font-medium hover:underline"
                >
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default LoginPage;
