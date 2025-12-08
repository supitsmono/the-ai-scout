"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Filter, MessageSquare, CheckCircle2, Clock, XCircle, Sparkles, ArrowRight, ArrowLeft, Search, MapPin, Calendar, ChevronRight, ChevronLeft } from "lucide-react";

export default function DemoVideo() {
  const [currentScene, setCurrentScene] = useState(0);

  const scenes = [
    {
      title: "AI Pipeline Automation",
      description: "Instantly sort incoming applications",
      explanation: "Our AI analyzes photos and data in real-time, categorizing models into Perfect Fit, Good Fit, or Low Potential automatically.",
    },
    {
      title: "Smart Filtering",
      description: "Find your exact match in seconds",
      explanation: "Filter thousands of models by height, location, age, and experience. No more manual spreadsheet filtering.",
    },
    {
      title: "Direct Integrated Chat",
      description: "Seamless communication workflow",
      explanation: "Chat directly with models, schedule castings, and manage offers without leaving your dashboard.",
    },
  ];

  const nextScene = () => {
    setCurrentScene((prev) => (prev + 1) % scenes.length);
  };

  const prevScene = () => {
    setCurrentScene((prev) => (prev - 1 + scenes.length) % scenes.length);
  };

  return (
    <div className="relative w-full h-full bg-[#0B0F19] rounded-xl overflow-hidden border border-white/10 shadow-2xl">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.15),transparent_70%)]" />
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#0B0F19] to-transparent" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />

      {/* Content Container */}
      <AnimatePresence mode="wait">
        {currentScene === 0 && (
          <ScenePipeline key="pipeline" scene={scenes[0]} />
        )}
        {currentScene === 1 && (
          <SceneFilters key="filters" scene={scenes[1]} />
        )}
        {currentScene === 2 && (
          <SceneChat key="chat" scene={scenes[2]} />
        )}
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute bottom-6 left-0 right-0 z-30 flex flex-col items-center gap-4 pointer-events-none">
        {/* Dynamic Scene Indicators */}
        <div className="flex items-center gap-2 p-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10 pointer-events-auto">
          {scenes.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentScene(idx)}
              className={`relative h-2 rounded-full transition-all duration-500 ease-out ${idx === currentScene ? "w-8 bg-cyan-400" : "w-2 bg-white/20 hover:bg-white/40"
                }`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <div className="flex gap-4 pointer-events-auto">
          <button
            onClick={prevScene}
            disabled={currentScene === 0}
            className={`p-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-sm text-white transition-all hover:bg-white/10 hover:scale-110 disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextScene}
            disabled={currentScene === scenes.length - 1}
            className={`p-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm text-cyan-400 transition-all hover:bg-cyan-500/20 hover:scale-110 disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Scene Components ---

function ScenePipeline({ scene }: { scene: any }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col"
    >
      <SceneHeader title={scene.title} description={scene.description} explanation={scene.explanation} />

      <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-4 mt-4 relative">
        {/* Connection Lines (Desktop) */}
        <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent hidden sm:block -z-10" />

        {/* Step 1: Ingestion */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative group"
        >
          <div className="w-32 h-40 bg-[#13161C] border border-white/10 rounded-xl p-3 flex flex-col items-center justify-center shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 space-y-2 w-full">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.2 }}
                  className="h-8 bg-slate-800/80 rounded-lg border border-slate-700/50 flex items-center px-2 gap-2"
                >
                  <div className="w-5 h-5 rounded-full bg-slate-600/50 shrink-0" />
                  <div className="h-2 w-12 bg-slate-600/30 rounded-full" />
                </motion.div>
              ))}
            </div>
          </div>
          <div className="text-center mt-3">
            <div className="text-xs font-semibold text-slate-300">Applicants</div>
            <div className="text-[10px] text-slate-500">Raw Stream</div>
          </div>
        </motion.div>

        {/* Processing Arrow */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.2, type: "spring" }}
          className="z-10"
        >
          <ArrowRight className="text-cyan-500/50 w-6 h-6 rotate-90 sm:rotate-0" />
        </motion.div>

        {/* Step 2: AI Processing */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="relative"
        >
          <div className="w-28 h-28 rounded-full border border-cyan-500/30 bg-cyan-500/5 flex items-center justify-center relative shadow-[0_0_30px_rgba(6,182,212,0.15)]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-t border-cyan-400 opacity-50"
            />
            <Sparkles className="w-10 h-10 text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
          </div>
          <div className="text-center mt-3">
            <div className="text-xs font-semibold text-cyan-400">AI Analysis</div>
            <div className="text-[10px] text-cyan-500/50">Processing...</div>
          </div>
        </motion.div>

        {/* Processing Arrow */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2, type: "spring" }}
          className="z-10"
        >
          <ArrowRight className="text-cyan-500/50 w-6 h-6 rotate-90 sm:rotate-0" />
        </motion.div>

        {/* Step 3: Sorted Results */}
        <div className="flex flex-col gap-2">
          {[
            { label: "Perfect Fit", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: CheckCircle2, count: 18 },
            { label: "Good Fit", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: Clock, count: 12 },
            { label: "Low Potential", color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/20", icon: XCircle, count: 4 },
          ].map((cat, idx) => (
            <motion.div
              key={cat.label}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 2.2 + idx * 0.15 }}
              className={`w-36 md:w-40 p-2.5 rounded-lg border ${cat.border} ${cat.bg} flex items-center justify-between backdrop-blur-sm`}
            >
              <div className="flex items-center gap-2">
                <cat.icon className={`w-3.5 h-3.5 ${cat.color}`} />
                <span className={`text-[11px] font-medium ${cat.color}`}>{cat.label}</span>
              </div>
              <span className={`text-xs font-bold ${cat.color}`}>{cat.count}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function SceneFilters({ scene }: { scene: any }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col"
    >
      <SceneHeader title={scene.title} description={scene.description} explanation={scene.explanation} />

      <div className="flex-1 flex gap-4 mt-4 overflow-hidden">
        {/* Filter Sidebar */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-1/3 bg-[#13161C]/90 backdrop-blur-md rounded-xl border border-white/10 p-3 flex flex-col gap-4"
        >
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <Filter className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold text-white">Refine</span>
          </div>

          <FilterSlider label="Age Range" min="18" max="35" range="21 - 26" delay={0.4} />
          <FilterSlider label="Height" min="170" max="190" range="175 - 182" delay={0.6} />

          <div className="mt-auto">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-full py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-colors"
            >
              Apply (32)
            </motion.button>
          </div>
        </motion.div>

        {/* Results Grid */}
        <div className="flex-1 grid grid-cols-2 gap-2 content-start">
          {[
            "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200",
            "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=200",
            "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200",
            "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200"
          ].map((src, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="aspect-[3/4] rounded-lg overflow-hidden border border-white/5 relative group"
            >
              <img src={src} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Model" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-100" />
              <div className="absolute bottom-2 left-2 right-2">
                <div className="h-1.5 w-16 bg-white/30 rounded-full mb-1" />
                <div className="h-1.5 w-10 bg-white/20 rounded-full" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function SceneChat({ scene }: { scene: any }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col"
    >
      <SceneHeader title={scene.title} description={scene.description} explanation={scene.explanation} />

      <div className="flex-1 mt-4 bg-[#13161C]/90 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden flex flex-col relative">
        {/* Chat Header */}
        <div className="h-12 border-b border-white/5 flex items-center px-4 gap-3 bg-white/[0.02]">
          <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden">
            <img src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-white">Sophia M.</div>
            <div className="text-[9px] text-emerald-400 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-emerald-400" /> Online
            </div>
          </div>
        </div>

        {/* Message Area */}
        <div className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto">
          <Message bubble="Hi Sophia, we reviewed your portfolio and love your look!" isMe={true} delay={0.2} />
          <Message bubble="That's amazing to hear! I'm available for castings next week." isMe={false} delay={1.0} />
          <Message bubble="Perfect. Can you stop by Monday at 10 AM?" isMe={true} delay={2.5} />

          {/* Typing Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.5 }}
            className="self-start bg-slate-800 rounded-2xl rounded-tl-none px-3 py-2"
          >
            <div className="flex gap-1">
              <span className="w-1 h-1 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-1 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-1 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        </div>

        {/* Input Area */}
        <div className="h-12 border-t border-white/5 p-2 px-3 flex items-center gap-2 bg-white/[0.02]">
          <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
            <span className="text-xs">+</span>
          </div>
          <div className="flex-1 h-8 bg-black/20 rounded-full border border-white/5" />
          <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- Helper Components ---

function SceneHeader({ title, description, explanation }: { title: string, description: string, explanation: string }) {
  return (
    <div className="flex-shrink-0 z-10">
      <h3 className="text-lg md:text-xl font-bold text-white mb-1">{title}</h3>
      <p className="text-xs md:text-sm text-cyan-400 font-medium mb-1">{description}</p>
      <p className="text-[10px] sm:text-xs text-slate-400 leading-relaxed max-w-2xl">{explanation}</p>
    </div>
  );
}

function FilterSlider({ label, min, max, range, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0.9 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ delay }}
      className="space-y-1"
    >
      <div className="flex justify-between text-[10px] text-slate-400">
        <span>{label}</span>
        <span className="text-cyan-400 font-mono">{range}</span>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full relative overflow-hidden">
        <div className="absolute inset-y-0 left-1/4 right-1/4 bg-cyan-500 rounded-full opacity-50" />
        <div className="absolute inset-y-0 left-1/4 w-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </div>
      <div className="flex justify-between text-[8px] text-slate-600 font-mono">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </motion.div>
  );
}

function Message({ bubble, isMe, delay }: { bubble: string, isMe: boolean, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay }}
      className={`max-w-[80%] px-3 py-2 text-xs rounded-2xl ${isMe
          ? "bg-cyan-500 text-black rounded-tr-none self-end font-medium"
          : "bg-slate-800 text-slate-200 rounded-tl-none self-start border border-white/5"
        }`}
    >
      {bubble}
    </motion.div>
  );
}

