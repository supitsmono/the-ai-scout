"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="relative min-h-screen bg-[#000000] text-white overflow-hidden selection:bg-cyan-500/30">
      {/* Technical Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />

      {/* Ambient Cyan Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 pt-8 pb-4">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="group">
            <Logo size="default" className="group" />
          </Link>
          <Link
            href="/signup"
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Signup
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-slate-400 text-sm mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="prose prose-invert max-w-none space-y-6 text-slate-300">
            <section>
              <h2 className="text-2xl font-bold text-white mb-3">1. Agreement to Terms</h2>
              <p className="text-sm leading-relaxed">
                By accessing or using AI Scout, you agree to be bound by these Terms of Service. 
                If you disagree with any part of these terms, you may not access the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">2. Use License</h2>
              <p className="text-sm leading-relaxed mb-2">
                Permission is granted to temporarily use AI Scout for your agency's internal business purposes. 
                This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose without explicit permission</li>
                <li>Attempt to reverse engineer any software contained in AI Scout</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">3. User Accounts</h2>
              <p className="text-sm leading-relaxed">
                You are responsible for maintaining the confidentiality of your account and password. 
                You agree to accept responsibility for all activities that occur under your account. 
                You must notify us immediately of any unauthorized use of your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">4. Data and Privacy</h2>
              <p className="text-sm leading-relaxed">
                You retain all rights to your data. We will not share your data with third parties 
                without your explicit consent. For more information, please see our{" "}
                <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                  Privacy Policy
                </Link>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">5. Payment Terms</h2>
              <p className="text-sm leading-relaxed">
                Subscription fees are billed monthly. You may cancel your subscription at any time. 
                Refunds are provided on a case-by-case basis. All fees are non-refundable unless 
                otherwise stated in writing.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">6. Limitation of Liability</h2>
              <p className="text-sm leading-relaxed">
                AI Scout is provided "as is" without warranties of any kind. We shall not be liable 
                for any indirect, incidental, special, or consequential damages arising out of or 
                in connection with your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">7. Contact Information</h2>
              <p className="text-sm leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at{" "}
                <a href="mailto:legal@aiscout.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                  legal@aiscout.com
                </a>.
              </p>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

