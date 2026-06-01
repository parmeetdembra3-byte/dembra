import React, { useState } from 'react';
import { CustomerOrder, DoctorAppointment, LabBooking, PrescriptionOrder } from '../types';
import { User, ClipboardList, Stethoscope, FlaskConical, FileCheck, Bookmark, Bell } from 'lucide-react';

interface ProfileProps {
  user: { name: string; phone: string; email: string };
  appointments: DoctorAppointment[];
  labBookings: LabBooking[];
  prescriptionOrders: PrescriptionOrder[];
  orders: CustomerOrder[];
}

export default function Profile({
  user,
  appointments,
  labBookings,
  prescriptionOrders,
  orders
}: ProfileProps) {
  const [activeHistoryTab, setActiveHistoryTab] = useState<'orders' | 'appointments' | 'labs' | 'prescriptions'>('orders');

  // Interactive Saved addresses in Pakistan
  const savedLocations = [
    { label: 'Primary DHA Residence', details: 'House 42B, Lane 5, DHA Phase 6, Karachi' },
    { label: 'Work Office (Gulberg)', details: 'Arfa Software Technology Park, Main Ferozepur Road, Lahore' }
  ];

  // Automated clinically integrated refill reminders
  const healthReminders = [
    { title: 'Refill Warning', desc: 'Risek 40mg (Gastro care) is estimated to empty in 3 days. Prepare refill order.', urgent: true },
    { title: 'Appointment Alert', desc: 'Prof Dr. Tariq Khan video consult scheduled for June 5 2026.', urgent: false },
    { title: 'Clinical Diagnostics reminder', desc: 'Fasting lipid biochemistry home sampling draw scheduled.', urgent: false }
  ];

  return (
    <div className="space-y-5 pb-20 select-none text-left font-sans">
      
      {/* Account Bio Header */}
      <div className="p-4 bg-white border border-slate-205 rounded-3xl flex gap-3 text-left shadow-sm">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-extrabold text-lg shrink-0 shadow-md shadow-blue-500/10">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="space-y-0.5">
          <h2 className="text-sm font-bold text-slate-800">{user.name}</h2>
          <p className="text-[10px] text-slate-500 font-mono font-bold">{user.phone} • {user.email}</p>
          <span className="inline-block px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-[8px] text-emerald-700 font-bold rounded-full uppercase tracking-wider">
            PATIENT INTEGRATED SECURE ACCOUNT
          </span>
        </div>
      </div>

      {/* Wellness and Clinical refill warnings */}
      <div className="space-y-2">
        <h3 className="text-[10px] font-bold text-slate-450 uppercase tracking-widest px-0.5 flex items-center gap-1">
          <Bell className="w-3.5 h-3.5 text-orange-500" />
          Medication refill reminders
        </h3>
        
        <div className="space-y-1.5">
          {healthReminders.map((rem, i) => (
            <div key={i} className={`p-2.5 rounded-xl border flex gap-2.5 text-xs ${
              rem.urgent 
                ? 'bg-red-50 border-red-200 text-slate-700' 
                : 'bg-white border-slate-200 text-slate-600 shadow-xs'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${rem.urgent ? 'bg-red-500' : 'bg-blue-500'}`} />
              <div>
                <strong className={`block uppercase tracking-wider text-[10px] ${rem.urgent ? 'text-red-700 font-bold' : 'text-slate-800 font-bold'}`}>{rem.title}</strong>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-normal font-medium">{rem.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab select for distinct clinical tracks: Purchases, Appointments, Labs audits, Prescriptions scans */}
      <div className="space-y-3 pt-1.5">
        <h3 className="text-[10px] font-bold text-slate-450 uppercase tracking-widest px-0.5">Health Records History</h3>
        
        {/* Filter buttons */}
        <div className="grid grid-cols-4 gap-1 border-b border-slate-150 pb-2">
          {[
            { id: 'orders', label: 'Meds', icon: ClipboardList },
            { id: 'appointments', label: 'Doctors', icon: Stethoscope },
            { id: 'labs', label: 'Labs', icon: FlaskConical },
            { id: 'prescriptions', label: 'Rx AI', icon: FileCheck }
          ].map(tab => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveHistoryTab(tab.id as any)}
              className={`py-1.5 rounded-xl text-[10px] font-extrabold flex flex-col items-center justify-center gap-1 transition cursor-pointer border ${
                activeHistoryTab === tab.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10'
                  : 'bg-white text-slate-500 border-slate-205 hover:bg-slate-50/50'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5 shrink-0" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab display boxes */}
        <div className="space-y-2">
          {activeHistoryTab === 'orders' && (
            <div className="space-y-2 animate-fade-in">
              {orders.length === 0 ? (
                <div className="text-xs text-slate-400 py-4 italic text-center font-bold">No medications checkout recorded.</div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="p-3 bg-white border border-slate-205 rounded-2xl flex justify-between items-center text-xs shadow-xs">
                    <div>
                      <span className="font-bold font-mono text-blue-600 text-[10px]">{order.id}</span>
                      <div className="text-slate-800 mt-0.5 font-bold">Rs. {order.total} • Verified order</div>
                      <div className="text-[10px] text-slate-400 font-bold font-mono">{order.date}</div>
                    </div>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[9px] rounded font-bold border border-blue-100">
                      {order.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeHistoryTab === 'appointments' && (
            <div className="space-y-2 animate-fade-in">
              {appointments.length === 0 ? (
                <div className="text-xs text-slate-400 py-4 italic text-center font-bold">No doctor appointments made.</div>
              ) : (
                appointments.map(apt => (
                  <div key={apt.id} className="p-3 bg-white border border-slate-205 rounded-2xl flex justify-between items-center text-xs shadow-xs">
                    <div>
                      <span className="font-bold font-mono text-blue-600 text-[10px]">{apt.id}</span>
                      <div className="font-bold text-slate-800 mt-0.5">{apt.doctorName}</div>
                      <div className="text-[10px] text-slate-400 font-mono font-bold">{apt.date} • {apt.timeSlot}</div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] rounded font-bold border border-emerald-100">
                      {apt.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeHistoryTab === 'labs' && (
            <div className="space-y-2 animate-fade-in">
              {labBookings.length === 0 ? (
                <div className="text-xs text-slate-400 py-4 italic text-center font-bold">No diagnostics scheduled.</div>
              ) : (
                labBookings.map(bk => (
                  <div key={bk.id} className="p-3 bg-white border border-slate-205 rounded-2xl flex justify-between items-center text-xs shadow-xs">
                    <div>
                      <span className="font-bold font-mono text-blue-600 text-[10px]">{bk.id}</span>
                      <div className="font-bold text-slate-800 mt-0.5">{bk.testName}</div>
                      <div className="text-[10px] text-slate-400 font-mono font-bold">{bk.date} • {bk.timeSlot}</div>
                    </div>
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-705 text-[9px] rounded font-bold border border-amber-100">
                      {bk.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeHistoryTab === 'prescriptions' && (
            <div className="space-y-2 animate-fade-in">
              {prescriptionOrders.length === 0 ? (
                <div className="text-xs text-slate-400 py-4 italic text-center font-bold">No AI scanned prescription orders.</div>
              ) : (
                prescriptionOrders.map(rx => (
                  <div key={rx.id} className="p-3 bg-white border border-slate-205 rounded-2xl flex justify-between items-center text-xs shadow-xs">
                    <div>
                      <span className="font-bold font-mono text-blue-600 text-[10px]">{rx.id}</span>
                      <div className="font-bold text-slate-800 mt-0.5">Scanned Rx Order (PKR {rx.totalPrice || 0})</div>
                      <div className="text-[10px] text-slate-400 font-mono font-bold">{rx.date}</div>
                    </div>
                    <span className={`px-2 py-0.5 text-[9px] rounded font-bold border ${
                      rx.status === 'Verified' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {rx.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Saved Shipment addresses */}
      <div className="space-y-2 pt-2">
        <h3 className="text-[10px] font-bold text-slate-450 uppercase tracking-widest px-0.5 flex items-center gap-1">
          <Bookmark className="w-3.5 h-3.5 text-blue-600" />
          Saved Delivery Coordinates
        </h3>
        <div className="space-y-1.5">
          {savedLocations.map((loc, idx) => (
            <div key={idx} className="p-3 bg-white border border-slate-205 rounded-2xl text-xs space-y-0.5 shadow-xs">
              <span className="font-bold text-slate-800">{loc.label}:</span>
              <p className="text-[10px] text-slate-500 leading-normal font-sans font-medium">{loc.details}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
