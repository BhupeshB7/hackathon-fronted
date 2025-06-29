import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Lock,
  LogIn,
  MailPlus,
  Send,
  Text,
  User,
  CheckCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { loginWithGoogle, sendOTP, verifyOTP } from "@/api";
import { GoogleLogin } from "@react-oauth/google";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [googleError, setGoogleError] = useState(null);
  const [otpVerified, setOtpVerified] = useState(false);
  const { register, fetchUserProfile } = useAuth();
  const navigate = useNavigate();

  // Persist OTP Verified State Across Refresh (for same email)
  useEffect(() => {
    const verifiedEmail = localStorage.getItem("otpVerifiedEmail");
    if (verifiedEmail && verifiedEmail === email) {
      setOtpVerified(true);
      setOtpSent(true);
    }
  }, [email]);

  const handleSendOtp = async () => {
    if (!email) return toast.error("Enter your email first.");
    try {
      const res = await sendOTP(email);
      if (res.status === 200) {
        toast.success("OTP sent to email.");
        setOtpSent(true);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error?.message ||
          "Something went wrong. Please try again."
      );
      setOtpSent(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      toast.error("Enter valid OTP");
      return;
    }
    try {
      setVerifyingOtp(true);
      const res = await verifyOTP(email, otp);
      if (res.status === 200) {
        toast.success("OTP Verified");
        setOtpVerified(true);
        localStorage.setItem("otpVerifiedEmail", email); // save to localStorage
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.error ||
          "Something went wrong. Please try again."
      );
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password)
      return toast.error("Please enter all details");
    if (password.length < 6)
      return toast.error("Password should be at least 6 characters long");
    if (!otpVerified)
      return toast.error("Please verify your email with OTP first");

    try {
      setIsLoading(true);
      const result = await register({ name, email, password });
      if (result.success) {
        toast.success("Registered successfully");
        localStorage.removeItem("otpVerifiedEmail"); // optional cleanup
        navigate("/");
      }
    } catch (err) {
      toast.error("Register failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md px-6 py-8 rounded-xl shadow-lg border bg-white dark:bg-gray-900">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white mb-4">
              <User size={28} />
            </div>
            <h2 className="text-2xl font-bold">Welcome </h2>
            <p className="opacity-70 text-sm">
              Create an account to store your files!
            </p>
          </div>

          {/* Name */}
          <div>
            <label className="flex items-center text-sm font-medium mb-1">
              <Text className="mr-2" size={14} /> Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full px-4 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-primary transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          {/* Email + Send OTP */}
          <div className="relative">
            <label className="flex items-center text-sm font-medium mb-1">
              <MailPlus className="mr-2" size={14} /> Email Address
            </label>
            <input
              type="email"
              placeholder="email@example.com"
              className="w-full px-4 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-primary transition"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setOtpVerified(false);
                localStorage.removeItem("otpVerifiedEmail");
              }}
              disabled={isLoading}
              required
            />
            <button
              type="button"
              onClick={handleSendOtp}
              className="absolute right-3 top-7.5 flex items-center gap-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition"
            >
              {otpVerified ? (
                "✅ OTP Verified"
              ) : (
                <>
                  <Send size={14} /> Send OTP
                </>
              )}
            </button>
          </div>

          {/* OTP input (only show if not verified) */}
          {otpSent && !otpVerified && (
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Enter OTP"
                className="flex-1 px-4 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-primary transition"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={verifyingOtp}
                className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-md flex items-center gap-1"
              >
                {verifyingOtp ? (
                  <svg
                    className="w-4 h-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="white"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="white"
                      d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4zm2 5.29A7.96 7.96 0 014 12H0c0 3.04 1.13 5.82 3 7.94l3-2.65z"
                    />
                  </svg>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    Verify
                  </>
                )}
              </button>
            </div>
          )}
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            ⏳ OTP delivery may take up to a minute or more,because 
            server is not fully established .
            <br />
            👉 For faster access, consider using{" "}
            <span className="text-blue-600 font-medium">Google Login</span>.
          </p>
          {/* Password */}
          <div className="relative">
            <label className="flex items-center text-sm font-medium mb-1">
              <Lock className="mr-2" size={14} /> Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-primary transition pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-7.5 text-gray-500 dark:text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 text-white font-medium rounded-lg shadow-md transition-all flex items-center justify-center"
          >
            {isLoading ? (
              <svg
                className="animate-spin h-4 w-4 mr-2"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="white"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="white"
                  d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4zm2 5.29A7.96 7.96 0 014 12H0c0 3.04 1.13 5.82 3 7.94l3-2.65z"
                />
              </svg>
            ) : (
              <LogIn className="mr-2" size={14} />
            )}
            {isLoading ? "Signing In..." : "Sign In"}
          </button>

          {/* OR */}
          <div className="flex items-center my-4">
            <span className="flex-grow h-px bg-gray-300 dark:bg-gray-600"></span>
            <span className="mx-4 text-sm text-gray-500">OR</span>
            <span className="flex-grow h-px bg-gray-300 dark:bg-gray-600"></span>
          </div>

          {/* Social Login */}
          <div className="flex justify-center items-center gap-2">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const data = await loginWithGoogle(
                    credentialResponse.credential
                  );
                  await fetchUserProfile();
                  if (data.error) setGoogleError(data.error);
                  else navigate("/", { replace: true });
                } catch (error) {
                  setGoogleError(error.message);
                }
              }}
              onError={() => {
                setGoogleError("Login Failed");
              }}
              useOneTap
            />
          </div>

          {googleError && (
            <p className="text-sm text-red-500 mt-2">{googleError}</p>
          )}
        </form>

        <div className="mt-6 text-sm text-gray-600 dark:text-gray-300 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary font-medium hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
