'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Vehicle, DataSimulator } from '@/services/dataService';
import { 
  Zap, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  MapPin, 
  Activity, 
  Info,
  Battery,
  AlertTriangle
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icon paths in next.js (even though we use divIcons, let's keep it safe)
delete (L.Icon.Default.prototype as any)._getIconUrl;

interface TelemetryMapProps {
  vehicles: Vehicle[];
  onSelectVehicle?: (vehicle: Vehicle) => void;
}

// Helper to keep map viewport centered on selected vehicle
function ChangeMapCenter({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, map.getZoom());
  }, [coords, map]);
  return null;
}

export default function TelemetryMap({ vehicles, onSelectVehicle }: TelemetryMapProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [lockedCommandLoading, setLockedCommandLoading] = useState(false);

  // Sync selected vehicle live state when the vehicles array updates in real time
  useEffect(() => {
    if (selectedVehicle) {
      const updated = vehicles.find(v => v.id === selectedVehicle.id);
      if (updated) {
        setSelectedVehicle(updated);
      }
    }
  }, [vehicles, selectedVehicle]);

  // Create highly beautiful customized glowing marker icons
  const createMarkerIcon = (status: Vehicle['status'], trackerStatus: Vehicle['tracker_status']) => {
    let colorClass = 'bg-teal-500';
    let ringColorClass = 'ring-teal-500/40';
    let pulseClass = 'animate-ping';

    if (trackerStatus === 'OFFLINE') {
      colorClass = 'bg-slate-600';
      ringColorClass = 'ring-slate-600/30';
      pulseClass = '';
    } else if (status === 'RENTED') {
      colorClass = 'bg-indigo-500';
      ringColorClass = 'ring-indigo-500/40';
    } else if (status === 'ASSIGNED') {
      colorClass = 'bg-orange-500';
      ringColorClass = 'ring-orange-500/40';
    }

    return L.divIcon({
      html: `
        <div class="relative flex items-center justify-center w-8 h-8">
          <span class="absolute inline-flex h-full w-full rounded-full ${ringColorClass} ${pulseClass} opacity-60"></span>
          <div class="relative w-4.5 h-4.5 rounded-full ${colorClass} border-2 border-[#070a13] flex items-center justify-center shadow-lg"></div>
        </div>
      `,
      className: 'custom-leaflet-icon',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  };

  const handleMarkerClick = (v: Vehicle) => {
    setSelectedVehicle(v);
    if (onSelectVehicle) onSelectVehicle(v);
  };

  const handleIgnitionLockToggle = (v: Vehicle) => {
    setLockedCommandLoading(true);
    setTimeout(() => {
      DataSimulator.toggleIgnitionLock(v.vehicleNumber);
      setLockedCommandLoading(false);
    }, 1000);
  };

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-140px)] rounded-3xl overflow-hidden border border-slate-900 shadow-2xl">
      
      {/* Real-time Leaflet Map Component */}
      <MapContainer 
        center={[28.5355, 77.2090]} // Centered in Delhi NCR area
        zoom={11} 
        zoomControl={false}
        className="w-full h-full z-0"
      >
        {/* Customized Dark Map Tiles (CartoDB Dark Matter) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {vehicles.map(v => (
          <Marker 
            key={v.id} 
            position={[v.latitude, v.longitude]} 
            icon={createMarkerIcon(v.status, v.tracker_status)}
            eventHandlers={{
              click: () => handleMarkerClick(v)
            }}
          />
        ))}

        {selectedVehicle && (
          <ChangeMapCenter coords={[selectedVehicle.latitude, selectedVehicle.longitude]} />
        )}
      </MapContainer>

      {/* Floating Telemetry Glass Panel Indicator */}
      <div className="absolute top-6 left-6 z-10 p-4 bg-slate-950/80 border border-white/10 rounded-2xl backdrop-blur-md max-w-xs shadow-xl pointer-events-none">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Map Telemetry Key</h4>
        <div className="space-y-2 text-[10px]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-teal-500 ring-2 ring-teal-500/20" />
            <span className="text-slate-300 font-semibold">Available Node (Pulsing)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-indigo-500 ring-2 ring-indigo-500/20" />
            <span className="text-slate-300 font-semibold">Active Rented Node (Pulsing)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-600" />
            <span className="text-slate-300 font-semibold">Node Offline / Tracker Down</span>
          </div>
        </div>
      </div>

      {/* Selected Vehicle Float Glass Modal overlay */}
      {selectedVehicle && (
        <div className="absolute bottom-6 right-6 z-10 w-full max-w-md mx-auto p-6 rounded-2xl border border-white/10 glass-panel shadow-2xl animate-fade-in-up duration-300">
          <div className="flex justify-between items-start gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white tracking-tight">{selectedVehicle.vehicleNumber}</h3>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded tracking-wider uppercase ${
                  selectedVehicle.tracker_status === 'ONLINE' 
                    ? 'bg-teal-500/10 border border-teal-500/20 text-teal-400' 
                    : 'bg-red-500/10 border border-red-500/20 text-red-400'
                }`}>
                  {selectedVehicle.tracker_status}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block tracking-wider mt-0.5">ID: {selectedVehicle.tracker_milli_id}</span>
            </div>

            <button 
              onClick={() => setSelectedVehicle(null)}
              className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-white/5 border border-white/5 rounded-lg cursor-pointer"
            >
              Close
            </button>
          </div>

          {/* Quick Metrics Cluster */}
          <div className="grid grid-cols-2 gap-4 mb-5 bg-slate-950/40 p-4 rounded-xl border border-slate-900">
            {/* Speedometer */}
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Digital Velocity</span>
              <div className="text-2xl font-extrabold text-teal-400 digital-glow flex items-baseline">
                {selectedVehicle.speed}
                <span className="text-xs text-slate-400 font-medium ml-1">km/h</span>
              </div>
            </div>

            {/* Battery status */}
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Battery Level</span>
              <div className={`text-xl font-bold flex items-center gap-1.5 mt-1 ${
                selectedVehicle.battery_level < 20 ? 'text-red-400' : 'text-teal-400'
              }`}>
                <Battery className={`w-4 h-4 ${selectedVehicle.battery_level < 20 ? 'animate-bounce' : ''}`} />
                <span>{selectedVehicle.battery_level}%</span>
              </div>
              
              {/* Battery visual bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                <div 
                  className={`h-full transition-all duration-300 ${
                    selectedVehicle.battery_level < 20 ? 'bg-red-500' : 'bg-teal-500'
                  }`}
                  style={{ width: `${selectedVehicle.battery_level}%` }}
                />
              </div>
            </div>
          </div>

          {/* Live Gps Lat/Long coordinate stamps */}
          <div className="space-y-2 mb-5">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>GPS Location (LAT/LONG)</span>
              </span>
              <span className="font-mono text-white">
                {selectedVehicle.latitude.toFixed(6)}, {selectedVehicle.longitude.toFixed(6)}
              </span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-slate-500 animate-pulse-signal" />
                <span>Latest Hardware Sync</span>
              </span>
              <span className="text-slate-300">
                {new Date(selectedVehicle.updated_at).toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* Action Triggers */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-900">
            <Link 
              href="/admin/rentals"
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-bold text-center text-slate-300 hover:text-white rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Rental Details</span>
            </Link>

            <button
              onClick={() => handleIgnitionLockToggle(selectedVehicle)}
              disabled={lockedCommandLoading}
              className={`px-4 py-2.5 rounded-xl border font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedVehicle.tracker_status === 'ONLINE'
                  ? 'bg-red-500/10 hover:bg-red-500/20 border-red-500/20 text-red-400'
                  : 'bg-teal-500/10 hover:bg-teal-500/20 border-teal-500/20 text-teal-400'
              }`}
            >
              {lockedCommandLoading ? (
                <div className="w-3.5 h-3.5 rounded-full border border-current border-t-transparent animate-spin" />
              ) : selectedVehicle.tracker_status === 'ONLINE' ? (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Lock Ignition</span>
                </>
              ) : (
                <>
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Unlock Ignition</span>
                </>
              )}
            </button>
          </div>

          {selectedVehicle.battery_level < 20 && (
            <div className="mt-3.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-2 items-start text-[10px] text-red-300 animate-pulse">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>Low battery threshold alert! Telemetry node is at {selectedVehicle.battery_level}%. Discretion advised.</span>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
