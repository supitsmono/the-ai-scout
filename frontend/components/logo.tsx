export const Logo = ({ className }: { className?: string }) => (
    <div className={`flex items-center gap-2 font-bold text-xl tracking-tight text-white ${className}`}>
        <div className="bg-white/10 border border-white/10 rounded-xl h-8 w-8 flex items-center justify-center">
            <span className="text-white text-xs">AI</span>
        </div>
        <span>The AI Scout</span>
    </div>
);
