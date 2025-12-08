"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowRight, CheckCircle2, X, Loader2 } from "lucide-react";
import { Logo } from "@/components/logo";
import { verifyEmail } from "@/lib/api";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    
    const [loading, setLoading] = useState(!!token);
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState("");

    async function handleVerify() {
        if (!token) {
            setError("No verification token provided");
            setLoading(false);
            return;
        }

        try {
            const response = await verifyEmail(token);
            setVerified(true);
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (err: any) {
            setError(err.message || "Verification failed. The link may be invalid or expired.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (token) {
            handleVerify();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    if (verified) {
        return (
            <div className="relative h-screen bg-[#000000] text-white overflow-hidden selection:bg-cyan-500/30">
                {/* Technical Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />

                {/* Ambient Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

                {/* Header */}
                <header className="relative z-10 pt-6 pb-2 shrink-0">
                    <div className="container mx-auto px-6 flex items-center justify-between">
                        <Link href="/" className="group">
                            <Logo size="default" className="group" />
                        </Link>
                    </div>
                </header>

                {/* Main Content */}
                <main className="relative z-10 flex items-center justify-center h-[calc(100vh-100px)] px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-md"
                    >
                        <div className="relative bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 shadow-2xl text-center">
                            {/* Success Icon */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20"
                            >
                                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                            </motion.div>

                            <h1 className="text-2xl font-bold text-white mb-2">Email Verified!</h1>

                            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                                Your email has been successfully verified. Redirecting to login...
                            </p>

                            <Link href="/login">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full h-10 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all flex items-center justify-center gap-2"
                                >
                                    Go to Login
                                    <ArrowRight className="w-4 h-4" />
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                </main>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="relative h-screen bg-[#000000] text-white overflow-hidden selection:bg-cyan-500/30">
                {/* Technical Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />

                {/* Ambient Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

                {/* Header */}
                <header className="relative z-10 pt-6 pb-2 shrink-0">
                    <div className="container mx-auto px-6 flex items-center justify-between">
                        <Link href="/" className="group">
                            <Logo size="default" className="group" />
                        </Link>
                    </div>
                </header>

                {/* Main Content */}
                <main className="relative z-10 flex items-center justify-center h-[calc(100vh-100px)] px-4">
                    <div className="w-full max-w-md text-center">
                        <div className="relative bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 shadow-2xl">
                            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-4" />
                            <p className="text-slate-400 text-sm">Verifying your email...</p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="relative h-screen bg-[#000000] text-white overflow-hidden selection:bg-cyan-500/30">
            {/* Technical Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />

            {/* Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Header */}
            <header className="relative z-10 pt-6 pb-2 shrink-0">
                <div className="container mx-auto px-6 flex items-center justify-between">
                    <Link href="/" className="group">
                        <Logo size="default" className="group" />
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex items-center justify-center h-[calc(100vh-100px)] px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md"
                >
                    <div className="relative bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 shadow-2xl text-center">
                        {error ? (
                            <>
                                {/* Error Icon */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
                                    className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20"
                                >
                                    <X className="w-8 h-8 text-red-400" />
                                </motion.div>

                                <h1 className="text-2xl font-bold text-white mb-2">Verification Failed</h1>

                                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                                    {error}
                                </p>

                                <Link href="/login">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full h-10 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all flex items-center justify-center gap-2"
                                    >
                                        Go to Login
                                        <ArrowRight className="w-4 h-4" />
                                    </motion.button>
                                </Link>
                            </>
                        ) : (
                            <>
                                {/* Icon */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
                                    className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyan-500/20"
                                >
                                    <Mail className="w-8 h-8 text-cyan-400" />
                                </motion.div>

                                <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>

                                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                                    We've sent a verification link to <br />
                                    <span className="font-semibold text-white">{email || "your email address"}</span>
                                </p>

                                <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-400 mb-8">
                                    Click the link in the email to activate your account and start your free trial.
                                </div>

                                <Link href="/login">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full h-10 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all flex items-center justify-center gap-2"
                                    >
                                        Proceed to Login
                                        <ArrowRight className="w-4 h-4" />
                                    </motion.button>
                                </Link>

                                <p className="mt-6 text-xs text-slate-500">
                                    Didn't receive it? <button className="text-cyan-400 hover:text-cyan-300 transition-colors">Resend email</button>
                                </p>
                            </>
                        )}
                    </div>
                </motion.div>
            </main>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="relative h-screen bg-[#000000] text-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}
