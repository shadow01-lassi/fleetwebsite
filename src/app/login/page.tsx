'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PoemAnimation } from '@/components/ui/3d-animation';
import { DataSimulator } from '@/services/dataService';
import { Lock, Mail, AlertTriangle, ShieldCheck, Cpu } from 'lucide-react';

const ANIMATION_DATA = {
  poemHTML: `
    <p>The <span>love</span> between Ayla and Leo ignited in the old courtyard, each morning their swords clashed under dawn’s glow, faces streaked with <span>dust</span> and sweat; they <span>danced</span> between parries, every laugh a spark of joy against uncertain hearts. She stepped forward with <span>courage</span>, he met her gaze with open warmth, two souls seeking a shared <span>triumph</span> in their vulnerability. When blades slipped and one <span>faltered</span>, the other caught them—forearms brushing, pulses aligned in a daring heartbeat. In failure they found grace; in triumph they discovered unity. Each moment spent <span>daring</span> to trust the other built a bond impervious to fear. At dusk, they sheathed their swords, stepping from the <span>arena</span> hand in hand, knowing love blooms not through perfection, but by <span>daring greatly</span> together.</p>
  `,
  backgroundImageUrl: "https://i.ibb.co/q3XSxR9W/20250831-120144.jpg",
  boyImageUrl: "https://i.ibb.co/Y4FKvK38/20250831-113022.png"
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    // Dynamic delay for premium telemetry connection experience
    setTimeout(() => {
      // Direct validation
      if (!email || !password) {
        setErrorMsg('Please enter both email and password.');
        setLoading(false);
        return;
      }

      // Check users from our dynamic simulator
      const user = DataSimulator.getUsers().find(
        u => u.email.toLowerCase() === email.toLowerCase()
      );

      if (!user) {
        setErrorMsg('User not found. Try admin@fleetly.com');
        setLoading(false);
        return;
      }

      if (password !== 'admin123' && password !== 'admin') {
        setErrorMsg('Invalid password. Try admin123');
        setLoading(false);
        return;
      }

      // Role Gate Check
      if (user.role !== 'ADMIN') {
        setErrorMsg('Security Block: This account does not possess ADMIN authorization keys.');
        setLoading(false);
        return;
      }

      // Store auth session
      if (typeof window !== 'undefined') {
        localStorage.setItem('fleetly_logged_user', JSON.stringify(user));
      }

      // Redirect to Dashboard
      router.push('/admin/dashboard');
    }, 1200);
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background 3D Poem Animation */}
      <div className="absolute inset-0 z-0">
        <PoemAnimation
          poemHTML={ANIMATION_DATA.poemHTML}
          backgroundImageUrl={ANIMATION_DATA.backgroundImageUrl}
          boyImageUrl={ANIMATION_DATA.boyImageUrl}
        />
      </div>

      {/* Main Glassmorphic Wrapper */}
      <div className="relative z-10 w-full max-w-5xl mx-4 grid md:grid-cols-12 rounded-3xl overflow-hidden glass-panel shadow-2xl border border-white/10">
        
        {/* Left Side: Dynamic Statistics Snapshot */}
        <div className="hidden md:flex md:col-span-7 p-10 flex-col justify-between bg-slate-950/40 relative overflow-hidden border-r border-white/5">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-teal-500/10 pointer-events-none" />
          
          {/* Header */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Cpu className="w-5 h-5 text-black font-extrabold" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white">FLEETLY</span>
              <span className="text-xs block text-slate-400 tracking-widest uppercase font-semibold">Telemetry Systems</span>
            </div>
          </div>

          {/* Stats Snapshot Overlay */}
          <div className="space-y-6 my-auto">
            <h2 className="text-3xl font-extrabold tracking-tight text-white leading-snug">
              Executive Cloud Portal & Real-time GPS Tracker
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-md">
              Secure authentication gateway. Access active fleet configurations, coordinate trackers, remote ignition locks, and real-time document audits.
            </p>

            {/* Micro Stats Cards */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md">
                <div className="text-slate-400 text-xs font-medium uppercase tracking-wider">Active Fleet</div>
                <div className="text-2xl font-bold text-teal-400 mt-1">94.8%</div>
                <div className="text-[10px] text-slate-400 mt-0.5">5 Core Nodes Connected</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md">
                <div className="text-slate-400 text-xs font-medium uppercase tracking-wider">Telemetry Speed</div>
                <div className="text-2xl font-bold text-indigo-400 mt-1">62 km/h</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Average Live Motion</div>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Encrypted using Supabase Sec-Auth protocol</span>
          </div>
        </div>

        {/* Right Side: Secure Authentication Form */}
        <div className="col-span-12 md:col-span-5 p-8 sm:p-12 flex flex-col justify-center bg-slate-900/70 backdrop-blur-xl">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white tracking-tight">Admin Sign In</h3>
            <p className="text-xs text-slate-400 mt-1">Enter your administrative credentials to log in.</p>
          </div>

          {errorMsg && (
            <div className="p-3 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-2 items-start text-xs text-red-300 animate-pulse">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  placeholder="admin@fleetly.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-teal-500 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition-all focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Access Token
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-teal-500 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition-all focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/40 shadow-lg shadow-teal-500/10 flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              ) : (
                'Synchronize System Link'
              )}
            </button>
          </form>

          <div className="mt-8 text-center bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block font-medium">Demo Console Access:</span>
            <code className="text-[10px] text-teal-400 mt-1 block tracking-wider">
              Email: admin@fleetly.com | Pass: admin123
            </code>
          </div>
        </div>

      </div>
    </div>
  );
}
