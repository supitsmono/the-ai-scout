"use client";

import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
    {
        question: "How accurate is the AI tagging?",
        answer: "Our computer vision models are trained on over 2 million professional model composites. We achieve 99.4% accuracy on standard tags like 'Height', 'Eye Color', and 'Hair Texture', and 92% on subjective tags like 'Commercial' vs 'Editorial'.",
    },
    {
        question: "Can I export data to my existing booking software?",
        answer: "Yes. AI Scout integrates properly with common booking platforms like CDS and Mainboard via our API. You can also export CSV/Excel reports instantly.",
    },
    {
        question: "Is my data secure?",
        answer: "Absolutely. We are SOC2 compliant. All scouted data is encrypted at rest and in transit. Your exclusive scouting database is siloed and never shared with other agencies.",
    },
    {
        question: "What happens if I exceed my application limit?",
        answer: "We offer soft limits. If you have a viral TikTok campaign and receive 10k applications overnight, we'll process them all and alert you to upgrade your plan for the following month. No data is lost.",
    },
];

export default function FAQ() {
    return (
        <section className="py-24 bg-[#050505] border-t border-white/5">
            <div className="container mx-auto px-6 max-w-3xl">
                <h2 className="text-3xl font-bold text-white tracking-tight mb-2 text-center">Frequently Asked Questions</h2>
                <p className="text-slate-500 text-center mb-12">Everything you need to know about the platform.</p>

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
