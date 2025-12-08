"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo";
import { Mail, Lock, Building2, User, ArrowRight, Loader2, Check, X, CreditCard, Info } from "lucide-react";
import { getOrCreateDeviceFingerprint } from "@/lib/deviceFingerprint";
import { signup } from "@/lib/api";
import StripeElementsWrapper from "@/components/payment/StripeElements";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deviceFingerprint, setDeviceFingerprint] = useState<string>("");
  
  useEffect(() => {
    // Generate device fingerprint on mount
    setDeviceFingerprint(getOrCreateDeviceFingerprint());
  }, []);
  
  const [formData, setFormData] = useState({
    agencyName: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;
    setPasswordStrength(strength);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.agencyName.trim()) {
      newErrors.agencyName = "Agency name is required";
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Payment validation - check if payment method is ready
    if (!paymentMethodId) {
      newErrors.payment = "Please enter your card details";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({ submit: "" });

    if (!paymentMethodId) {
      setErrors({ submit: "Please enter your card details" });
      setLoading(false);
      return;
    }

    try {
      const data = await signup({
        email: formData.email,
        agency_name: formData.agencyName,
        full_name: formData.fullName,
        password: formData.password,
        payment_method_id: paymentMethodId,
        device_fingerprint: deviceFingerprint,
      });

      if (data.success) {
        if (data.requires_email_verification) {
          // Redirect to verification page
          router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
        } else {
          router.push("/dashboard");
        }
      } else {
        throw new Error(data.message || "Signup failed");
      }
    } catch (error: any) {
      setErrors({ submit: error.message || "An error occurred. Please try again." });
      setLoading(false);
    }
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return "bg-slate-700";
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength === 3) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength === 3) return "Medium";
    return "Strong";
  };

  const handlePaymentMethodReady = (pmId: string) => {
    setPaymentMethodId(pmId);
    setPaymentError("");
    if (errors.payment) {
      setErrors({ ...errors, payment: "" });
    }
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
    setPaymentMethodId(null);
    setErrors({ ...errors, payment: error });
  };

  return (
    <div className="relative h-screen bg-[#000000] text-white overflow-hidden selection:bg-cyan-500/30">
      {/* Technical Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />

      {/* Ambient Cyan Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 pt-2 pb-1 shrink-0">
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link href="/" className="group">
            <Logo size="default" className="group" />
          </Link>
          <Link
            href="/"
            className="text-xs sm:text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center h-[calc(100vh-60px)] px-4 sm:px-6 py-1 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md h-full flex items-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative w-full h-full flex items-center"
          >
            {/* Card Glow Effect */}
            <div className="absolute -inset-0.5 bg-cyan-500/20 rounded-2xl blur-xl opacity-50" />

            {/* Signup Card */}
            <div className="relative bg-[#0A0A0A] border border-white/10 rounded-2xl p-2.5 sm:p-3 md:p-4 shadow-2xl w-full h-full flex flex-col overflow-hidden">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center mb-1.5 sm:mb-2 shrink-0"
              >
                <h1 className="text-base sm:text-lg md:text-xl font-bold text-white mb-0.5">Start Your 7 Day Free Trial</h1>
                <p className="text-slate-400 text-[8px] sm:text-[9px] md:text-[10px]">
                  Create your agency account and get started in seconds
                </p>
              </motion.div>

              {/* Free Trial Info Box */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="mb-1.5 sm:mb-2 p-1 sm:p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 shrink-0"
              >
                <div className="flex items-start gap-1">
                  <Info className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-400 mt-0.5 shrink-0" />
                  <div className="text-[7px] sm:text-[8px] md:text-[9px] text-slate-300 leading-tight">
                    <p className="font-semibold text-cyan-400 mb-0.5">How the free trial works:</p>
                    <ul className="list-disc list-inside space-y-0 text-slate-400">
                      <li>7 days of full access, no charge</li>
                      <li>Payment method required to start</li>
                      <li>After 7 days, you&apos;ll be charged $449/month</li>
                      <li>Cancel anytime during the trial, no charges</li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex-1 min-h-0 flex flex-col space-y-1 sm:space-y-1.5 overflow-y-auto">
                {/* Agency Name & Full Name - Side by Side */}
                <div className="grid grid-cols-2 gap-1 sm:gap-1.5">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="space-y-0.5"
                  >
                    <label className="text-[8px] sm:text-[9px] font-medium text-slate-300 flex items-center gap-0.5">
                      <Building2 className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-cyan-400" />
                      Agency
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.agencyName}
                      onChange={(e) => {
                        setFormData({ ...formData, agencyName: e.target.value });
                        if (errors.agencyName) setErrors({ ...errors, agencyName: "" });
                      }}
                      placeholder="Agency Name"
                      className={`w-full h-7 sm:h-8 rounded-lg border px-2 text-[9px] sm:text-[10px] text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all ${
                        errors.agencyName
                          ? "border-red-500/50 bg-red-500/5"
                          : "border-white/10 bg-white/5"
                      }`}
                    />
                    {errors.agencyName && (
                      <p className="text-[7px] sm:text-[8px] text-red-400 flex items-center gap-0.5">
                        <X className="w-1.5 h-1.5" />
                        {errors.agencyName}
                      </p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.35 }}
                    className="space-y-0.5"
                  >
                    <label className="text-[8px] sm:text-[9px] font-medium text-slate-300 flex items-center gap-0.5">
                      <User className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-cyan-400" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => {
                        setFormData({ ...formData, fullName: e.target.value });
                        if (errors.fullName) setErrors({ ...errors, fullName: "" });
                      }}
                      placeholder="Your Name"
                      className={`w-full h-7 sm:h-8 rounded-lg border px-2 text-[9px] sm:text-[10px] text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all ${
                        errors.fullName
                          ? "border-red-500/50 bg-red-500/5"
                          : "border-white/10 bg-white/5"
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-[7px] sm:text-[8px] text-red-400 flex items-center gap-0.5">
                        <X className="w-1.5 h-1.5" />
                        {errors.fullName}
                      </p>
                    )}
                  </motion.div>
                </div>

                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="space-y-0.5"
                >
                  <label className="text-[8px] sm:text-[9px] font-medium text-slate-300 flex items-center gap-0.5">
                    <Mail className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-cyan-400" />
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    placeholder="your@email.com"
                    className={`w-full h-7 sm:h-8 rounded-lg border px-2 text-[9px] sm:text-[10px] text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all ${
                      errors.email
                        ? "border-red-500/50 bg-red-500/5"
                        : "border-white/10 bg-white/5"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-[7px] sm:text-[8px] text-red-400 flex items-center gap-0.5">
                      <X className="w-1.5 h-1.5" />
                      {errors.email}
                    </p>
                  )}
                </motion.div>

                {/* Password Fields - Side by Side */}
                <div className="grid grid-cols-2 gap-1 sm:gap-1.5">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.45 }}
                    className="space-y-0.5"
                  >
                    <label className="text-[8px] sm:text-[9px] font-medium text-slate-300 flex items-center gap-0.5">
                      <Lock className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-cyan-400" />
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        checkPasswordStrength(e.target.value);
                        if (errors.password) setErrors({ ...errors, password: "" });
                      }}
                      placeholder="Password"
                      className={`w-full h-7 sm:h-8 rounded-lg border px-2 text-[9px] sm:text-[10px] text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all ${
                        errors.password
                          ? "border-red-500/50 bg-red-500/5"
                          : "border-white/10 bg-white/5"
                      }`}
                    />
                    {formData.password && (
                      <div className="h-0.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                          style={{ width: `${(passwordStrength / 4) * 100}%` }}
                        />
                      </div>
                    )}
                    {errors.password && (
                      <p className="text-[7px] sm:text-[8px] text-red-400 flex items-center gap-0.5">
                        <X className="w-1.5 h-1.5" />
                        {errors.password}
                      </p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="space-y-0.5"
                  >
                    <label className="text-[8px] sm:text-[9px] font-medium text-slate-300 flex items-center gap-0.5">
                      <Lock className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-cyan-400" />
                      Confirm
                    </label>
                    <input
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => {
                        setFormData({ ...formData, confirmPassword: e.target.value });
                        if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" });
                      }}
                      placeholder="Confirm"
                      className={`w-full h-7 sm:h-8 rounded-lg border px-2 text-[9px] sm:text-[10px] text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all ${
                        errors.confirmPassword
                          ? "border-red-500/50 bg-red-500/5"
                          : formData.confirmPassword && formData.password === formData.confirmPassword
                          ? "border-emerald-500/50 bg-emerald-500/5"
                          : "border-white/10 bg-white/5"
                      }`}
                    />
                    {formData.confirmPassword && formData.password === formData.confirmPassword && !errors.confirmPassword && (
                      <p className="text-[7px] sm:text-[8px] text-emerald-400 flex items-center gap-0.5">
                        <Check className="w-1.5 h-1.5" />
                        Match
                      </p>
                    )}
                    {errors.confirmPassword && (
                      <p className="text-[7px] sm:text-[8px] text-red-400 flex items-center gap-0.5">
                        <X className="w-1.5 h-1.5" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </motion.div>
                </div>

                {/* Payment Section - Stripe Elements */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.55 }}
                  className="pt-1 border-t border-white/10"
                >
                  <div className="flex items-center gap-1 mb-1 sm:mb-1.5">
                    <CreditCard className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-400" />
                    <label className="text-[8px] sm:text-[9px] font-semibold text-slate-300">Payment Method</label>
                  </div>

                  <StripeElementsWrapper
                    onPaymentMethodReady={handlePaymentMethodReady}
                    onError={handlePaymentError}
                    disabled={loading}
                  />

                  {errors.payment && (
                    <p className="text-[7px] sm:text-[8px] text-red-400 mt-1 flex items-center gap-0.5">
                      <X className="w-1.5 h-1.5" />
                      {errors.payment}
                    </p>
                  )}

                  {paymentMethodId && !paymentError && (
                    <p className="text-[7px] sm:text-[8px] text-emerald-400 mt-1 flex items-center gap-0.5">
                      <Check className="w-1.5 h-1.5" />
                      Card details verified
                    </p>
                  )}
                </motion.div>

                {/* Error Message */}
                {errors.submit && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-1 sm:p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 shrink-0"
                  >
                    <p className="text-[8px] sm:text-[9px] text-red-400 flex items-center gap-0.5">
                      <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      {errors.submit}
                    </p>
                  </motion.div>
                )}

                {/* Terms & Privacy */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.55 }}
                  className="text-[7px] sm:text-[8px] text-slate-400 pt-0.5 shrink-0"
                >
                  By signing up, you agree to our{" "}
                  <Link href="/terms" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                    Privacy Policy
                  </Link>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full h-7 sm:h-8 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-[9px] sm:text-[10px] shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-1 mt-1 sm:mt-1.5 shrink-0"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Start 7 Day Free Trial
                      <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Divider */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="relative my-1 sm:my-1.5 shrink-0"
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-[7px] sm:text-[8px] uppercase">
                  <span className="bg-[#0A0A0A] px-2 text-slate-500">Or</span>
                </div>
              </motion.div>

              {/* Login Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="text-center shrink-0 pb-0.5"
              >
                <p className="text-[8px] sm:text-[9px] text-slate-400">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                  >
                    Sign In
                  </Link>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

