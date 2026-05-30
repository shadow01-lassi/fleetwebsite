'use client';

import React, { useEffect, useState } from 'react';
import { DataSimulator, User } from '@/services/dataService';
import { 
  FileCheck, 
  UserCheck, 
  UserX, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  FileText, 
  Mail, 
  Phone, 
  AlertTriangle,
  X,
  CheckCircle,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

type DocumentType = 'license' | 'pan' | 'bill';

export default function ApproveDriversPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<DocumentType>('license');
  const [zoomScale, setZoomScale] = useState(1);
  
  // Rejection Form State
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionFeedback, setRejectionFeedback] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    // Sync state
    const unsubscribe = DataSimulator.subscribe(() => {
      setUsers(DataSimulator.getUsers());
    });

    const initialUsers = DataSimulator.getUsers();
    setUsers(initialUsers);

    // Auto-select first pending driver if available
    const pendingDrivers = initialUsers.filter(u => u.role === 'DRIVER' && u.status === 'PENDING');
    if (pendingDrivers.length > 0 && !selectedUserId) {
      setSelectedUserId(pendingDrivers[0].id);
    }

    return () => unsubscribe();
  }, [selectedUserId]);

  const pendingDrivers = users.filter(u => u.role === 'DRIVER' && u.status === 'PENDING');
  const selectedUser = users.find(u => u.id === selectedUserId);

  const handleZoomIn = () => setZoomScale(prev => Math.min(2.5, prev + 0.25));
  const handleZoomOut = () => setZoomScale(prev => Math.max(0.5, prev - 0.25));
  const handleZoomReset = () => setZoomScale(1);

  const handleApproveDriver = (userId: string) => {
    DataSimulator.updateUserStatus(userId, 'APPROVED');
    // Clear selection or select next
    const nextPending = pendingDrivers.find(d => d.id !== userId);
    setSelectedUserId(nextPending ? nextPending.id : null);
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionFeedback.trim()) {
      setFormError('Please input feedback explaining the reason for rejection.');
      return;
    }

    if (selectedUserId) {
      DataSimulator.updateUserStatus(selectedUserId, 'REJECTED', rejectionFeedback.trim());
      // Clear selection or select next
      const nextPending = pendingDrivers.find(d => d.id !== selectedUserId);
      setSelectedUserId(nextPending ? nextPending.id : null);
      
      setRejectionFeedback('');
      setRejectionModalOpen(false);
      setFormError(null);
    }
  };

  const getDocumentUrl = (user: User, tab: DocumentType): string => {
    switch (tab) {
      case 'license': return user.license_url || 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=800&auto=format&fit=crop&q=80';
      case 'pan': return user.pan_card_url || 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=800&auto=format&fit=crop&q=80';
      case 'bill': return user.bill_url || 'https://images.unsplash.com/photo-1586075010923-2dd45e9b2d4f?w=800&auto=format&fit=crop&q=80';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Driver Verification Gateway</h2>
        <p className="text-xs text-slate-400">Perform real-time document audits and dispatch approvals.</p>
      </div>

      {/* Split Screen Queue Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-220px)]">
        
        {/* Left Side: Pending List Ledger */}
        <div className="lg:col-span-4 glass-card rounded-2xl border border-white/5 overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-950/20 border-b border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-bold text-white tracking-wider uppercase">Applicants Ledger</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
              {pendingDrivers.length} Pending
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50 max-h-[calc(100vh-280px)]">
            {pendingDrivers.length > 0 ? (
              pendingDrivers.map(d => {
                const isSelected = d.id === selectedUserId;
                return (
                  <div
                    key={d.id}
                    onClick={() => {
                      setSelectedUserId(d.id);
                      setZoomScale(1);
                      setActiveTab('license');
                    }}
                    className={`p-4 flex items-center gap-3 hover:bg-white/[0.02] cursor-pointer transition-all relative ${
                      isSelected ? 'bg-white/5' : ''
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-400 to-indigo-500" />
                    )}
                    
                    {/* Driver profile image or initials avatar */}
                    {d.profile_url ? (
                      <img 
                        src={d.profile_url} 
                        alt={d.name} 
                        className="w-10 h-10 rounded-full object-cover border border-slate-700/80" 
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300">
                        {d.name.charAt(0)}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{d.name}</p>
                      <span className="text-[10px] text-slate-500 truncate block mt-0.5">{d.email}</span>
                      <span className="text-[9px] text-slate-400 block mt-1">Submitted: 3 hrs ago</span>
                    </div>

                    <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-teal-400 translate-x-0.5' : 'text-slate-600'}`} />
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-500 h-full flex flex-col items-center justify-center gap-2">
                <CheckCircle className="w-8 h-8 text-teal-400 opacity-60 animate-pulse" />
                <span className="text-xs font-medium">All clear! No pending driver logs in the queue.</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Active Document Inspector Viewer */}
        <div className="lg:col-span-8 flex flex-col justify-between glass-card rounded-2xl border border-white/5 overflow-hidden min-h-[500px]">
          
          {selectedUser ? (
            <div className="flex flex-col flex-1">
              
              {/* Header card details */}
              <div className="p-4 bg-slate-950/20 border-b border-slate-800/80 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  {selectedUser.profile_url && (
                    <img 
                      src={selectedUser.profile_url} 
                      alt={selectedUser.name} 
                      className="w-11 h-11 rounded-full object-cover border border-slate-700" 
                    />
                  )}
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight leading-none">{selectedUser.name}</h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        <span>{selectedUser.email}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>{selectedUser.phone}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[10px] bg-orange-500/10 border border-orange-500/20 text-orange-400 px-3 py-1 rounded-lg font-bold uppercase tracking-wider">
                  <span>Review Status Required</span>
                </div>
              </div>

              {/* Document Selector Tabs Bar */}
              <div className="px-4 py-2 border-b border-slate-900 flex justify-between items-center bg-slate-950/10 flex-wrap gap-2">
                <div className="flex gap-1">
                  {(['license', 'pan', 'bill'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => {
                        setActiveTab(tab);
                        setZoomScale(1);
                      }}
                      className={`px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                        activeTab === tab 
                          ? 'bg-indigo-500 text-white shadow-md' 
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {tab === 'license' ? 'Driving License' : tab === 'pan' ? 'PAN Card' : 'Utility Bill'}
                    </button>
                  ))}
                </div>

                {/* Real-time zoom inspector controls */}
                <div className="flex items-center gap-2 bg-slate-950/40 border border-slate-800/80 px-2 py-1 rounded-xl">
                  <button 
                    onClick={handleZoomOut} 
                    className="p-1 hover:text-white text-slate-400 hover:bg-slate-800 rounded cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono text-slate-300 w-8 text-center">{Math.round(zoomScale * 100)}%</span>
                  <button 
                    onClick={handleZoomIn} 
                    className="p-1 hover:text-white text-slate-400 hover:bg-slate-800 rounded cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={handleZoomReset} 
                    className="p-1 hover:text-white text-slate-400 hover:bg-slate-800 rounded cursor-pointer border-l border-slate-800 pl-2"
                    title="Reset Zoom"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Central Zoom Viewport Area */}
              <div className="flex-1 min-h-[300px] bg-[#03060d] relative overflow-hidden flex items-center justify-center p-6">
                <div 
                  className="transition-transform duration-200 ease-out select-none cursor-grab"
                  style={{ transform: `scale(${zoomScale})` }}
                >
                  <img
                    src={getDocumentUrl(selectedUser, activeTab)}
                    alt={`${activeTab} document scan`}
                    className="max-h-[350px] max-w-full rounded-lg object-contain shadow-2xl border border-white/5 pointer-events-none"
                  />
                </div>
              </div>

              {/* Action Buttons Panel */}
              <div className="p-4 bg-slate-950/20 border-t border-slate-800/80 flex justify-between gap-4">
                <button
                  onClick={() => setRejectionModalOpen(true)}
                  className="px-5 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 text-red-400 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 hover:scale-[1.01] cursor-pointer"
                >
                  <UserX className="w-4 h-4" />
                  <span>Reject Documents</span>
                </button>

                <button
                  onClick={() => handleApproveDriver(selectedUser.id)}
                  className="px-5 py-3 bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-teal-500/10 flex items-center gap-1.5 hover:scale-[1.01] cursor-pointer"
                >
                  <UserCheck className="w-4 h-4 text-white" />
                  <span>Approve Driver Licence</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3 my-auto">
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                <FileText className="w-8 h-8 opacity-40 text-slate-400" />
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">Queue Verification Clear</h3>
              <p className="text-xs text-slate-400 max-w-xs leading-normal">
                Select an applicant from the ledger list on the left to initialize document inspect scans.
              </p>
            </div>
          )}

        </div>

      </div>

      {/* Rejection Modal Feedback Trigger */}
      {rejectionModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setRejectionModalOpen(false)} />
          
          <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl animate-fade-in-up z-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-400 animate-bounce" />
                <span>Submit Rejection Feedback</span>
              </h3>
              <button 
                onClick={() => setRejectionModalOpen(false)}
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

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  Rejection Reason for {selectedUser.name}
                </label>
                <textarea
                  placeholder="Example: The utility bill upload is blurry and unreadable. Please re-scan and upload a clear document image copy."
                  value={rejectionFeedback}
                  onChange={e => setRejectionFeedback(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-red-500 rounded-xl py-3 px-4 text-xs text-white placeholder-slate-600 outline-none transition-all resize-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4 justify-end border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setRejectionModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-950 border border-slate-800 text-xs font-bold text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
