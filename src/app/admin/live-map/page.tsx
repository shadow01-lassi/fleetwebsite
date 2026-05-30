'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { DataSimulator, Vehicle } from '@/services/dataService';
import { MapPin, Navigation } from 'lucide-react';

// Dynamically import Leaflet Map with no SSR to bypass Next.js compilation issues
const TelemetryMap = dynamic(() => import('@/components/map/TelemetryMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[calc(100vh-140px)] rounded-3xl bg-slate-950 flex flex-col items-center justify-center border border-slate-900 gap-3">
      <div className="relative flex items-center justify-center">
        <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-teal-500/20 opacity-75"></span>
        <div className="w-10 h-10 rounded-full border-4 border-teal-500/20 border-t-teal-500 animate-spin" />
      </div>
      <span className="text-slate-400 text-xs tracking-widest font-semibold uppercase">Loading Telemetry Grid...</span>
    </div>
  )
});

export default function LiveMapPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    // Subscribe to real-time coordinate updates
    const unsubscribe = DataSimulator.subscribe(() => {
      setVehicles(DataSimulator.getVehicles());
    });

    setVehicles(DataSimulator.getVehicles());

    return () => unsubscribe();
  }, []);

  const totalConnected = vehicles.filter(v => v.tracker_status === 'ONLINE').length;

  return (
    <div className="space-y-6">
      
      {/* Mini Title bar with map statistics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/30 p-4 rounded-2xl border border-white/5">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Navigation className="w-4 h-4 text-teal-400 animate-pulse-signal" />
            <span>Interactive Real-time GPS Telemetry Grid</span>
          </h2>
          <span className="text-[11px] text-slate-400 block mt-0.5">Active vehicles transmit speed, battery, and signal rates at 4-second intervals.</span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-1.5 bg-slate-900 rounded-xl border border-slate-800 text-slate-400">
            Node Sync: <strong className="text-teal-400">{totalConnected}</strong> / {vehicles.length} ONLINE
          </div>
        </div>
      </div>

      {/* Dynamic Leaflet Map Component container */}
      <div className="w-full">
        <TelemetryMap vehicles={vehicles} />
      </div>

    </div>
  );
}
