"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo";
import { Mail, Lock, Building2, User, ArrowRight, Loader2, Check, X, CreditCard, Info } from "lucide-react";
import { getOrCreateDeviceFingerprint } from "@/lib/deviceFingerprint";

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
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });
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

    // Payment validation
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = "Card number is required";
    } else if (!/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
      newErrors.cardNumber = "Invalid card number";
    }

    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = "Expiry date is required";
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = "Invalid format (MM/YY)";
    }

    if (!formData.cvv.trim()) {
      newErrors.cvv = "CVV is required";
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = "Invalid CVV";
    }

    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = "Cardholder name is required";
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

    try {
      // Call backend signup endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          agency_name: formData.agencyName,
          full_name: formData.fullName,
          password: formData.password,
          card_number: formData.cardNumber.replace(/\s/g, ""),
          expiry_date: formData.expiryDate,
          cvv: formData.cvv,
          cardholder_name: formData.cardholderName,
          device_fingerprint: deviceFingerprint,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.message || "Signup failed");
      }

      if (data.requires_email_verification) {
        // Redirect to verification page or show message
        router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
      } else {
        router.push("/dashboard");
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

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  // Format expiry date as MM/YY
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="relative min-h-screen bg-[#000000] text-white overflow-hidden selection:bg-cyan-500/30">
      {/* Technical Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />

      {/* Ambient Cyan Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 pt-8 pb-4">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="group">
            <Logo size="default" className="group" />
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            {/* Card Glow Effect */}
            <div className="absolute -inset-0.5 bg-cyan-500/20 rounded-2xl blur-xl opacity-50" />

            {/* Signup Card */}
            <div className="relative bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 shadow-2xl">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center mb-6"
              >
                <h1 className="text-2xl font-bold text-white mb-1">Start Your 7 Day Free Trial</h1>
                <p className="text-slate-400 text-xs">
                  Create your agency account and get started in seconds
                </p>
              </motion.div>

              {/* Free Trial Info Box */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="mb-4 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20"
              >
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  <div className="text-[10px] text-slate-300 leading-relaxed">
                    <p className="font-semibold text-cyan-400 mb-1">How the free trial works:</p>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-400">
                      <li>7 days of full access, no charge</li>
                      <li>Payment method required to start</li>
                      <li>After 7 days, you&apos;ll be charged $449/month</li>
                      <li>Cancel anytime during the trial, no charges</li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Agency Name & Full Name - Side by Side */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="space-y-1.5"
                  >
                    <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-cyan-400" />
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
                      className={`w-full h-10 rounded-xl border px-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all ${
                        errors.agencyName
                          ? "border-red-500/50 bg-red-500/5"
                          : "border-white/10 bg-white/5"
                      }`}
                    />
                    {errors.agencyName && (
                      <p className="text-[10px] text-red-400 flex items-center gap-1">
                        <X className="w-2.5 h-2.5" />
                        {errors.agencyName}
                      </p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.35 }}
                    className="space-y-1.5"
                  >
                    <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-cyan-400" />
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
                      className={`w-full h-10 rounded-xl border px-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all ${
                        errors.fullName
                          ? "border-red-500/50 bg-red-500/5"
                          : "border-white/10 bg-white/5"
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-[10px] text-red-400 flex items-center gap-1">
                        <X className="w-2.5 h-2.5" />
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
                  className="space-y-1.5"
                >
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
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
                    className={`w-full h-10 rounded-xl border px-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all ${
                      errors.email
                        ? "border-red-500/50 bg-red-500/5"
                        : "border-white/10 bg-white/5"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-[10px] text-red-400 flex items-center gap-1">
                      <X className="w-2.5 h-2.5" />
                      {errors.email}
                    </p>
                  )}
                </motion.div>

                {/* Password Fields - Side by Side */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.45 }}
                    className="space-y-1.5"
                  >
                    <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-cyan-400" />
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
                      className={`w-full h-10 rounded-xl border px-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all ${
                        errors.password
                          ? "border-red-500/50 bg-red-500/5"
                          : "border-white/10 bg-white/5"
                      }`}
                    />
                    {formData.password && (
                      <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                          style={{ width: `${(passwordStrength / 4) * 100}%` }}
                        />
                      </div>
                    )}
                    {errors.password && (
                      <p className="text-[10px] text-red-400 flex items-center gap-1">
                        <X className="w-2.5 h-2.5" />
                        {errors.password}
                      </p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="space-y-1.5"
                  >
                    <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-cyan-400" />
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
                      className={`w-full h-10 rounded-xl border px-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all ${
                        errors.confirmPassword
                          ? "border-red-500/50 bg-red-500/5"
                          : formData.confirmPassword && formData.password === formData.confirmPassword
                          ? "border-emerald-500/50 bg-emerald-500/5"
                          : "border-white/10 bg-white/5"
                      }`}
                    />
                    {formData.confirmPassword && formData.password === formData.confirmPassword && !errors.confirmPassword && (
                      <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <Check className="w-2.5 h-2.5" />
                        Match
                      </p>
                    )}
                    {errors.confirmPassword && (
                      <p className="text-[10px] text-red-400 flex items-center gap-1">
                        <X className="w-2.5 h-2.5" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </motion.div>
                </div>

                {/* Payment Section */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.55 }}
                  className="pt-2 border-t border-white/10"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard className="w-4 h-4 text-cyan-400" />
                    <label className="text-xs font-semibold text-slate-300">Payment Method</label>
                  </div>

                  {/* Card Number */}
                  <div className="space-y-1.5 mb-3">
                    <label className="text-[10px] font-medium text-slate-400">Card Number</label>
                    <input
                      type="text"
                      required
                      maxLength={19}
                      value={formData.cardNumber}
                      onChange={(e) => {
                        const formatted = formatCardNumber(e.target.value);
                        setFormData({ ...formData, cardNumber: formatted });
                        if (errors.cardNumber) setErrors({ ...errors, cardNumber: "" });
                      }}
                      placeholder="1234 5678 9012 3456"
                      className={`w-full h-10 rounded-xl border px-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all ${
                        errors.cardNumber
                          ? "border-red-500/50 bg-red-500/5"
                          : "border-white/10 bg-white/5"
                      }`}
                    />
                    {errors.cardNumber && (
                      <p className="text-[10px] text-red-400 flex items-center gap-1">
                        <X className="w-2.5 h-2.5" />
                        {errors.cardNumber}
                      </p>
                    )}
                  </div>

                  {/* Cardholder Name */}
                  <div className="space-y-1.5 mb-3">
                    <label className="text-[10px] font-medium text-slate-400">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      value={formData.cardholderName}
                      onChange={(e) => {
                        setFormData({ ...formData, cardholderName: e.target.value });
                        if (errors.cardholderName) setErrors({ ...errors, cardholderName: "" });
                      }}
                      placeholder="John Doe"
                      className={`w-full h-10 rounded-xl border px-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all ${
                        errors.cardholderName
                          ? "border-red-500/50 bg-red-500/5"
                          : "border-white/10 bg-white/5"
                      }`}
                    />
                    {errors.cardholderName && (
                      <p className="text-[10px] text-red-400 flex items-center gap-1">
                        <X className="w-2.5 h-2.5" />
                        {errors.cardholderName}
                      </p>
                    )}
                  </div>

                  {/* Expiry & CVV */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-medium text-slate-400">Expiry Date</label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        value={formData.expiryDate}
                        onChange={(e) => {
                          const formatted = formatExpiryDate(e.target.value);
                          setFormData({ ...formData, expiryDate: formatted });
                          if (errors.expiryDate) setErrors({ ...errors, expiryDate: "" });
                        }}
                        placeholder="MM/YY"
                        className={`w-full h-10 rounded-xl border px-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all ${
                          errors.expiryDate
                            ? "border-red-500/50 bg-red-500/5"
                            : "border-white/10 bg-white/5"
                        }`}
                      />
                      {errors.expiryDate && (
                        <p className="text-[10px] text-red-400 flex items-center gap-1">
                          <X className="w-2.5 h-2.5" />
                          {errors.expiryDate}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-medium text-slate-400">CVV</label>
                      <input
                        type="text"
                        required
                        maxLength={4}
                        value={formData.cvv}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, "");
                          setFormData({ ...formData, cvv: v });
                          if (errors.cvv) setErrors({ ...errors, cvv: "" });
                        }}
                        placeholder="123"
                        className={`w-full h-10 rounded-xl border px-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all ${
                          errors.cvv
                            ? "border-red-500/50 bg-red-500/5"
                            : "border-white/10 bg-white/5"
                        }`}
                      />
                      {errors.cvv && (
                        <p className="text-[10px] text-red-400 flex items-center gap-1">
                          <X className="w-2.5 h-2.5" />
                          {errors.cvv}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Error Message */}
                {errors.submit && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-red-500/10 border border-red-500/20"
                  >
                    <p className="text-xs text-red-400 flex items-center gap-2">
                      <X className="w-3.5 h-3.5" />
                      {errors.submit}
                    </p>
                  </motion.div>
                )}

                {/* Terms & Privacy */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.55 }}
                  className="text-[10px] text-slate-400 pt-1"
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
                  className="w-full h-10 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Start 7 Day Free Trial
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Divider */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="relative my-4"
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-[#0A0A0A] px-2 text-slate-500">Or</span>
                </div>
              </motion.div>

              {/* Login Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="text-center"
              >
                <p className="text-xs text-slate-400">
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

