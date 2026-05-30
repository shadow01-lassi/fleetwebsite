'use client';

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Navigation, 
  Lock, 
  FileText, 
  Activity, 
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  TrendingUp
} from 'lucide-react';

const FEATURES = [
  {
    id: "live-gps",
    label: "Live GPS Mapping",
    icon: Navigation,
    image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200",
    description: "Track coordinate locations and speeds in real-time.",
  },
  {
    id: "ignition-lock",
    label: "Ignition Relay Locks",
    icon: Lock,
    image: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=1200",
    description: "Shut off vehicle starters remotely to prevent unauthorized usage.",
  },
  {
    id: "driver-inspection",
    label: "Driver Auditing Gateway",
    icon: FileText,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200",
    description: "Review licensing docs in full resolution with active zoom tools.",
  },
  {
    id: "speed-charts",
    label: "Real-time Telemetry Plots",
    icon: Activity,
    image: "https://images.unsplash.com/photo-1551288049-bbda38a10ad5?q=80&w=1200",
    description: "Plot speeds and battery levels dynamically via Recharts areas.",
  },
  {
    id: "return-audit",
    label: "Return Safety Audits",
    icon: ShieldCheck,
    image: "https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?q=80&w=1200",
    description: "Process checklist compliance and post-lease image closures.",
  },
];

const AUTO_PLAY_INTERVAL = 4000;
const ITEM_HEIGHT = 65;

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export function FeatureCarousel() {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentIndex =
    ((step % FEATURES.length) + FEATURES.length) % FEATURES.length;

  const nextStep = useCallback(() => {
    setStep((prev) => prev + 1);
  }, []);

  const handleChipClick = (index: number) => {
    const diff = (index - currentIndex + FEATURES.length) % FEATURES.length;
    if (diff > 0) setStep((s) => s + diff);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextStep, AUTO_PLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [nextStep, isPaused]);

  const getCardStatus = (index: number) => {
    const diff = index - currentIndex;
    const len = FEATURES.length;

    let normalizedDiff = diff;
    if (diff > len / 2) normalizedDiff -= len;
    if (diff < -len / 2) normalizedDiff += len;

    if (normalizedDiff === 0) return "active";
    if (normalizedDiff === -1) return "prev";
    if (normalizedDiff === 1) return "next";
    return "hidden";
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-16">
      <div className="relative overflow-hidden rounded-[2.5rem] lg:rounded-[4rem] flex flex-col lg:flex-row min-h-[600px] lg:aspect-video border border-slate-800 bg-slate-950 shadow-2xl">
        
        {/* Left Side Navigation Chips */}
        <div className="w-full lg:w-[40%] min-h-[350px] md:min-h-[450px] lg:h-full relative z-30 flex flex-col items-start justify-center overflow-hidden px-8 md:px-16 lg:pl-16 bg-[#0a0f24] border-r border-slate-900">
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#0a0f24] via-[#0a0f24]/80 to-transparent z-40 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0a0f24] via-[#0a0f24]/80 to-transparent z-40 pointer-events-none" />
          
          <div className="relative w-full h-full flex items-center justify-center lg:justify-start z-20 min-h-[300px]">
            {FEATURES.map((feature, index) => {
              const isActive = index === currentIndex;
              const distance = index - currentIndex;
              const wrappedDistance = wrap(
                -(FEATURES.length / 2),
                FEATURES.length / 2,
                distance
              );
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.id}
                  style={{
                    height: ITEM_HEIGHT,
                    width: "fit-content",
                  }}
                  animate={{
                    y: wrappedDistance * ITEM_HEIGHT,
                    opacity: 1 - Math.abs(wrappedDistance) * 0.35,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                  }}
                  className="absolute flex items-center justify-start"
                >
                  <button
                    onClick={() => handleChipClick(index)}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    className={cn(
                      "relative flex items-center gap-4 px-6 md:px-10 lg:px-8 py-3.5 md:py-4 rounded-full transition-all duration-500 text-left group border cursor-pointer",
                      isActive
                        ? "bg-gradient-to-r from-teal-500 to-indigo-600 text-white border-transparent z-10 shadow-lg shadow-teal-500/20"
                        : "bg-transparent text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center transition-colors duration-300",
                        isActive ? "text-white" : "text-slate-500 group-hover:text-teal-400"
                      )}
                    >
                      <Icon className="w-4.5 h-4.5" />
                    </div>

                    <span className="font-bold text-xs tracking-wider uppercase">
                      {feature.label}
                    </span>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Side Visual Cards */}
        <div className="flex-1 min-h-[500px] md:min-h-[600px] lg:h-full relative bg-[#040712] flex items-center justify-center py-16 md:py-24 lg:py-16 px-6 md:px-12 lg:px-10 overflow-hidden">
          <div className="relative w-full max-w-[420px] aspect-[4/5] flex items-center justify-center">
            {FEATURES.map((feature, index) => {
              const status = getCardStatus(index);
              const isActive = status === "active";
              const isPrev = status === "prev";
              const isNext = status === "next";

              return (
                <motion.div
                  key={feature.id}
                  initial={false}
                  animate={{
                    x: isActive ? 0 : isPrev ? -120 : isNext ? 120 : 0,
                    scale: isActive ? 1 : isPrev || isNext ? 0.85 : 0.7,
                    opacity: isActive ? 1 : isPrev || isNext ? 0.45 : 0,
                    rotate: isPrev ? -4 : isNext ? 4 : 0,
                    zIndex: isActive ? 20 : isPrev || isNext ? 10 : 0,
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 280,
                    damping: 24,
                  }}
                  className="absolute inset-0 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border-4 md:border-8 border-slate-950 bg-slate-900 origin-center shadow-2xl"
                >
                  <img
                    src={feature.image}
                    alt={feature.label}
                    className={cn(
                      "w-full h-full object-cover transition-all duration-700",
                      isActive
                        ? "grayscale-0 blur-0 scale-100"
                        : "grayscale blur-[1px] brightness-75 scale-95"
                    )}
                  />

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute inset-x-0 bottom-0 p-8 pt-24 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end pointer-events-none"
                      >
                        <div className="bg-teal-500/10 text-teal-400 px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit border border-teal-500/20 mb-3.5 shadow-lg">
                          Feature {index + 1} • {feature.label}
                        </div>
                        <p className="text-white font-bold text-lg md:text-xl leading-tight tracking-tight drop-shadow-lg">
                          {feature.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div
                    className={cn(
                      "absolute top-6 left-6 flex items-center gap-2.5 transition-opacity duration-300",
                      isActive ? "opacity-100" : "opacity-0"
                    )}
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                    </span>
                    <span className="text-white/80 text-[9px] font-bold uppercase tracking-widest font-mono">
                      Telemetry Sync
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeatureCarousel;
