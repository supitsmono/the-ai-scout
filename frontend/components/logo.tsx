export const Logo = ({ className, size = "default" }: { className?: string; size?: "default" | "small" | "large" }) => {
    const sizes = {
        small: { icon: "h-7 w-7", text: "text-base", iconText: "text-xs" },
        default: { icon: "h-8 w-8", text: "text-lg", iconText: "text-sm" },
        large: { icon: "h-10 w-10", text: "text-xl", iconText: "text-base" }
    };
    
    const sizeClasses = sizes[size];
    
    return (
        <div className={`flex items-center gap-2.5 font-bold tracking-tight text-white ${className || ""}`}>
            <div className={`${sizeClasses.icon} bg-cyan-500 rounded-lg flex items-center justify-center text-black font-bold shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform`}>
                <span className={sizeClasses.iconText}>AI</span>
            </div>
            <span className={sizeClasses.text}>AI Scout</span>
        </div>
    );
};
