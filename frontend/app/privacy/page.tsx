"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-slate-400 text-sm mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="prose prose-invert max-w-none space-y-6 text-slate-300">
            <section>
              <h2 className="text-2xl font-bold text-white mb-3">1. Information We Collect</h2>
              <p className="text-sm leading-relaxed mb-2">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                <li>Account information (name, email, agency name)</li>
                <li>Model application data (photos, measurements, personal information)</li>
                <li>Usage data and analytics</li>
                <li>Communication data (messages, support requests)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">2. How We Use Your Information</h2>
              <p className="text-sm leading-relaxed mb-2">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process and manage model applications</li>
                <li>Send you technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Monitor and analyze usage patterns</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">3. Data Security</h2>
              <p className="text-sm leading-relaxed">
                We implement appropriate technical and organizational measures to protect your data. 
                All data is encrypted in transit and at rest. We use industry-standard security 
                practices to safeguard your information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">4. Data Sharing</h2>
              <p className="text-sm leading-relaxed">
                We do not sell, trade, or rent your personal information to third parties. 
                We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm ml-4 mt-2">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and safety</li>
                <li>With service providers who assist in operating our platform (under strict confidentiality agreements)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">5. Your Rights</h2>
              <p className="text-sm leading-relaxed mb-2">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Export your data in a portable format</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">6. Cookies and Tracking</h2>
              <p className="text-sm leading-relaxed">
                We use cookies and similar tracking technologies to track activity on our service. 
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">7. Data Retention</h2>
              <p className="text-sm leading-relaxed">
                We retain your personal information for as long as necessary to provide our services 
                and fulfill the purposes described in this policy. When you delete your account, 
                we will delete or anonymize your data within 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">8. Changes to This Policy</h2>
              <p className="text-sm leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes 
                by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">9. Contact Us</h2>
              <p className="text-sm leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at{" "}
                <a href="mailto:privacy@aiscout.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                  privacy@aiscout.com
                </a>.
              </p>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

