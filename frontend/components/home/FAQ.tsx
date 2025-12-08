"use client";

import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
    {
        question: "How accurate is the AI sorting?",
        answer: "Our AI analyzes every application and automatically sorts models into: Perfect Fit, Good Fit, or Low Potential. This is based on photos, height, age, and other information. You can always adjust manually.",
    },
    {
        question: "Can I export my data?",
        answer: "Yes, you can export all information to CSV or Excel. Perfect for your own records or to share with your team.",
    },
    {
        question: "Is my data secure?",
        answer: "Absolutely. All data is encrypted and stored securely. Your applications are private and never shared with other agencies.",
    },

];

export default function FAQ() {
    return (
        <section className="py-24 bg-[#050505] border-t border-white/5">
            <div className="container mx-auto px-6 max-w-3xl">
                <h2 className="text-3xl font-bold text-white tracking-tight mb-2 text-center">Frequently Asked Questions</h2>
                <p className="text-slate-300 text-center mb-12">Everything you need to know about the platform.</p>

                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, i) => (
                        <AccordionItem key={i} value={`item-${i}`} className="border-b border-white/5">
                            <AccordionTrigger className="text-slate-200 hover:text-white hover:no-underline py-6 text-left">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-slate-400 leading-relaxed pb-6">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
