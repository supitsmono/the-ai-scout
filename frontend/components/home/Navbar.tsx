
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PanelKey, CTA } from "./Shared";
import { ReactNode } from "react";

export default function Navbar({ setPanel }: { setPanel: (v: PanelKey | null) => void }) {
    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
        >
            <Link href="/" className="flex items-center gap-2 group">
                <motion.div
                    className="bg-white/5 border border-white/10 rounded-xl h-9 w-9 flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400 }}
                >
                    <span className="text-xs font-bold text-white">AI</span>
                </motion.div>
                <div className="leading-tight">
                    <p className="text-sm font-bold tracking-tight">The AI Scout</p>
                    <p className="text-[10px] text-slate-400">Intake OS for agencies</p>
                </div>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-xs text-slate-300">
                <NavButton onClick={() => setPanel("how")}>How it works</NavButton>
                <NavButton onClick={() => setPanel("agencies")}>For agencies</NavButton>
                <NavButton onClick={() => setPanel("pricing")}>Pricing</NavButton>
            </nav>

            <div className="flex items-center gap-3">
                <Link
                    href="/login"
                    className="hidden md:inline text-xs text-slate-300 hover:text-white transition-colors"
                >
                    Log in
                </Link>
                <CTA href="/signup">Start free trial</CTA>
            </div>
        </motion.header>
    );
}

function NavButton({
    children,
    onClick,
}: {
    children: ReactNode;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="hover:text-white transition-colors relative group"
        >
            {children}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300" />
        </button>
    );
}
