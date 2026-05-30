'use client';

import React, { useEffect, useState } from 'react';
import { DataSimulator, Vehicle } from '@/services/dataService';
import { 
  Plus, 
  Search, 
  Filter, 
  Cpu, 
  Battery, 
  Signal, 
  SignalHigh, 
  Lock, 
  Unlock, 
  ChevronDown, 
  ChevronUp, 
  Car, 
  Trash2, 
  X,
  IndianRupee,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export default function ManageFleetPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [trackerFilter, setTrackerFilter] = useState('ALL');
  
  // Add vehicle modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [newPlate, setNewPlate] = useState('');
  const [newTrackerId, setNewTrackerId] = useState('');
  const [newRent, setNewRent] = useState(1500);
  const [formError, setFormError] = useState<string | null>(null);

  // Expandable rows state
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  // Command Lock loaders
  const [lockLoaders, setLockLoaders] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Sync state
    const unsubscribe = DataSimulator.subscribe(() => {
      setVehicles(DataSimulator.getVehicles());
    });

    setVehicles(DataSimulator.getVehicles());

    return () => unsubscribe();
  }, []);

  const toggleRow = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!newPlate || !newTrackerId || !newRent) {
      setFormError('Please fill out all required field slots.');
      return;
    }

    if (newPlate.trim().length < 5) {
      setFormError('Invalid License Plate registration format.');
      return;
    }

    // Add via simulator
    DataSimulator.addVehicle({
      vehicleNumber: newPlate.toUpperCase(),
      tracker_milli_id: newTrackerId.toUpperCase(),
      daily_rent: Number(newRent)
    });

    // Reset Form & Close
    setNewPlate('');
    setNewTrackerId('');
    setNewRent(1500);
    setModalOpen(false);
  };

  const handleToggleLock = (vehicleNumber: string) => {
    setLockLoaders(prev => ({ ...prev, [vehicleNumber]: true }));
    setTimeout(() => {
      DataSimulator.toggleIgnitionLock(vehicleNumber);
      setLockLoaders(prev => ({ ...prev, [vehicleNumber]: false }));
    }, 1000);
  };

  // Filter computation
  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.vehicleNumber.toLowerCase().includes(search.toLowerCase()) || 
                          v.tracker_milli_id.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
    const matchesTracker = trackerFilter === 'ALL' || v.tracker_status === trackerFilter;

    return matchesSearch && matchesStatus && matchesTracker;
  });

  return (
    <div className="space-y-6">
      
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Fleet Telemetry Database</h2>
          <p className="text-xs text-slate-400">Search, filter, inspect, and add vehicles in real time.</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-teal-500/10 flex items-center gap-1.5 hover:scale-105 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Fleet Vehicle</span>
        </button>
      </div>

      {/* Database Filters Console */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-slate-950/20 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
        
        {/* Search Input */}
        <div className="md:col-span-6 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by Plate Number or Tracker ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-800/80 focus:border-teal-500 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500 outline-none transition-all"
          />
        </div>

        {/* Status Dropdown */}
        <div className="md:col-span-3 flex items-center bg-slate-900/60 border border-slate-800/80 rounded-xl px-3 py-1">
          <Filter className="w-3.5 h-3.5 text-slate-500 mr-2 shrink-0" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full bg-transparent border-none text-xs text-slate-300 outline-none cursor-pointer py-1"
          >
            <option value="ALL" className="bg-slate-900">All Rentals</option>
            <option value="AVAILABLE" className="bg-slate-900">Available Only</option>
            <option value="ASSIGNED" className="bg-slate-900">Assigned Only</option>
            <option value="RENTED" className="bg-slate-900">Rented Only</option>
          </select>
        </div>

        {/* Tracker Dropdown */}
        <div className="md:col-span-3 flex items-center bg-slate-900/60 border border-slate-800/80 rounded-xl px-3 py-1">
          <Signal className="w-3.5 h-3.5 text-slate-500 mr-2 shrink-0" />
          <select
            value={trackerFilter}
            onChange={e => setTrackerFilter(e.target.value)}
            className="w-full bg-transparent border-none text-xs text-slate-300 outline-none cursor-pointer py-1"
          >
            <option value="ALL" className="bg-slate-900">All Trackers</option>
            <option value="ONLINE" className="bg-slate-900">Online Only</option>
            <option value="OFFLINE" className="bg-slate-900">Offline Only</option>
          </select>
        </div>

      </div>

      {/* Main Database Table */}
      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-950/20">
                <th className="py-4 px-6">Plate Number</th>
                <th className="py-4 px-4">Rental Status</th>
                <th className="py-4 px-4">Live Speed</th>
                <th className="py-4 px-4">Battery</th>
                <th className="py-4 px-4">Tracker status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-xs">
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map(v => {
                  const isExpanded = expandedRows.has(v.id);
                  const isLockedLoader = lockLoaders[v.vehicleNumber] || false;
                  
                  return (
                    <React.Fragment key={v.id}>
                      {/* Standard Row */}
                      <tr 
                        onClick={() => toggleRow(v.id)}
                        className={`hover:bg-white/[0.02] cursor-pointer transition-colors ${
                          isExpanded ? 'bg-white/[0.01]' : ''
                        }`}
                      >
                        <td className="py-4 px-6 font-bold text-white tracking-wide">
                          <div className="flex items-center gap-2">
                            <Car className="w-4 h-4 text-indigo-400 shrink-0" />
                            <span>{v.vehicleNumber}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase ${
                            v.status === 'AVAILABLE'
                              ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                              : v.status === 'RENTED'
                                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                          }`}>
                            {v.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-mono font-bold text-slate-300">
                          {v.speed} km/h
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1.5 font-medium text-slate-300">
                            <Battery className={`w-4.5 h-4.5 ${v.battery_level < 20 ? 'text-red-400 animate-bounce' : 'text-teal-400'}`} />
                            <span>{v.battery_level}%</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`flex items-center gap-1.5 text-[10px] font-bold ${
                            v.tracker_status === 'ONLINE' ? 'text-teal-400' : 'text-slate-500'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              v.tracker_status === 'ONLINE' ? 'bg-teal-400 animate-pulse' : 'bg-slate-600'
                            }`} />
                            <span>{v.tracker_status}</span>
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => toggleRow(v.id)}
                              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
                            >
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                            
                            <button
                              onClick={() => handleToggleLock(v.vehicleNumber)}
                              disabled={isLockedLoader}
                              className={`p-1.5 rounded-lg border cursor-pointer ${
                                v.tracker_status === 'ONLINE'
                                  ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20'
                                  : 'bg-teal-500/10 border-teal-500/20 text-teal-400 hover:bg-teal-500/20'
                              }`}
                              title={v.tracker_status === 'ONLINE' ? 'Send Ignition Lock' : 'Send Ignition Unlock'}
                            >
                              {isLockedLoader ? (
                                <div className="w-3.5 h-3.5 rounded-full border border-current border-t-transparent animate-spin" />
                              ) : v.tracker_status === 'ONLINE' ? (
                                <Lock className="w-3.5 h-3.5" />
                              ) : (
                                <Unlock className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Row Content */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={6} className="bg-slate-950/30 p-6 border-b border-slate-800/80">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {/* Left Panel: Tracker hardware IDs */}
                              <div className="space-y-3 p-4 bg-slate-950/40 rounded-xl border border-slate-900">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                  <Cpu className="w-3.5 h-3.5 text-teal-400" />
                                  <span>Tracker Signal Specifications</span>
                                </h4>
                                <div className="space-y-2 text-xs">
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Milli-Device ID:</span>
                                    <span className="font-mono text-white font-semibold">{v.tracker_milli_id}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Daily Lease Rate:</span>
                                    <span className="text-white font-bold flex items-center">
                                      <IndianRupee className="w-3 h-3 text-slate-500" />
                                      {v.daily_rent || 1500}/day
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Node Signal Sync:</span>
                                    <span className="text-teal-400 font-medium">98.4% Accuracy</span>
                                  </div>
                                </div>
                              </div>

                              {/* Center Panel: Location Coordinate metrics */}
                              <div className="space-y-3 p-4 bg-slate-950/40 rounded-xl border border-slate-900">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location Coordinates</h4>
                                <div className="space-y-2 text-xs">
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Latitude:</span>
                                    <span className="font-mono text-white">{v.latitude.toFixed(6)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Longitude:</span>
                                    <span className="font-mono text-white">{v.longitude.toFixed(6)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Last Telemetry Ping:</span>
                                    <span className="text-slate-300 font-semibold">{new Date(v.updated_at).toLocaleTimeString()}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Right Panel: Operations commands panel */}
                              <div className="space-y-3 p-4 bg-slate-950/40 rounded-xl border border-slate-900 flex flex-col justify-between">
                                <div>
                                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Supervisor Dispatch</h4>
                                  <p className="text-[10px] text-slate-500 leading-normal">
                                    Locking ignition shuts off fuel injector relays. Tracking signals will still sync.
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleToggleLock(v.vehicleNumber)}
                                  disabled={isLockedLoader}
                                  className={`w-full py-2.5 rounded-lg border font-bold text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                    v.tracker_status === 'ONLINE'
                                      ? 'bg-red-500/10 hover:bg-red-500/20 border-red-500/20 text-red-400'
                                      : 'bg-teal-500/10 hover:bg-teal-500/20 border-teal-500/20 text-teal-400'
                                  }`}
                                >
                                  {isLockedLoader ? (
                                    <div className="w-3.5 h-3.5 rounded-full border border-current border-t-transparent animate-spin" />
                                  ) : v.tracker_status === 'ONLINE' ? (
                                    <>
                                      <Lock className="w-3.5 h-3.5" />
                                      <span>Dispatch Ignition Lock</span>
                                    </>
                                  ) : (
                                    <>
                                      <Unlock className="w-3.5 h-3.5" />
                                      <span>Dispatch Ignition Unlock</span>
                                    </>
                                  )}
                                </button>
                              </div>

                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-medium">
                    No vehicles found matching the chosen search filter configurations.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Vehicle Glass Dialog Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          
          {/* Modal Panel */}
          <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl animate-fade-in-up z-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Car className="w-5 h-5 text-teal-400" />
                <span>Register New Fleet Vehicle</span>
              </h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-white/5 border border-white/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-start gap-1.5 animate-pulse">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  Registration Plate Number (eg. DL 1CA 8904)
                </label>
                <input
                  type="text"
                  placeholder="MH 12K 9988"
                  value={newPlate}
                  onChange={e => setNewPlate(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-teal-500 rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-600 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  Hardware Tracker Device ID (eg. TRK-410-99A)
                </label>
                <input
                  type="text"
                  placeholder="TRK-980-412M"
                  value={newTrackerId}
                  onChange={e => setNewTrackerId(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-teal-500 rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-600 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  Daily Rental Value (INR)
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-3 text-slate-500 text-xs font-bold">₹</div>
                  <input
                    type="number"
                    value={newRent}
                    onChange={e => setNewRent(Number(e.target.value))}
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-teal-500 rounded-xl py-2.5 pl-8 pr-4 text-xs text-white outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 justify-end border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-950 border border-slate-800 text-xs font-bold text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
