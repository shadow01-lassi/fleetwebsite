'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { DataSimulator, User, Vehicle } from '@/services/dataService';
import { 
  LayoutDashboard, 
  Map, 
  Car, 
  FileCheck, 
  Receipt, 
  LogOut, 
  Bell, 
  Clock, 
  Radio, 
  Menu, 
  X,
  User as UserIcon,
  Shield
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [alertsCount, setAlertsCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Protect route & load initial simulator states
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loggedUser = localStorage.getItem('fleetly_logged_user');
      if (!loggedUser) {
        router.push('/login');
        return;
      }
      setCurrentUser(JSON.parse(loggedUser));
    }

    // Subscribe to simulator updates
    const unsubscribe = DataSimulator.subscribe(() => {
      setVehicles(DataSimulator.getVehicles());
      setAlertsCount(DataSimulator.getAlerts().filter(a => a.status === 'UNREAD').length);
    });

    setVehicles(DataSimulator.getVehicles());
    setAlertsCount(DataSimulator.getAlerts().filter(a => a.status === 'UNREAD').length);

    // Dynamic Clock
    const timer = setInterval(() => {
      const date = new Date();
      setCurrentTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fleetly_logged_user');
    }
    router.push('/login');
  };

  const navItems = [
    { name: 'Executive Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Live GPS Telemetry', path: '/admin/live-map', icon: Map },
    { name: 'Fleet Management', path: '/admin/manage-fleet', icon: Car },
    { name: 'Driver Approvals', path: '/admin/approve-drivers', icon: FileCheck },
    { name: 'Rentals & Returns', path: '/admin/rentals', icon: Receipt },
  ];

  const onlineVehiclesCount = vehicles.filter(v => v.tracker_status === 'ONLINE').length;

  if (!currentUser) {
    return (
      <div className="w-full min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-teal-500/20 border-t-teal-500 animate-spin" />
          <span className="text-slate-400 text-xs tracking-wider">Establishing Encrypted Connection...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen bg-[#070a13] text-slate-100 overflow-hidden">
      
      {/* Sidebar Component: Large Screens */}
      <aside className="hidden lg:flex w-72 shrink-0 flex-col justify-between p-6 bg-slate-950/40 border-r border-slate-900 backdrop-blur-xl relative z-20">
        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-teal-500 to-indigo-500 pointer-events-none" />

        <div className="space-y-8">
          {/* Logo Brand Header */}
          <div className="flex items-center gap-3 pl-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Shield className="w-4 h-4 text-black font-extrabold" />
            </div>
            <div>
              <h4 className="font-bold text-white tracking-tight leading-none text-base">FLEETLY</h4>
              <span className="text-[10px] text-teal-400 tracking-wider font-semibold">ADMIN CENTER</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative group ${
                    isActive 
                      ? 'text-white bg-white/5 border border-white/5 shadow-md shadow-white/5' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-gradient-to-b from-teal-400 to-indigo-500" />
                  )}
                  <Icon className={`w-4.5 h-4.5 transition-all duration-300 ${isActive ? 'text-teal-400' : 'text-slate-500 group-hover:text-teal-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile & Logout */}
        <div className="space-y-4 pt-6 border-t border-slate-900">
          <div className="flex items-center gap-3 p-2 bg-slate-950/20 rounded-xl border border-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400/20 to-indigo-500/20 flex items-center justify-center border border-teal-500/30">
              <UserIcon className="w-5 h-5 text-teal-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-medium mt-0.5">Administrator</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/10 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Terminate System Link</span>
          </button>
        </div>
      </aside>

      {/* Sidebar Component: Mobile Screens */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          {/* Overlay background */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          
          <aside className="relative flex flex-col justify-between w-64 max-w-[80vw] h-full p-6 bg-slate-950/95 border-r border-slate-900 z-50">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-black font-extrabold text-sm">F</div>
                  <span className="font-bold text-white tracking-tight text-sm">FLEETLY</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-2">
                {navItems.map(item => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold ${
                        isActive 
                          ? 'text-white bg-white/5 border border-white/5' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-500'}`} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-900">
              <div className="flex items-center gap-3 p-2 bg-white/5 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center border border-teal-500/30">
                  <UserIcon className="w-4 h-4 text-teal-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/5 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Core View Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10 overflow-hidden">
        
        {/* Top Control Header Bar */}
        <header className="h-16 shrink-0 flex items-center justify-between px-6 bg-slate-950/20 border-b border-slate-900/60 backdrop-blur-md relative z-10">
          <div className="flex items-center gap-4">
            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Dashboard Context Title */}
            <h1 className="hidden sm:block text-sm font-bold text-white tracking-tight uppercase">
              {navItems.find(n => pathname === n.path)?.name || 'Fleet Center'}
            </h1>
          </div>

          {/* Telemetry Status Cluster */}
          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* Simulation Status Badge */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              <span className="text-[10px] text-teal-400 tracking-wider font-extrabold uppercase">SIMULATOR ACTIVE</span>
            </div>

            {/* Live GPS Signal Rate */}
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400">
              <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse-signal" />
              <span>Nodes: <strong className="text-white">{onlineVehiclesCount}/{vehicles.length}</strong> Online</span>
            </div>

            {/* Local Clock */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 border-l border-slate-900 pl-4 sm:pl-6">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-mono text-white tracking-widest">{currentTime || '00:00:00'}</span>
            </div>

            {/* Notification Alerts Dial */}
            <Link 
              href="/admin/dashboard" 
              className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/5"
            >
              <Bell className="w-4.5 h-4.5" />
              {alertsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-[#070a13]" />
              )}
            </Link>

          </div>
        </header>

        {/* Dashboard Child Viewport Container */}
        <main className="flex-1 overflow-y-auto relative p-6 sm:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}
