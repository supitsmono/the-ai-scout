import { cn } from "@/lib/utils";

interface ProgressiveBlurProps {
    children?: React.ReactNode;
    className?: string;
    direction?: "top" | "bottom" | "left" | "right";
    blurIntensity?: number;
}

export function ProgressiveBlur({
    children,
    className,
    direction = "bottom",
    blurIntensity = 1,
}: ProgressiveBlurProps) {
    // Map direction to gradient angle/direction
    const gradientMap = {
        top: "to top",
        bottom: "to bottom",
        left: "to left",
        right: "to right",
    };

    return (
        <div
            className={cn("pointer-events-none", className)}
            style={{
                backdropFilter: `blur(${blurIntensity * 8}px)`,
                // Simple mask gradient for progressive feel
                maskImage: `linear-gradient(${gradientMap[direction]}, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)`,
                WebkitMaskImage: `linear-gradient(${gradientMap[direction]}, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)`,
            }}
        >
            {children}
        </div>
    );
}
