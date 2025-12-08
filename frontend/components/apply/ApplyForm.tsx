
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MetricCard } from "@/components/apply/MetricCard";
import PhoneInput from "@/components/ui/PhoneInput";
import { ChevronRight, ChevronLeft, Camera, CheckCircle2, Sparkles, Send } from "lucide-react";

export default function ApplyForm({ slug }: { slug: string }) {
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        city: "",
        height: "",
        age: "",
        instagram: ""
    });

    const totalSteps = 4;

    const handleNext = () => {
        if (step < totalSteps) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        await new Promise(r => setTimeout(r, 2000));
        setSubmitting(false);
        setSuccess(true);
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center text-center p-8 h-[500px] relative">
                {/* Success Particles/Glow */}
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute inset-0 z-0 bg-gradient-to-b from-purple-500/10 to-transparent rounded-full blur-3xl"
                />

                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                    className="relative z-10 w-20 h-20 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.5)] mb-6"
                >
                    <CheckCircle2 className="w-10 h-10 text-white" />
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="relative z-10 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300 mb-3"
                >
                    Application Sent!
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="relative z-10 text-sm text-slate-400 max-w-xs mb-6 leading-relaxed"
                >
                    We've received your profile. You'll be contacted directly if there's a match.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="relative z-10 flex gap-2 items-center text-xs font-medium text-slate-300 bg-slate-900/50 px-4 py-2 rounded-full border border-slate-700/50"
                >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Success</span>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-3xl mx-auto">
            {/* Premium Integrated Progress & Form Container */}
            <div className="bg-[#0B0F19]/80 border border-slate-800/60 rounded-2xl sm:rounded-3xl backdrop-blur-2xl shadow-2xl relative overflow-hidden flex flex-col h-[650px] max-h-[85vh]">

                {/* Decorative background blurs inside form */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />

                {/* Header / Progress Section */}
                <div className="pt-6 px-6 sm:px-10 pb-4 border-b border-slate-800/50 flex-none relative z-10">
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">
                        <span className={step >= 1 ? "text-slate-200" : ""}>01 Details</span>
                        <span className={step >= 2 ? "text-slate-200" : ""}>02 Stats</span>
                        <span className={step >= 3 ? "text-slate-200" : ""}>03 Photos</span>
                        <span className={step >= 4 ? "text-slate-200" : ""}>04 Review</span>
                    </div>
                    <div className="h-1 bg-slate-800/50 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500"
                            initial={{ width: "0%" }}
                            animate={{ width: `${(step / totalSteps) * 100}%` }}
                            transition={{ duration: 0.5, ease: "circOut" }}
                        />
                    </div>
                </div>

                {/* Scrollable Content Area */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 sm:px-10 py-6 relative z-10 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <StepWrapper key="step1" title="Who are you?" description="Start with your basic contact information.">
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-slate-400">First Name</Label>
                                        <Input className="h-10 bg-slate-900/50 border-slate-800 focus:border-purple-500/50 transition-colors" placeholder="Jane" required value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-slate-400">Last Name</Label>
                                        <Input className="h-10 bg-slate-900/50 border-slate-800 focus:border-purple-500/50 transition-colors" placeholder="Doe" required value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                                    </div>
                                    <div className="space-y-1.5 sm:col-span-2">
                                        <Label className="text-xs text-slate-400">Email</Label>
                                        <Input className="h-10 bg-slate-900/50 border-slate-800 focus:border-purple-500/50 transition-colors" type="email" placeholder="jane@example.com" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                    </div>
                                    <div className="space-y-1.5 sm:col-span-2">
                                        <Label className="text-xs text-slate-400">Phone Number</Label>
                                        <PhoneInput />
                                    </div>
                                    <div className="space-y-1.5 sm:col-span-2">
                                        <Label className="text-xs text-slate-400">Instagram</Label>
                                        <div className="relative group">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs group-focus-within:text-purple-400 transition-colors">@</span>
                                            <Input className="pl-8 h-10 bg-slate-900/50 border-slate-800 focus:border-purple-500/50 group-hover:border-slate-700 transition-colors" placeholder="username" value={formData.instagram} onChange={e => setFormData({ ...formData, instagram: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                            </StepWrapper>
                        )}

                        {step === 2 && (
                            <StepWrapper key="step2" title="The Numbers" description="Standard industry measurements. Be accurate.">
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    <MetricCard label="Height" suffix="cm" type="number" placeholder="175" value={formData.height} onChange={e => setFormData({ ...formData, height: e.target.value })} />
                                    <MetricCard label="Age" type="number" placeholder="21" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
                                    <MetricCard label="Waist" suffix="cm" type="number" placeholder="60" />
                                    <MetricCard label="Hips" suffix="cm" type="number" placeholder="90" />
                                    <MetricCard label="Shoes" type="number" placeholder="38" />
                                    <MetricCard label="Bust" suffix="cm" type="number" placeholder="85" />
                                </div>
                                <div className="mt-8 space-y-1.5">
                                    <Label className="text-xs text-slate-400">Current City</Label>
                                    <Input className="h-10 bg-slate-900/50 border-slate-800 focus:border-purple-500/50 transition-colors" placeholder="Where are you based?" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                                </div>
                            </StepWrapper>
                        )}

                        {step === 3 && (
                            <StepWrapper key="step3" title="Polariods" description="Natural light, plain background.">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    <PhotoDropzone label="Close-up" sub="Front" />
                                    <PhotoDropzone label="Side Profile" sub="L/R" />
                                    <PhotoDropzone label="Full Body" sub="Front" />
                                    <PhotoDropzone label="3/4 Body" sub="Hips Up" />
                                    <PhotoDropzone label="Personality" sub="Extra" />
                                    <div className="border border-dashed border-slate-800/60 rounded-xl p-2 flex flex-col items-center justify-center text-center opacity-40 bg-slate-950/20 aspect-[4/5]">
                                        <Camera className="w-5 h-5 mb-1" />
                                        <span className="text-[10px] font-medium">5 Photos</span>
                                    </div>
                                </div>
                            </StepWrapper>
                        )}

                        {step === 4 && (
                            <StepWrapper key="step4" title="Final Review" description="Ready to submit?">
                                <div className="space-y-5">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-slate-400">Message (Optional)</Label>
                                        <Textarea
                                            placeholder="Why you?"
                                            className="h-28 resize-none bg-slate-900/50 border-slate-800 focus:border-purple-500/50 text-sm p-4 leading-relaxed"
                                        />
                                    </div>

                                    <div className="bg-gradient-to-br from-slate-900/50 to-slate-950/30 rounded-xl p-5 border border-slate-800/60 space-y-3">
                                        <h4 className="font-semibold text-white flex items-center gap-2 text-xs uppercase tracking-wider">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                            Check details
                                        </h4>
                                        <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs">
                                            <div>
                                                <span className="text-slate-500 block text-[9px] uppercase tracking-wider mb-0.5">Name</span>
                                                <span className="text-slate-200 font-medium">{formData.firstName} {formData.lastName || "-"}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-500 block text-[9px] uppercase tracking-wider mb-0.5">Height</span>
                                                <span className="text-slate-200 font-medium">{formData.height || "-"} cm</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-500 block text-[9px] uppercase tracking-wider mb-0.5">Location</span>
                                                <span className="text-slate-200 font-medium">{formData.city || "-"}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-500 block text-[9px] uppercase tracking-wider mb-0.5">Instagram</span>
                                                <span className="text-slate-200 font-medium">{formData.instagram || "-"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </StepWrapper>
                        )}
                    </AnimatePresence>
                </form>

                {/* Fixed Navigation Buttons */}
                <div className="flex-none p-6 sm:px-10 border-t border-slate-800/50 bg-[#0B0F19]/90 backdrop-blur-xl relative z-20 flex justify-between items-center">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleBack}
                        disabled={step === 1 || submitting}
                        className={`text-slate-400 hover:text-white hover:bg-white/5 transition-colors ${step === 1 ? "invisible" : ""}`}
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Back
                    </Button>

                    {step < totalSteps ? (
                        <Button
                            type="button"
                            onClick={handleNext}
                            className="bg-white text-slate-950 hover:bg-slate-200 rounded-full px-8 h-10 text-sm font-semibold shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all active:scale-95"
                        >
                            Next Step
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    ) : (
                        <Button
                            type="button" // Change to 'submit' if inside form, but here buttons are outside. We need to trigger form submit.
                            onClick={handleSubmit} // Manually triggering submit since button is outside form
                            disabled={submitting}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0 rounded-full px-8 h-10 text-sm font-semibold shadow-[0_0_30px_rgba(124,58,237,0.3)] transition-all hover:shadow-[0_0_40px_rgba(124,58,237,0.5)] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {submitting ? (
                                <span className="flex items-center gap-2">Processing... <Sparkles className="w-4 h-4 animate-spin" /></span>
                            ) : (
                                <span className="flex items-center gap-2">Submit <Send className="w-4 h-4" /></span>
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

function StepWrapper({ title, description, children }: { title: string, description: string, children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="space-y-6 pb-4"
        >
            <div className="space-y-1">
                <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
                <p className="text-slate-400 text-xs max-w-sm leading-relaxed">{description}</p>
            </div>
            {children}
        </motion.div>
    );
}

function PhotoDropzone({ label, sub }: { label: string, sub?: string }) {
    return (
        <div className="group relative border border-dashed border-slate-700/50 hover:border-purple-500/50 rounded-xl p-3 transition-all cursor-pointer bg-slate-950/30 hover:bg-slate-900/60 aspect-[4/5] flex flex-col items-center justify-center text-center gap-2.5">
            <div className="h-10 w-10 rounded-full bg-slate-900/80 border border-slate-800 group-hover:bg-purple-500/10 group-hover:border-purple-500/20 flex items-center justify-center transition-all duration-300 shadow-lg">
                <Camera className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
            </div>
            <div className="space-y-0.5">
                <p className="font-medium text-xs text-slate-300 group-hover:text-white transition-colors">{label}</p>
                {sub && <p className="text-[9px] text-slate-500 uppercase tracking-wide font-medium">{sub}</p>}
            </div>

            {/* Hover Plus Icon */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-[10px] text-white font-bold">+</span>
                </div>
            </div>
        </div>
    )
}
