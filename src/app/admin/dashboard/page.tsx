'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DataSimulator, Vehicle, User, Rental, Alert } from '@/services/dataService';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  AlertOctagon, 
  Battery, 
  WifiOff, 
  Check, 
  Clock, 
  HelpCircle,
  IndianRupee,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function DashboardHub() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<User[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Sync states from data simulator
    const unsubscribe = DataSimulator.subscribe(() => {
      setVehicles(DataSimulator.getVehicles());
      setDrivers(DataSimulator.getUsers());
      setRentals(DataSimulator.getRentals());
      setAlerts(DataSimulator.getAlerts());
    });

    setVehicles(DataSimulator.getVehicles());
    setDrivers(DataSimulator.getUsers());
    setRentals(DataSimulator.getRentals());
    setAlerts(DataSimulator.getAlerts());

    return () => unsubscribe();
  }, []);

  const handleDismissAlert = (id: string) => {
    DataSimulator.markAlertAsRead(id);
  };

  // Metric Computations
  const totalVehiclesCount = vehicles.length;
  const onlineCount = vehicles.filter(v => v.tracker_status === 'ONLINE').length;
  const activeFleetPct = totalVehiclesCount > 0 ? Math.round((onlineCount / totalVehiclesCount) * 100) : 0;

  const rentedCount = vehicles.filter(v => v.status === 'RENTED').length;
  const availableCount = vehicles.filter(v => v.status === 'AVAILABLE').length;

  const pendingDriversCount = drivers.filter(d => d.role === 'DRIVER' && d.status === 'PENDING').length;

  const totalContractVal = rentals.reduce((acc, r) => acc + Number(r.contract_total), 0);
  const paidRevenue = rentals.reduce((acc, r) => acc + Number(r.paid_amount), 0);
  const securityDeposits = rentals.reduce((acc, r) => acc + Number(r.deposit_amount), 0);

  // High-fidelity analytics mock datasets
  const speedDistributionData = vehicles
    .filter(v => v.tracker_status === 'ONLINE' && v.speed > 0)
    .map(v => ({
      name: v.vehicleNumber,
      speed: v.speed,
      battery: v.battery_level
    }));

  const transactionData = [
    { day: 'Mon', rentals: 14, revenue: 15400 },
    { day: 'Tue', rentals: 18, revenue: 19800 },
    { day: 'Wed', rentals: 15, revenue: 17200 },
    { day: 'Thu', rentals: 22, revenue: 26400 },
    { day: 'Fri', rentals: 29, revenue: 34800 },
    { day: 'Sat', rentals: 35, revenue: 42000 },
    { day: 'Sun', rentals: 28, revenue: 31200 },
  ];

  // Dynamic SVG Circular progress math
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (activeFleetPct / 100) * circumference;

  return (
    <div className="space-y-8">
      
      {/* Executive KPI Statistics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1: Active Telemetry Fleet */}
        <div className="glass-card p-6 rounded-2xl flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Active Fleet Link</span>
            <div className="text-3xl font-extrabold text-white tracking-tight">
              {onlineCount} <span className="text-sm font-semibold text-slate-500">/ {totalVehiclesCount} Nodes</span>
            </div>
            <p className="text-xs text-slate-400">Live hardware signal sync</p>
          </div>
          
          {/* Circular Progress Gauge */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="w-20 h-20 transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="40"
                cy="40"
                r={radius}
                className="stroke-teal-500 transition-all duration-1000 ease-out"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-xs font-black text-teal-400">{activeFleetPct}%</span>
          </div>
        </div>

        {/* KPI 2: Available vs Rented Cars Ratio */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Fleet Availability</span>
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-xs text-slate-400">Rented vs Available</span>
              <span className="text-base font-extrabold text-white">{rentedCount} R / {availableCount} A</span>
            </div>
            {/* Custom Ratio Slider */}
            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
              <div 
                className="h-full bg-indigo-500 transition-all duration-500" 
                style={{ width: `${totalVehiclesCount > 0 ? (rentedCount / totalVehiclesCount) * 100 : 50}%` }}
                title="Rented"
              />
              <div 
                className="h-full bg-teal-500 transition-all duration-500" 
                style={{ width: `${totalVehiclesCount > 0 ? (availableCount / totalVehiclesCount) * 100 : 50}%` }}
                title="Available"
              />
            </div>
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium pt-2">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span>Rented ({rentedCount})</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              <span>Available ({availableCount})</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Global Revenue Ledger */}
        <div className="glass-card p-6 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Accumulated Income</span>
            <div className="text-2xl font-black text-white tracking-tight flex items-center">
              <IndianRupee className="w-4 h-4 text-teal-400 mr-0.5" />
              {paidRevenue.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] block text-indigo-400 font-semibold tracking-wider">
              Deposit Locked: ₹{securityDeposits.toLocaleString('en-IN')}
            </span>
            <p className="text-[10px] text-slate-400">Total contracts: ₹{totalContractVal.toLocaleString('en-IN')}</p>
          </div>
          <div className="w-11 h-11 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 4: Pending Driver Approval Queue */}
        <Link href="/admin/approve-drivers" className="glass-card p-6 rounded-2xl flex items-center justify-between hover:scale-[1.01] transition-all cursor-pointer group">
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Driver Verification</span>
            <div className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              {pendingDriversCount}
              {pendingDriversCount > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400 animate-pulse">
                  Action Req.
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1 group-hover:text-teal-400 transition-colors">
              <span>View inspector queue</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </p>
          </div>
          <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
            pendingDriversCount > 0 
              ? 'bg-orange-500/10 border border-orange-500/20 text-orange-400' 
              : 'bg-slate-800 text-slate-400'
          }`}>
            <Users className="w-5 h-5" />
          </div>
        </Link>

      </div>

      {/* Graphs & Analytics Cluster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Graph 1: Speed Telemetry */}
        <div className="glass-card p-6 rounded-2xl lg:col-span-8 flex flex-col justify-between min-h-[380px]">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Active Live Speed Telemetry</h3>
                <span className="text-xs text-slate-400 block">Real-time GPS tracker velocities and battery metrics</span>
              </div>
              <div className="flex items-center gap-2 text-xs bg-slate-950/40 px-3 py-1.5 rounded-lg border border-slate-900">
                <Zap className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-slate-300 font-semibold">Live Feed</span>
              </div>
            </div>

            <div className="w-full h-64">
              {speedDistributionData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={speedDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="speedColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="batteryColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                        borderColor: 'rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                        color: '#f8fafc'
                      }} 
                    />
                    <Area type="monotone" dataKey="speed" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#speedColor)" name="Speed (km/h)" />
                    <Area type="monotone" dataKey="battery" stroke="#0d9488" strokeWidth={2.5} fillOpacity={1} fill="url(#batteryColor)" name="Battery %" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-2 border border-dashed border-slate-800 rounded-xl">
                  <WifiOff className="w-8 h-8 opacity-40 text-slate-400" />
                  <span className="text-xs">No active nodes currently moving</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Graph 2: Financial Transactions */}
        <div className="glass-card p-6 rounded-2xl lg:col-span-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight mb-1">Weekly Financial Summary</h3>
            <span className="text-xs text-slate-400 block mb-6">Revenue and contract volume over 7 days</span>
            
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={transactionData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      borderColor: 'rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                      color: '#f8fafc'
                    }} 
                  />
                  <Bar dataKey="revenue" fill="#38bdf8" radius={[4, 4, 0, 0]} name="Revenue (₹)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

      {/* Telemetry Alerts Logs */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Active Telemetry Alerts</h3>
            <span className="text-xs text-slate-400 block">Critical tracker warnings requiring supervisor operations</span>
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3 py-1 bg-slate-950/40 rounded-lg border border-slate-900">
            {alerts.filter(a => a.status === 'UNREAD').length} Alerts Open
          </div>
        </div>

        {alerts.length > 0 ? (
          <div className="divide-y divide-slate-800/60 max-h-[300px] overflow-y-auto pr-2">
            {alerts.map(alert => {
              const isUnread = alert.status === 'UNREAD';
              return (
                <div 
                  key={alert.id} 
                  className={`py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4 transition-all duration-300 ${
                    isUnread ? 'opacity-100' : 'opacity-50'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Alert Type Icons */}
                    <div className={`p-2.5 rounded-xl mt-0.5 shrink-0 border ${
                      alert.type === 'LOW_BATTERY' 
                        ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                        : alert.type === 'OFFLINE_TRACKER' 
                          ? 'bg-slate-800 border-slate-700 text-slate-400' 
                          : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                    }`}>
                      {alert.type === 'LOW_BATTERY' ? (
                        <Battery className="w-4 h-4 animate-bounce" />
                      ) : alert.type === 'OFFLINE_TRACKER' ? (
                        <WifiOff className="w-4 h-4" />
                      ) : (
                        <AlertOctagon className="w-4 h-4" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <h4 className="text-sm font-bold text-white tracking-tight">{alert.title}</h4>
                        <span className="text-[10px] font-mono text-slate-500 tracking-wider">
                          {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">{alert.message}</p>
                    </div>
                  </div>

                  {/* Operational Dismiss Trigger */}
                  {isUnread ? (
                    <button
                      onClick={() => handleDismissAlert(alert.id)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-teal-600 border border-slate-700/80 hover:border-teal-500 text-[10px] font-bold text-slate-300 hover:text-white rounded-lg transition-all flex items-center gap-1 hover:scale-105 cursor-pointer"
                    >
                      <Check className="w-3 h-3" />
                      <span>Dismiss Log</span>
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider flex items-center gap-1 px-3 py-1.5 border border-slate-900 bg-slate-950/40 rounded-lg">
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
                      <span>Audited</span>
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center text-slate-500 flex flex-col items-center justify-center gap-2 border border-dashed border-slate-800 rounded-xl">
            <ShieldCheck className="w-8 h-8 text-teal-400 opacity-60 animate-pulse" />
            <span className="text-xs">All vehicle telemetry systems functioning perfectly.</span>
          </div>
        )}
      </div>

    </div>
  );
}
