"use client";

import { cn } from "@/lib/utils";
import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useState } from "react";
import useMeasure from "react-use-measure";

type InfiniteSliderProps = {
    children: React.ReactNode;
    gap?: number;
    duration?: number;
    durationOnHover?: number;
    direction?: "horizontal" | "vertical";
    reverse?: boolean;
    className?: string;
};

export function InfiniteSlider({
    children,
    gap = 16,
    duration = 25,
    durationOnHover,
    direction = "horizontal",
    reverse = false,
    className,
}: InfiniteSliderProps) {
    const [ref, { width, height }] = useMeasure();
    const translation = useMotionValue(0);
    const [isHovered, setIsHovered] = useState(false);
    const [mustFinish, setMustFinish] = useState(false);
    const [rerender, setRerender] = useState(false);

    useEffect(() => {
        let controls;
        const finalDuration = isHovered && durationOnHover ? durationOnHover : duration;
        const size = direction === "horizontal" ? width : height;
        const contentSize = size + gap;

        if (contentSize === 0) return; // Prevent division by zero

        const from = reverse ? -contentSize / 2 : 0;
        const to = reverse ? 0 : -contentSize / 2;

        if (mustFinish) {
            controls = animate(translation, [translation.get(), to], {
                ease: "linear",
                duration: finalDuration * Math.abs((to - translation.get()) / contentSize),
                onComplete: () => {
                    setMustFinish(false);
                    setRerender(!rerender);
                },
            });
        } else {
            controls = animate(translation, [from, to], {
                ease: "linear",
                duration: finalDuration,
                repeat: Infinity,
                repeatType: "loop",
                repeatDelay: 0,
                onRepeat: () => {
                    translation.set(from);
                },
            });
        }

        return controls?.stop;
    }, [
        translation,
        duration,
        durationOnHover,
        isHovered,
        width,
        height,
        gap,
        direction,
        reverse,
        mustFinish,
        rerender,
    ]);

    return (
        <div
            className={cn("overflow-hidden flex", className)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                className="flex gap-[var(--gap)] w-max"
                style={{
                    //@ts-ignore
                    "--gap": `${gap}px`,
                    x: direction === "horizontal" ? translation : 0,
                    y: direction === "vertical" ? translation : 0,
                    flexDirection: direction === "horizontal" ? "row" : "column",
                }}
                ref={ref}
            >
                {children}
                {children}
            </motion.div>
        </div>
    );
}
