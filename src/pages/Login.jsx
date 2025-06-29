import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Eye, EyeOff, Lock, LogIn, MailPlus, User } from "lucide-react";
import { loginWithGoogle } from "@/api";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("b29.bhupesh@gmail.com");
  const [password, setPassword] = useState("12345678");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, fetchUserProfile } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await login({ email, password });
    console.log("user result", result);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md px-6 py-8 rounded-xl shadow-lg border bg-white dark:bg-gray-900">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white mb-4">
              <User size={28} />
            </div>
            <h2 className="text-2xl font-bold">Welcome Back</h2>
            <p className="opacity-70 text-sm">Sign in to your Drive account</p>
          </div>
          <div className="mb-4 text-sm text-yellow-600 bg-yellow-50 border border-yellow-200 rounded p-3 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-800">
            ⚠️ <strong>Note:</strong> This email/password is provided only for
            testing the App feature.
            <br />
            We highly recommend creating your own account for a better and
            personalized experience.
          </div>
          <div>
            <label
              className="flex items-center text-sm font-medium mb-1"
              htmlFor="email"
            >
              <MailPlus className="mr-2" size={14} /> Email Address
            </label>
            <input
              type="email"
              placeholder="email@example.com"
              className="w-full px-4 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-primary transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="relative">
            <label
              className="flex items-center text-sm font-medium mb-1"
              htmlFor="password"
            >
              <Lock className="mr-2" size={14} /> Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-primary transition pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-7.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all flex items-center justify-center mt-2"
          >
            {isLoading ? (
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <LogIn className="mr-2" />
            )}
            {isLoading ? "Signing In..." : "Sign In"}
          </button>

          <div className="flex items-center my-4">
            <span className="flex-grow h-px bg-gray-300 dark:bg-gray-600"></span>
            <span className="mx-4 text-sm text-gray-500">OR</span>
            <span className="flex-grow h-px bg-gray-300 dark:bg-gray-600"></span>
          </div>

          <div className="flex justify-center items-center gap-2">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const data = await loginWithGoogle(
                    credentialResponse.credential
                  );
                  if (data.error) {
                    toast.error(data.error);
                  } else {
                    await fetchUserProfile();
                    toast.success("Logged in successfully.");
                    navigate("/", { replace: true });
                  }
                } catch (error) {
                  console.log(error);
                  toast.error("Google login failed. Please try again.");
                }
              }}
              onError={() => {
                toast.error("Google login failed.");
              }}
              useOneTap={true}
            />
          </div>
        </form>

        <div className="mt-6 text-sm flex justify-between items-center text-gray-600 dark:text-gray-300">
          <Link to="/forgot-password" className="hover:underline">
            Forgot password?
          </Link>
          <span>
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
