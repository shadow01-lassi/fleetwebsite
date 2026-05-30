'use client';

import React from 'react';
import { PoemAnimation } from '@/components/ui/3d-animation';
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';
import { FeatureCarousel } from '@/components/ui/feature-carousel';
import PricingSection4 from '@/components/ui/pricing-section-4';
import HoverFooter from '@/components/ui/hover-footer';
import { CircleMenu } from '@/components/ui/circle-menu';
import { 
  LogIn, 
  LayoutDashboard, 
  Map, 
  Car, 
  FileCheck, 
  Receipt,
  HelpCircle,
  Shield
} from 'lucide-react';

const POEM_DATA = {
  poemHTML: `
    <p>The <span>telemetry</span> link established at dawn, each node pings coordinates across the grid, tracking <span>velocities</span> and battery under deep neon glows; they <span>danced</span> through coordinates, every ping a signal of health against rugged routes. The operators stepped forward with <span>confidence</span>, remote commands lock starters with open warmth, nodes seeking a shared <span>triumph</span> in active operations. When tracker signals slivered and one <span>faltered</span>, the backup channel caught them—relays brushing, pulses aligned in a daring heartbeat. In hardware they found grace; in telemetry they discovered unity. Each moment spent <span>daring</span> to audit the queues built a fleet impervious to failures. Hand in hand, stepping from the <strong>control room</strong>, knowing fleets bloom not by chance, but by <span>daring greatly</span> together.</p>
  `,
  backgroundImageUrl: "https://i.ibb.co/q3XSxR9W/20250831-120144.jpg",
  boyImageUrl: "https://i.ibb.co/Y4FKvK38/20250831-113022.png"
};

const SCROLL_MEDIA = {
  src: 'https://me7aitdbxq.ufs.sh/f/2wsMIGDMQRdYuZ5R8ahEEZ4aQK56LizRdfBSqeDMsmUIrJN1',
  poster: 'https://images.pexels.com/videos/5752729/space-earth-universe-cosmos-5752729.jpeg',
  background: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920',
  title: 'FLEET TELEMETRY PLATFORM',
  date: 'ACTIVE GPS TRACKER',
  scrollToExpand: 'Scroll to expand operations'
};

export default function MarketingLandingPage() {
  const menuItems = [
    { label: 'Admin Portal', icon: <LogIn size={16} />, href: '/login' },
    { label: 'Executive Dashboard', icon: <LayoutDashboard size={16} />, href: '/admin/dashboard' },
    { label: 'Live GPS Map', icon: <Map size={16} />, href: '/admin/live-map' },
    { label: 'Manage Fleet', icon: <Car size={16} />, href: '/admin/manage-fleet' },
    { label: 'Driver Approvals', icon: <FileCheck size={16} />, href: '/admin/approve-drivers' },
    { label: 'Rentals Monitor', icon: <Receipt size={16} />, href: '/admin/rentals' },
  ];

  return (
    <div className="relative min-h-screen bg-[#070a13] text-slate-100 overflow-x-hidden">
      
      {/* Floating CircleMenu Header Overlay */}
      <div className="fixed top-6 right-6 z-50">
        <CircleMenu items={menuItems} />
      </div>

      <div className="fixed top-8 left-8 z-50 flex items-center gap-2.5 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 shadow-xl">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-teal-400 to-indigo-600 flex items-center justify-center shadow-lg">
          <Shield className="w-3.5 h-3.5 text-black font-extrabold" />
        </div>
        <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Fleetly</span>
      </div>

      {/* SECTION 1: 3D Cube Poem Hero Section */}
      <section className="relative z-10">
        <PoemAnimation
          poemHTML={POEM_DATA.poemHTML}
          backgroundImageUrl={POEM_DATA.backgroundImageUrl}
          boyImageUrl={POEM_DATA.boyImageUrl}
        />
        
        {/* Helper bottom arrow indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 animate-bounce">
          <span className="text-[9px] font-bold text-teal-400 uppercase tracking-widest">Scroll to Expand Telemetry</span>
          <div className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
        </div>
      </section>

      {/* SECTION 2: Scroll Expansion Hero Showcase */}
      <section className="relative z-20 -mt-px">
        <ScrollExpandMedia
          mediaType="video"
          mediaSrc={SCROLL_MEDIA.src}
          posterSrc={SCROLL_MEDIA.poster}
          bgImageSrc={SCROLL_MEDIA.background}
          title={SCROLL_MEDIA.title}
          date={SCROLL_MEDIA.date}
          scrollToExpand={SCROLL_MEDIA.scrollToExpand}
          textBlend
        >
          {/* Children revealed once fully expanded */}
          <div className="space-y-24 bg-[#070a13]/90 backdrop-blur-lg pt-16 rounded-[3rem] border border-white/5 shadow-2xl relative z-10 max-w-7xl mx-auto -mt-32">
            
            {/* Expanded Content Sub-heading */}
            <div className="text-center space-y-4 px-6 max-w-2xl mx-auto">
              <span className="bg-teal-500/10 text-teal-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit border border-teal-500/20 shadow-md">
                Active Telemetry Hub
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none uppercase">
                Modern Operations Console
              </h2>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-semibold">
                Monitor node coordinates, toggle ignition keys, and approve return inspections through a streamlined operational dashboard.
              </p>
            </div>

            {/* SECTION 3: Feature Carousel Block */}
            <div className="relative">
              <FeatureCarousel />
            </div>

            {/* SECTION 4: Sparkles Pricing Grid Block */}
            <div id="pricing" className="relative scroll-mt-24">
              <PricingSection4 />
            </div>

            {/* SECTION 5: Text Hover Outline Footer */}
            <div className="relative">
              <HoverFooter />
            </div>

          </div>
        </ScrollExpandMedia>
      </section>

    </div>
  );
}
