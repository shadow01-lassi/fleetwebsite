'use client';

import React from 'react';
import { Header } from '@/components/ui/header-3';
import { DotGlobeHero } from '@/components/ui/globe-hero';
import ShaderBackground from '@/components/ui/shader-background';
import FlowArt, { FlowSection } from '@/components/ui/story-scroll';
import { FeatureCarousel } from '@/components/ui/animated-feature-carousel';
import PricingSection from '@/components/ui/pricing-section';
import { CinematicFooter } from '@/components/ui/motion-footer';
import { ArrowRight, Zap, Shield, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const IMAGES = {
  alt: "Fleetly Telemetry Console Screens",
  step1img1: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=800&auto=format&fit=crop",
  step1img2: "https://images.unsplash.com/photo-1607705703571-c5a8695f18f6?q=80&w=800&auto=format&fit=crop",
  step2img1: "https://images.unsplash.com/photo-1542393545-10f5cde2c810?q=80&w=800&auto=format&fit=crop",
  step2img2: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=800&auto=format&fit=crop",
  step3img: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1200&auto=format&fit=crop",
  step4img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
};

export default function MarketingLandingPage() {
  return (
    <div className="relative min-h-screen bg-[#070a13] text-slate-100 selection:bg-teal-500/20 selection:text-teal-400 overflow-x-hidden">
      
      {/* 1. Glassmorphic Dropdown Navigation Header */}
      <Header />

      {/* 2. WebGL Plasma Aurora Grids Canvas Backdrop */}
      <ShaderBackground />

      {/* 3. 3D Perspective WebGL Wireframe Globe Hero Section */}
      <div className="relative w-full h-screen border-b border-white/5">
        <DotGlobeHero rotationSpeed={0.003} globeRadius={1.2} className="relative z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(7,10,19,0.2)_0%,#070a13_90%)] pointer-events-none" />
          
          <div className="relative z-10 text-center space-y-8 max-w-5xl mx-auto px-6 py-12 mt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              {/* Premium Glow Badge */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative inline-flex items-center gap-3 px-6 py-3 rounded-full bg-slate-950/80 border border-white/5 backdrop-blur-xl shadow-2xl"
              >
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-ping" />
                <span className="relative z-10 text-xs font-black text-teal-400 tracking-widest uppercase">Global Telemetry Hub</span>
              </motion.div>
              
              <div className="space-y-4">
                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="text-5xl md:text-8xl xl:text-9xl font-black tracking-tighter leading-[0.85] uppercase select-none"
                >
                  <span className="block font-light text-slate-400/90 mb-2">Connect</span>
                  <span className="block relative">
                    <span className="bg-gradient-to-br from-teal-400 via-teal-300 to-indigo-600 bg-clip-text text-transparent font-black relative z-10">
                      The Grid
                    </span>
                  </span>
                </motion.h1>
              </div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="max-w-2xl mx-auto space-y-4"
              >
                <p className="text-sm md:text-base text-slate-400 leading-relaxed font-semibold">
                  Experience high-frequency global GPS tracking with our{' '}
                  <span className="text-white font-bold bg-white/5 border border-white/5 px-2.5 py-1 rounded-lg">
                    distributed telemetry nodes
                  </span>. Immobilize starters, inspect document queues, and release assets automatically.
                </p>
              </motion.div>
            </motion.div>

            {/* Quick action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2 relative z-20"
            >
              <motion.a
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.98 }}
                href="/login"
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-t from-teal-500 to-teal-400 text-black rounded-xl font-black text-sm uppercase tracking-wider shadow-lg shadow-teal-500/20 transition-all duration-300 border border-teal-400 cursor-pointer"
              >
                <span>Launch Admin Portal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </motion.a>
              
              <motion.a
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.98 }}
                href="/admin/dashboard"
                className="group relative inline-flex items-center gap-3 px-8 py-4 border border-white/10 rounded-xl font-black text-sm uppercase tracking-wider bg-slate-950/80 hover:bg-slate-900 transition-all duration-300 backdrop-blur-xl cursor-pointer"
              >
                <Zap className="w-4 h-4 text-teal-400" />
                <span>Executive Console</span>
              </motion.a>
            </motion.div>
          </div>
        </DotGlobeHero>

        {/* Floating bottom indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-bounce cursor-pointer">
          <span className="text-[9px] font-black text-teal-400 uppercase tracking-widest leading-none">Scroll to discover</span>
          <ChevronDown className="w-4 h-4 text-teal-400" />
        </div>
      </div>

      {/* 4. GSAP Pinned Story Scroll Rotative Transform Cards */}
      <div className="relative z-20 border-b border-white/5">
        <FlowArt aria-label="Fleetly Core Philosophy">
          
          {/* Card 1: GPS Mapping */}
          <FlowSection aria-label="Real-Time GPS Tracking" style={{ backgroundColor: '#0c172c', color: '#fff' }}>
            <div className="border-b border-white/5 pb-4 mb-4 flex justify-between items-center w-full">
              <span className="text-[10px] font-black uppercase tracking-widest text-teal-400">01 — Global Tracking</span>
              <Shield className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <h1 className="text-[clamp(3.5rem,10vw,10rem)] font-black leading-[0.85] uppercase tracking-tighter text-slate-100 select-none">
                TRACK
                <br />
                COORDINATES
              </h1>
            </div>
            <p className="mt-auto max-w-[55ch] text-[clamp(1rem,2vw,1.5rem)] font-semibold leading-relaxed text-slate-400 border-t border-white/5 pt-6">
              Never lose sight of active rental assets. High-frequency tracker hardware syncs coordinates directly to Cloud Firestore, generating pulsing indicators in real-time across high-fidelity Leaflet maps.
            </p>
          </FlowSection>

          {/* Card 2: Ignition Locking */}
          <FlowSection aria-label="Direct Ignition Locks" style={{ backgroundColor: '#062e3d', color: '#fff' }}>
            <div className="border-b border-white/5 pb-4 mb-4 flex justify-between items-center w-full">
              <span className="text-[10px] font-black uppercase tracking-widest text-teal-400">02 — Remote Controls</span>
              <Shield className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <h1 className="text-[clamp(3.5rem,10vw,10rem)] font-black leading-[0.85] uppercase tracking-tighter text-slate-100 select-none">
                LOCK
                <br />
                IGNITION
              </h1>
            </div>
            <p className="mt-auto max-w-[55ch] text-[clamp(1rem,2vw,1.5rem)] font-semibold leading-relaxed text-slate-400 border-t border-white/5 pt-6">
              Send encrypted ignition toggle payloads directly to tracker devices. Lock engine triggers instantly on unauthorized route boundaries to secure your operations against compliance breaches.
            </p>
          </FlowSection>

          {/* Card 3: Driver Auditing */}
          <FlowSection aria-label="Split-Screen Document Queue" style={{ backgroundColor: '#1c0d2e', color: '#fff' }}>
            <div className="border-b border-white/5 pb-4 mb-4 flex justify-between items-center w-full">
              <span className="text-[10px] font-black uppercase tracking-widest text-teal-400">03 — Verification Queue</span>
              <Shield className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <h1 className="text-[clamp(3.5rem,10vw,10rem)] font-black leading-[0.85] uppercase tracking-tighter text-slate-100 select-none">
                AUDIT
                <br />
                LICENSES
              </h1>
            </div>
            <p className="mt-auto max-w-[55ch] text-[clamp(1rem,2vw,1.5rem)] font-semibold leading-relaxed text-slate-400 border-t border-white/5 pt-6">
              Approve pending drivers through a dedicated document inspector panel. Inspect Driving Licenses, PAN cards, and utility bill images side-by-side using high-precision zoom controls in under 5 minutes.
            </p>
          </FlowSection>

        </FlowArt>
      </div>

      {/* 5. Spotlight Animated Feature Card Deck */}
      <div className="relative z-20 bg-[#070a13] py-32 border-b border-white/5">
        <div className="text-center space-y-4 px-6 max-w-3xl mx-auto mb-20">
          <span className="bg-teal-500/10 text-teal-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit border border-teal-500/20 shadow-md">
            Interactive Deck
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase leading-none">
            Console Highlights
          </h2>
          <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-semibold">
            Track, audit, configure, and release assets seamlessly using the integrated Fleetly components.
          </p>
        </div>
        <FeatureCarousel image={IMAGES} />
      </div>

      {/* 6. Advanced Timeline Pricing Section using NumberFlow */}
      <div id="pricing" className="relative z-20 bg-[#070a13] py-16 scroll-mt-16">
        <PricingSection />
      </div>

      {/* 7. Show-Stopping Fixed reveal Curtain Cinematic Footer */}
      <div className="relative z-20 bg-[#070a13]">
        <CinematicFooter />
      </div>

    </div>
  );
}
