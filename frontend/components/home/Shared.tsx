
import { type ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export type PanelKey = "how" | "agencies" | "pricing";

export const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.5, ease: "easeOut" }
} as const;

export function Badge({ text }: { text: string }) {
    return (
        <span className="text-xs px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 w-fit font-medium">
            {text}
        </span>
    );
}

export function CTA({
    href,
    children,
    large,
}: {
    href: string;
    children: ReactNode;
    large?: boolean;
}) {
    return (
        <Link
            href={href}
            className={`rounded-full bg-white text-slate-900 font-semibold ${large ? "px-8 py-4 text-base" : "px-6 py-2.5 text-sm"
                } hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl inline-block text-center`}
        >
            {children}
        </Link>
    );
}

export function SecondaryCTAButton({
    onClick,
    children,
    small,
}: {
    onClick: () => void;
    children: ReactNode;
    small?: boolean;
}) {
    return (
        <button
            onClick={onClick}
            className={`rounded-full border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-medium transition-all ${small ? "px-4 py-1.5 text-xs" : "px-6 py-2.5 text-sm"
                }`}
        >
            {children}
        </button>
    );
}
