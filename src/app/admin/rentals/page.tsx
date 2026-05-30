'use client';

import React, { useEffect, useState } from 'react';
import { DataSimulator, Rental, Vehicle, User } from '@/services/dataService';
import { 
  Receipt, 
  Car, 
  User as UserIcon, 
  DollarSign, 
  Calendar, 
  CheckSquare, 
  X, 
  Eye, 
  FileCheck,
  CreditCard,
  Gauge,
  HelpCircle,
  IndianRupee,
  CheckCircle,
  ShieldCheck
} from 'lucide-react';

export default function RentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Selected rental for return audit modal
  const [selectedRentalId, setSelectedRentalId] = useState<number | null>(null);
  const [enlargedPhoto, setEnlargedPhoto] = useState<string | null>(null);

  // Return Audit Checklist state
  const [checkBody, setCheckBody] = useState(false);
  const [checkOdo, setCheckOdo] = useState(false);
  const [checkFuel, setCheckFuel] = useState(false);
  const [checkPayment, setCheckPayment] = useState(false);

  useEffect(() => {
    // Sync states
    const unsubscribe = DataSimulator.subscribe(() => {
      setRentals(DataSimulator.getRentals());
      setVehicles(DataSimulator.getVehicles());
      setUsers(DataSimulator.getUsers());
    });

    setRentals(DataSimulator.getRentals());
    setVehicles(DataSimulator.getVehicles());
    setUsers(DataSimulator.getUsers());

    return () => unsubscribe();
  }, []);

  const handleApproveReturnSubmit = (rentalId: number) => {
    if (!checkBody || !checkOdo || !checkFuel || !checkPayment) {
      alert('Security Protocol: Please confirm all checklist inspections before final contract signoff.');
      return;
    }

    DataSimulator.approveReturn(rentalId);
    
    // Reset checklists & Close
    setCheckBody(false);
    setCheckOdo(false);
    setCheckFuel(false);
    setCheckPayment(false);
    setSelectedRentalId(null);
  };

  const getDriverName = (driverId: string) => {
    const u = users.find(user => user.id === driverId);
    return u ? u.name : 'Unknown Driver';
  };

  const getVehicleNumber = (vehicleId: number) => {
    const v = vehicles.find(veh => veh.id === vehicleId);
    return v ? v.vehicleNumber : 'Unknown Plate';
  };

  const selectedRental = rentals.find(r => r.id === selectedRentalId);

  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Active Rentals & Returns Monitor</h2>
        <p className="text-xs text-slate-400">Track active contracts, installments, and process post-rental vehicle inspection closures.</p>
      </div>

      {/* Visual Rentals Timeline Ledger */}
      <div className="grid grid-cols-1 gap-6">
        {rentals.length > 0 ? (
          rentals.map(r => {
            const driverName = getDriverName(r.driverId);
            const plateNumber = getVehicleNumber(r.vehicleId);
            
            // Calculate progress bar width
            const pctPaid = Math.round((Number(r.paid_amount) / Number(r.contract_total)) * 100);

            return (
              <div 
                key={r.id} 
                className={`glass-card p-6 rounded-2xl border transition-all duration-300 ${
                  r.status === 'AWAITING_RETURN_APPROVAL' 
                    ? 'border-orange-500/20 bg-orange-500/[0.02]' 
                    : r.status === 'CLOSED'
                      ? 'border-slate-800/80 bg-slate-950/20 opacity-60'
                      : 'border-white/5'
                }`}
              >
                
                {/* Contract Core Info Bar */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-slate-900">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <Receipt className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-sm font-bold text-white tracking-tight">Lease Agreement #{r.id}</h3>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded tracking-wider uppercase ${
                          r.status === 'ACTIVE'
                            ? 'bg-teal-500/10 border border-teal-500/20 text-teal-400 animate-pulse'
                            : r.status === 'AWAITING_RETURN_APPROVAL'
                              ? 'bg-orange-500/10 border border-orange-500/20 text-orange-400 animate-pulse'
                              : 'bg-slate-800 border border-slate-700 text-slate-500'
                        }`}>
                          {r.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block tracking-wider mt-1">
                        Driver: <strong className="text-white">{driverName}</strong> | Vehicle: <strong className="text-white">{plateNumber}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Operational actions for returning */}
                  {r.status === 'AWAITING_RETURN_APPROVAL' && (
                    <button
                      onClick={() => {
                        setSelectedRentalId(r.id);
                        setCheckBody(false);
                        setCheckOdo(false);
                        setCheckFuel(false);
                        setCheckPayment(false);
                      }}
                      className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-xs rounded-xl transition-all shadow-md shadow-orange-500/10 flex items-center gap-1.5 hover:scale-105 cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-black" />
                      <span>Audit Post-Rental Photos</span>
                    </button>
                  )}
                </div>

                {/* Ledger metrics details grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  
                  {/* Financial amounts ledger */}
                  <div className="space-y-3.5 p-4 bg-slate-950/40 rounded-xl border border-slate-900 md:col-span-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Ledger Financial Ledger</span>
                    
                    <div className="grid grid-cols-3 gap-2 text-center border-b border-slate-900 pb-3">
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Contract Val</span>
                        <span className="text-xs font-black text-white flex items-center justify-center mt-0.5">
                          <IndianRupee className="w-3 h-3 text-slate-500" />
                          {r.contract_total.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Paid In</span>
                        <span className="text-xs font-black text-teal-400 flex items-center justify-center mt-0.5">
                          <IndianRupee className="w-3 h-3 text-teal-500" />
                          {r.paid_amount.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Pending</span>
                        <span className="text-xs font-black text-red-400 flex items-center justify-center mt-0.5">
                          <IndianRupee className="w-3 h-3 text-red-500" />
                          {r.pending_amount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Lease Payment progress bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Cleared Balance Indicator</span>
                        <span className="font-bold text-teal-400">{pctPaid}% Paid</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-teal-500 transition-all duration-300"
                          style={{ width: `${pctPaid}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Lease terms options */}
                  <div className="space-y-3 p-4 bg-slate-950/40 rounded-xl border border-slate-900">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Agreement Terms</span>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Payment Plan:</span>
                        <span className="text-white font-semibold">{r.payment_plan}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Security Deposit:</span>
                        <span className="text-white font-bold flex items-center">
                          <IndianRupee className="w-3 h-3 text-slate-500" />
                          {r.deposit_amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Node Release:</span>
                        <span className="text-slate-300 font-medium">Automatic on Approval</span>
                      </div>
                    </div>
                  </div>

                  {/* Agreement Schedule dates */}
                  <div className="space-y-3 p-4 bg-slate-950/40 rounded-xl border border-slate-900">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Agreement Schedule</span>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Start Date:</span>
                        <span className="text-slate-300">{new Date(r.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Maturity Date:</span>
                        <span className="text-slate-300">{new Date(Date.now() + 14*24*60*60*1000).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Status Check:</span>
                        <span className="text-teal-400 font-bold uppercase tracking-wider text-[9px]">Verified</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            );
          })
        ) : (
          <div className="py-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2 border border-dashed border-slate-800 rounded-xl">
            <CheckCircle className="w-8 h-8 text-teal-400 opacity-60 animate-pulse" />
            <span className="text-xs">No lease agreements registered in database.</span>
          </div>
        )}
      </div>

      {/* Return Approval audit Modal */}
      {selectedRentalId !== null && selectedRental && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setSelectedRentalId(null)} />
          
          <div className="relative w-full max-w-4xl bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 flex flex-col max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-orange-400" />
                  <span>Interactive Post-Rental Vehicle Return Audit</span>
                </h3>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Agreement #{selectedRental.id} | Driver: {getDriverName(selectedRental.driverId)} | Plate: {getVehicleNumber(selectedRental.vehicleId)}
                </span>
              </div>
              
              <button 
                onClick={() => setSelectedRentalId(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-white/5 border border-white/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6 flex-1">
              
              {/* Left Column: Inspection photo grids */}
              <div className="lg:col-span-7 space-y-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Driver-Uploaded Vehicle Scans (5 angles)</span>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(selectedRental.photo_urls).map(([key, url]) => (
                    <div 
                      key={key} 
                      onClick={() => setEnlargedPhoto(url)}
                      className="group relative rounded-xl overflow-hidden border border-white/5 aspect-video bg-slate-950 hover:border-teal-500 transition-all cursor-zoom-in"
                    >
                      <img 
                        src={url} 
                        alt={`${key} inspection`} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-[10px] font-bold text-white uppercase tracking-wider">
                        Enlarge Angle
                      </div>
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-slate-900/80 backdrop-blur-md rounded border border-white/10 text-[9px] font-bold text-slate-300 uppercase tracking-wider">
                        {key}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-900/80 text-xs text-slate-400">
                  <span className="font-bold text-slate-300 block mb-1">Audit Guideline:</span>
                  Please check each visual image carefully to ensure no external dents, bumper damages, or panel cracks occurred. Odometer readings should perfectly match digital trackers.
                </div>
              </div>

              {/* Right Column: Checklist verification items */}
              <div className="lg:col-span-5 p-5 bg-slate-950/40 rounded-2xl border border-slate-900 flex flex-col justify-between gap-6">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">Inspection Checklist Checks</span>
                  
                  <div className="space-y-3.5">
                    
                    <label className="flex items-start gap-3 cursor-pointer group text-xs text-slate-300 hover:text-white">
                      <input 
                        type="checkbox" 
                        checked={checkBody}
                        onChange={e => setCheckBody(e.target.checked)}
                        className="mt-0.5 rounded border-slate-800 text-teal-500 bg-slate-950 focus:ring-teal-500/20"
                      />
                      <div>
                        <strong className="block font-bold text-white">Body Inspection Verified</strong>
                        <span className="text-[10px] text-slate-500">Confirm zero major scratches, dents, or broken elements.</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer group text-xs text-slate-300 hover:text-white">
                      <input 
                        type="checkbox" 
                        checked={checkOdo}
                        onChange={e => setCheckOdo(e.target.checked)}
                        className="mt-0.5 rounded border-slate-800 text-teal-500 bg-slate-950 focus:ring-teal-500/20"
                      />
                      <div>
                        <strong className="block font-bold text-white">Odometer Alignment Checked</strong>
                        <span className="text-[10px] text-slate-500">Verify speedometer photograph matches database logs.</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer group text-xs text-slate-300 hover:text-white">
                      <input 
                        type="checkbox" 
                        checked={checkFuel}
                        onChange={e => setCheckFuel(e.target.checked)}
                        className="mt-0.5 rounded border-slate-800 text-teal-500 bg-slate-950 focus:ring-teal-500/20"
                      />
                      <div>
                        <strong className="block font-bold text-white">Fuel / Energy Battery Verified</strong>
                        <span className="text-[10px] text-slate-500">Confirm battery is fully charged (or within return threshold).</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer group text-xs text-slate-300 hover:text-white">
                      <input 
                        type="checkbox" 
                        checked={checkPayment}
                        onChange={e => setCheckPayment(e.target.checked)}
                        className="mt-0.5 rounded border-slate-800 text-teal-500 bg-slate-950 focus:ring-teal-500/20"
                      />
                      <div>
                        <strong className="block font-bold text-white">Payment Installments Settled</strong>
                        <span className="text-[10px] text-slate-500">Confirm all pending lease invoices have successfully cleared.</span>
                      </div>
                    </label>

                  </div>
                </div>

                <div className="pt-4 border-t border-slate-900">
                  <div className="flex justify-between text-xs mb-3 text-slate-400">
                    <span>Release Deposit Refund:</span>
                    <strong className="text-white font-extrabold flex items-center">
                      <IndianRupee className="w-3.5 h-3.5 text-slate-500" />
                      {selectedRental.deposit_amount.toLocaleString()}
                    </strong>
                  </div>

                  <button
                    onClick={() => handleApproveReturnSubmit(selectedRental.id)}
                    className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      checkBody && checkOdo && checkFuel && checkPayment
                        ? 'bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 text-white shadow-md shadow-teal-500/10 hover:scale-[1.01]'
                        : 'bg-slate-800 text-slate-500 border border-slate-900 cursor-not-allowed'
                    }`}
                  >
                    <ShieldCheck className="w-4.5 h-4.5" />
                    <span>Approve Return & Release Vehicle</span>
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* Enlarged Photo Lightbox Overlay */}
      {enlargedPhoto && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setEnlargedPhoto(null)} />
          <div className="relative w-full max-w-3xl z-10 animate-fade-in-up">
            <button 
              onClick={() => setEnlargedPhoto(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-black/50 border border-white/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <img 
              src={enlargedPhoto} 
              alt="Enlarged inspection visual" 
              className="w-full h-auto max-h-[85vh] rounded-2xl object-contain shadow-2xl border border-white/10" 
            />
          </div>
        </div>
      )}

    </div>
  );
}
