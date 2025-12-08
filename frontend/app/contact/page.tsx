"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Mail, ArrowLeft } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="group">
            <Logo size="default" className="group" />
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-12 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
              <p className="text-lg text-slate-400">
                Have a question or need help? We're here to assist you.
              </p>
            </div>

            {/* Contact Information */}
            <section className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <Mail className="w-6 h-6 text-cyan-400" />
                    Get in Touch
                  </h2>
                  <p className="text-slate-400 mb-6">
                    For general inquiries, support, or partnership opportunities, please reach out to us via email.
                  </p>
                </div>

                <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-cyan-500/10 rounded-lg">
                      <Mail className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Email Address</p>
                      <a
                        href="mailto:theaiscout.info@gmail.com"
                        className="text-xl font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        theaiscout.info@gmail.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3">Response Time</h3>
                  <p className="text-slate-400 text-sm">
                    We typically respond to all inquiries within 24-48 hours during business days.
                  </p>
                </div>
              </div>
            </section>

            {/* Additional Information */}
            <section className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4 text-sm text-slate-400">
                <p>
                  Before reaching out, you might find answers to common questions in our{" "}
                  <Link href="/terms" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                    Terms of Service
                  </Link>{" "}
                  or{" "}
                  <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

