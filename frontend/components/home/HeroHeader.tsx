"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Menu, X, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

export const HeroHeader = ({ setPanel }: { setPanel?: (v: any) => void }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 20);
    });

    const handleNavClick = (key: string) => {
        setMobileMenuOpen(false);
        if (setPanel) {
            setPanel(key);
        }
    };

    const navLinks = [
        { name: "Features", key: "features" },
        { name: "For Agencies", key: "agencies" },
        { name: "Pricing", key: "pricing" },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#050505]/80 backdrop-blur-md border-b border-white/5 py-3" : "bg-transparent py-5"
                }`}
        >
            <div className="container mx-auto px-6 h-10 flex items-center justify-between">

                {/* Logo Area */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center text-black font-bold text-xl group-hover:scale-105 transition-transform">
                            A
                        </div>
                        <span className="text-white font-bold text-lg tracking-tight">AI Scout</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <button
                                key={link.name}
                                onClick={() => handleNavClick(link.key)}
                                className="text-sm font-medium text-slate-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
                            >
                                {link.name}
                            </button>
                        ))}
                        <Link
                            href="/contact"
                            className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                        >
                            Contact
                        </Link>
                    </nav>
                </div>

                {/* Right Actions */}
                <div className="hidden lg:flex items-center gap-4">
                    <Link
                        href="/login"
                        className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                    >
                        Log In
                    </Link>
                    <Button
                        asChild
                        size="sm"
                        className="bg-white/10 hover:bg-white/20 text-white border-none rounded-full px-4 h-9 font-medium backdrop-blur-sm"
                    >
                        <Link href="/signup">
                            Start Free
                        </Link>
                    </Button>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="lg:hidden text-white"
                    onClick={() => setMobileMenuOpen(true)}
                >
                    <Menu />
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-50 bg-[#0A0A0A] flex flex-col p-6"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <span className="text-xl font-bold text-white">Menu</span>
                            <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>
                        <nav className="flex flex-col gap-6 text-lg">
                            {navLinks.map((link) => (
                                <button
                                    key={link.name}
                                    onClick={() => handleNavClick(link.key)}
                                    className="text-slate-300 hover:text-cyan-400 font-medium text-left"
                                >
                                    {link.name}
                                </button>
                            ))}
                            <Link
                                href="/contact"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-slate-300 hover:text-cyan-400 font-medium text-left"
                            >
                                Contact
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};
