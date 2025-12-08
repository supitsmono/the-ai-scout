
import * as React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface MetricCardProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
    suffix?: string
}

export function MetricCard({ label, suffix, className, ...props }: MetricCardProps) {
    return (
        <div className="flex flex-col gap-2">
            <Label className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</Label>
            <div className="relative group">
                <Input
                    {...props}
                    className={`bg-slate-900/50 border-slate-800 focus:border-purple-500/50 transition-all font-mono text-center pr-8 h-12 text-lg group-hover:bg-slate-900/80 ${className}`}
                />
                {suffix && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-medium">
                        {suffix}
                    </span>
                )}
            </div>
        </div>
    )
}
