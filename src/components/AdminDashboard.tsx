import React, { useState } from 'react';
import { Medicine, CustomerOrder, DoctorAppointment, LabBooking, PrescriptionOrder } from '../types';
import { MEDICINE_CATALOG } from '../data';
import { 
  Boxes, 
  Layers, 
  Stethoscope, 
  FlaskConical, 
  ClipboardList, 
  Sparkles, 
  CheckCircle, 
  Ban, 
  Edit, 
  TrendingUp, 
  Activity, 
  Users, 
  DollarSign, 
  Plus, 
  X,
  UserCheck
} from 'lucide-react';

interface AdminDashboardProps {
  medicines: Medicine[];
  orders: CustomerOrder[];
  appointments: DoctorAppointment[];
  labBookings: LabBooking[];
  prescriptionOrders: PrescriptionOrder[];
  onUpdateMedicineStock: (medicineId: string, newStock: number) => void;
  onUpdateMedicinePrice: (medicineId: string, newPrice: number) => void;
  onVerifyPrescriptionOrder: (orderId: string, verifiedMedicines: any[], notes: string) => void;
  onUpdateOrderStatus: (orderId: string, status: CustomerOrder['status']) => void;
  onUpdateAppointmentStatus: (aptId: string, status: DoctorAppointment['status']) => void;
  onUpdateLabStatus: (bookingId: string, status: LabBooking['status']) => void;
}

export default function AdminDashboard({
  medicines,
  orders,
  appointments,
  labBookings,
  prescriptionOrders,
  onUpdateMedicineStock,
  onUpdateMedicinePrice,
  onVerifyPrescriptionOrder,
  onUpdateOrderStatus,
  onUpdateAppointmentStatus,
  onUpdateLabStatus
}: AdminDashboardProps) {
  
  const [activeAdminTab, setActiveAdminTab] = useState<'revenue' | 'inventory' | 'prescriptions' | 'orders' | 'appointments' | 'labs'>('revenue');
  
  // Stock edit states
  const [editingMedicineId, setEditingMedicineId] = useState<string | null>(null);
  const [tempStockValue, setTempStockValue] = useState<number>(0);
  const [tempPriceValue, setTempPriceValue] = useState<number>(0);

  // Active prescription edit
  const [selectedReviewRx, setSelectedReviewRx] = useState<PrescriptionOrder | null>(null);
  const [rxNotes, setRxNotes] = useState('');

  // Calculate general stats
  const totalMedOrdersRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const totalDocRevenue = appointments.filter(a => a.status === 'Confirmed' || a.status === 'Completed').reduce((acc, a) => acc + a.fee, 0);
  const totalLabRevenue = labBookings.reduce((acc, l) => acc + l.price, 0);
  const grossRevenue = totalMedOrdersRevenue + totalDocRevenue + totalLabRevenue;

  const pendingPrescriptionsCount = prescriptionOrders.filter(p => p.status === 'Pending Verification').length;

  // Visual SVG analytics chart metrics (Simulates weekly sales PKR logs)
  const SALES_LOGS_SIMULATED = [
    { day: 'Mon', revenue: 45000 },
    { day: 'Tue', revenue: 78000 },
    { day: 'Wed', revenue: 62000 },
    { day: 'Thu', revenue: 95000 },
    { day: 'Fri', revenue: 84000 },
    { day: 'Sat', revenue: 110000 },
    { day: 'Sun', revenue: 140000 }
  ];

  const maxRevenueSim = 150000;

  const handleUpdateStockPrice = (medId: string) => {
    onUpdateMedicineStock(medId, tempStockValue);
    onUpdateMedicinePrice(medId, tempPriceValue);
    setEditingMedicineId(null);
  };

  const handleApprovePrescription = (rxId: string) => {
    if (!selectedReviewRx) return;
    onVerifyPrescriptionOrder(
      rxId, 
      selectedReviewRx.detectedMedicines || [], 
      rxNotes || 'Verified and mapped by licensed pharmacist on duty.'
    );
    setSelectedReviewRx(null);
    alert('Prescription order approved and status updated to "Verified" instantly on patient tracker!');
  };

  return (
    <div className="space-y-6 pb-24 text-left select-none text-slate-700 animate-fade-in font-sans">
      
      {/* Intro header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-slate-200 pb-3 gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-1.5 leading-snug uppercase tracking-tight">
            <UserCheck className="w-5.5 h-5.5 text-blue-600" />
            SHRIDI WALA MEDICOS – Operational Dashboard
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Unified management node for Pakistani Clinical Pharmacists, Doctors scheduling, and Lab collection draws.
          </p>
        </div>
        <span className="px-3 py-1 bg-blue-50 border border-blue-200 text-[10px] text-blue-700 font-bold rounded-lg font-mono tracking-wider uppercase shrink-0">
          ● Live Enterprise connection • Online
        </span>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white border border-slate-205 rounded-2xl p-4 text-left space-y-1 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-500/5 rounded-full blur-lg" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Gross Revenue</span>
          <div className="text-lg font-mono font-extrabold text-blue-800">Rs. {grossRevenue}</div>
          <p className="text-[9px] text-slate-450 font-semibold font-sans mt-0.5">Meds + Doctor + Lab panels</p>
        </div>

        <div className="bg-white border border-slate-205 rounded-2xl p-4 text-left space-y-1 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-12 h-12 bg-blue-500/5 rounded-full blur-lg" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Completed checkouts</span>
          <div className="text-lg font-mono font-extrabold text-blue-800">{orders.length}</div>
          <p className="text-[9px] text-slate-450 font-semibold font-sans mt-0.5">Ready for packed / transit</p>
        </div>

        <div className="bg-white border border-slate-205 rounded-2xl p-4 text-left space-y-1 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-12 h-12 bg-amber-500/5 rounded-full blur-lg" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending Rx Scans</span>
          <div className="text-lg font-mono font-extrabold text-amber-600 animate-pulse">{pendingPrescriptionsCount}</div>
          <p className="text-[9px] text-slate-450 font-semibold font-sans mt-0.5">Vetting queue for pharmacists</p>
        </div>

        <div className="bg-white border border-slate-205 rounded-2xl p-4 text-left space-y-1 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-12 h-12 bg-sky-500/5 rounded-full blur-lg" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active appointments</span>
          <div className="text-lg font-mono font-extrabold text-blue-800">{appointments.length + labBookings.length}</div>
          <p className="text-[9px] text-slate-450 font-semibold font-sans mt-0.5">Doctor + Draw bookings</p>
        </div>
      </div>

      {/* Horizontal Tab control bar */}
      <div className="flex gap-1.5 overflow-x-auto border-b border-slate-200 pb-3 scrollbar-thin scrollbar-thumb-slate-205">
        {[
          { id: 'revenue', label: 'Gross Analytics', icon: TrendingUp },
          { id: 'inventory', label: 'Medicine Stocks', icon: Boxes },
          { id: 'prescriptions', label: `Rx verification Queue (${pendingPrescriptionsCount})`, icon: Sparkles },
          { id: 'orders', label: `Meds checkout (${orders.length})`, icon: ClipboardList },
          { id: 'appointments', label: `Doctor slots (${appointments.length})`, icon: Stethoscope },
          { id: 'labs', label: `Lab samples (${labBookings.length})`, icon: FlaskConical }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveAdminTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap shrink-0 transition flex items-center gap-1.5 cursor-pointer border ${
              activeAdminTab === tab.id
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/15'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-350'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5 shrink-0" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="space-y-4">
        
        {/* Panel 1: Analytics Bar chart */}
        {activeAdminTab === 'revenue' && (
          <div className="bg-white border border-slate-205 rounded-3xl p-5 space-y-5 text-left shadow-sm animate-fade-in">
            <div className="flex justify-between items-center pb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Weekly Revenue Flow</h3>
                <p className="text-xs text-slate-500 font-medium">Representing gross earnings in PKR across both checkouts & appointments</p>
              </div>
              <TrendingUp className="w-5 h-5 text-green-600 shrink-0" />
            </div>

            {/* Custom SVG responsive chart */}
            <div className="space-y-3.5">
              <div className="h-44 flex items-end justify-between gap-3 pt-4 border-b border-slate-150 font-mono">
                {SALES_LOGS_SIMULATED.map((bar, idx) => {
                  const percentage = (bar.revenue / maxRevenueSim) * 100;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative">
                      {/* Price indicator tooltip */}
                      <span className="opacity-0 group-hover:opacity-100 absolute -top-5 bg-slate-900 text-[9px] font-mono font-bold text-white px-1.5 py-0.5 rounded transition shadow z-10">
                        Rs. {bar.revenue}
                      </span>
                      {/* Bar columns */}
                      <div 
                        className="w-full bg-gradient-to-t from-blue-700 via-sky-600 to-emerald-500 rounded-t-lg transition-all duration-700 hover:opacity-90" 
                        style={{ height: `${percentage}%` }}
                      />
                      <span className="text-[10px] text-slate-400 mt-2 font-mono uppercase font-semibold">{bar.day}</span>
                    </div>
                  );
                })}
              </div>

              {/* Chart Meta indicators */}
              <div className="grid grid-cols-3 gap-3 text-center pt-2 font-mono">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">Meds checkout earnings</span>
                  <span className="text-xs font-bold text-slate-800">PKR {totalMedOrdersRevenue}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">Doctor clinic bookings</span>
                  <span className="text-xs font-bold text-slate-800">PKR {totalDocRevenue}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">Lab draw earnings</span>
                  <span className="text-xs font-bold text-slate-800">PKR {totalLabRevenue}</span>
                </div>
              </div>
            </div>
          </div>
        )}
              {/* Panel 2: Inventory adjustment */}
        {activeAdminTab === 'inventory' && (
          <div className="space-y-3.5 animate-fade-in font-sans">
            <div className="flex justify-between items-center px-1">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Pharmaceutical Stock manager</h3>
                <p className="text-[11px] text-slate-500 font-medium">Calibrate price structures and replenishment indexes for Pakistani medicines.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {medicines.map(med => (
                <div key={med.id} className="p-3.5 bg-white border border-slate-205 rounded-2xl flex justify-between items-center text-xs shadow-sm">
                  <div className="space-y-1 max-w-[60%]">
                    <div className="font-bold text-slate-800">{med.name}</div>
                    <div className="text-[10px] font-mono text-slate-500 font-medium">
                      ID: {med.id} • Brand: {med.brand}
                    </div>
                    <div className="flex gap-2 text-[10px]">
                      <span className="text-slate-500 font-mono">Stock: <span className={`font-bold ${med.stock <= 15 ? 'text-amber-600 animate-pulse' : 'text-slate-600'}`}>{med.stock} units</span></span>
                      <span className="text-slate-500 font-mono">Retail Price: <span className="font-bold text-blue-600">Rs. {med.price}</span></span>
                    </div>
                  </div>

                  {editingMedicineId === med.id ? (
                    <div className="flex gap-2 items-center">
                      <div className="flex flex-col gap-1">
                        <input
                          type="number"
                          placeholder="Stock"
                          className="w-16 bg-slate-50 border border-slate-205 rounded px-1.5 py-1 text-center font-mono font-bold text-slate-800"
                          value={tempStockValue}
                          onChange={(e) => setTempStockValue(parseInt(e.target.value) || 0)}
                        />
                        <input
                          type="number"
                          placeholder="Price"
                          className="w-16 bg-slate-50 border border-slate-205 rounded px-1.5 py-1 text-center font-mono font-bold text-emerald-600"
                          value={tempPriceValue}
                          onChange={(e) => setTempPriceValue(parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleUpdateStockPrice(med.id)}
                          className="px-2.5 py-1 bg-green-600 text-white font-bold text-[10px] rounded cursor-pointer transition hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingMedicineId(null)}
                          className="px-2.5 py-1 bg-slate-100 text-slate-500 font-bold text-[10px] rounded border border-slate-200 cursor-pointer hover:bg-slate-200"
                        >
                          X
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingMedicineId(med.id);
                        setTempStockValue(med.stock);
                        setTempPriceValue(med.price);
                      }}
                      className="px-3.5 py-1.5 bg-slate-50 text-slate-600 rounded-xl border border-slate-200 font-bold hover:bg-slate-100 hover:text-slate-900 transition flex items-center gap-1 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5 text-blue-600" /> Adjust Spec
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Panel 3: AI Prescription verification queue */}
        {activeAdminTab === 'prescriptions' && (
          <div className="space-y-3.5 animate-fade-in font-sans">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Patient Prescription verification queue</h3>
              <p className="text-[11px] text-slate-500 font-medium font-medium">Review image segments parsed by AI. Validate medicine matches before approving patient checkouts.</p>
            </div>

            {prescriptionOrders.filter(p => p.status === 'Pending Verification').length === 0 ? (
              <div className="p-8 bg-white border border-slate-205 rounded-3xl text-center italic text-xs text-slate-500 shadow-sm">
                Excellent! All pending prescription upload sweeps verified. Queue clear.
              </div>
            ) : (
              prescriptionOrders.filter(p => p.status === 'Pending Verification').map(rx => (
                <div key={rx.id} className="p-4 bg-white border border-slate-205 rounded-3xl space-y-3.5 shadow-sm">
                  <div className="flex justify-between items-center text-xs border-b border-slate-150 pb-2">
                    <div>
                      <span className="font-bold text-slate-800 block text-xs">Queue ID: {rx.id}</span>
                      <span className="text-[10px] text-slate-400 font-mono font-bold">Placed on: {rx.date}</span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedReviewRx(rx);
                        setRxNotes(rx.pharmacistNotes || '');
                      }}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition cursor-pointer"
                    >
                      Audit Prescription
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">AI Suggested Mapping:</span>
                    {rx.detectedMedicines?.map((med, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200 px-3 font-semibold">
                        <span>{med.name}</span>
                        <span className="font-mono text-slate-500 font-semibold">{med.dosage} (x{med.quantity})</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}

            {/* Audit review overlay modal */}
            {selectedReviewRx && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                <div className="bg-white border border-slate-205 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl relative text-left">
                  <button
                    onClick={() => setSelectedReviewRx(null)}
                    className="absolute top-4 right-4 p-1 rounded-full bg-slate-50 text-slate-400 hover:text-slate-800 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="border-b border-slate-150 pb-2.5">
                    <span className="text-[9px] font-mono text-blue-600 font-bold uppercase tracking-widest">Active Pharmacist Review Audit</span>
                    <h3 className="text-sm font-bold text-slate-850">Vetting Prescription Order {selectedReviewRx.id}</h3>
                  </div>

                  {/* Scanned Doc Image Preview if available */}
                  <div className="h-28 bg-slate-50 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center relative">
                    <img src={selectedReviewRx.imageUrl} className="max-h-full object-contain" alt="Rx Scanned" />
                    <span className="absolute bottom-1 right-2 text-[8px] font-mono text-slate-500 bg-white border border-slate-200 px-1 py-0.5 rounded font-bold">Scanned Image Payload</span>
                  </div>

                  {/* Scanned Medicines review */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Formulations list:</span>
                    <div className="max-h-28 overflow-y-auto space-y-1.5 bg-slate-50 p-2 rounded-xl border border-slate-150">
                      {selectedReviewRx.detectedMedicines?.map((med, i) => (
                        <div key={i} className="flex justify-between items-center text-xs p-1.5 bg-white rounded border border-slate-205">
                          <span className="font-semibold truncate text-slate-750 max-w-[60%]">{med.name}</span>
                          <span className="font-mono text-[10px] text-blue-650 font-bold">Rs. {med.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Editable Pharmacist Notes */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Clinical Notes & Directions (Pharmacist entry)</span>
                    <textarea
                      rows={2.5}
                      className="w-full bg-white border border-slate-300 rounded-xl py-2 px-3 text-xs text-slate-700 leading-normal focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30"
                      value={rxNotes}
                      onChange={(e) => setRxNotes(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-150">
                    <button
                      onClick={() => setSelectedReviewRx(null)}
                      className="py-2.5 bg-slate-50 text-slate-600 hover:text-slate-800 text-xs font-bold rounded-xl border border-slate-200"
                    >
                      Hold Audit
                    </button>
                    <button
                      onClick={() => handleApprovePrescription(selectedReviewRx.id)}
                      className="py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-green-600/10"
                    >
                      Verify & Approve Order
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Panel 4: Active orders tracker list */}
        {activeAdminTab === 'orders' && (
          <div className="space-y-3.5 animate-fade-in font-sans">
            <div>
              <h3 className="text-sm font-bold text-slate-800 font-bold">Customer checkout orders ({orders.length})</h3>
              <p className="text-[11px] text-slate-500 font-medium">Adjust tracking parameters and advance delivery status for online customer bundles.</p>
            </div>

            {orders.length === 0 ? (
              <div className="p-8 bg-white border border-slate-250 rounded-3xl text-center italic text-xs text-slate-500 shadow-sm">
                No medication checkouts registered recently.
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="p-4 bg-white border border-slate-205 rounded-2xl flex flex-col justify-between hover:border-slate-350 transition space-y-3 shadow-sm">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-blue-600 font-semibold">Fulfillment: {order.id}</span>
                    <span className="text-slate-500">PKR {order.total} • Status: <span className="text-blue-700 font-sans font-bold">{order.status}</span></span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 items-center pt-2.5 border-t border-slate-150">
                    <div className="text-[10px] text-slate-500">
                      Consignee: <span className="font-sans text-slate-800 font-bold">{order.patientName}</span>
                    </div>
                    {/* Select Status change */}
                    <select
                      className="bg-slate-50 border border-slate-254 text-xs py-1.5 px-2 text-slate-700 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 font-sans font-semibold cursor-pointer"
                      value={order.status}
                      onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as any)}
                    >
                      <option value="Order Confirmation">1. Order Confirmation</option>
                      <option value="Processing">2. Processing</option>
                      <option value="Pharmacy Verification">3. Pharmacy Verification</option>
                      <option value="Packed">4. Packed</option>
                      <option value="Out for Delivery">5. Out for Delivery</option>
                      <option value="Delivered">6. Delivered</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Panel 5: Doctor Appointments */}
        {activeAdminTab === 'appointments' && (
          <div className="space-y-3.5 animate-fade-in font-sans">
            <div>
              <h3 className="text-sm font-bold text-slate-800 font-bold">Clinical consult schedules ({appointments.length})</h3>
              <p className="text-[11px] text-slate-500 font-medium">Control tele-health consultations and clinic visits schedules.</p>
            </div>

            {appointments.length === 0 ? (
              <div className="p-8 bg-white border border-slate-205 rounded-3xl text-center italic text-xs text-slate-500 shadow-sm">
                No appointments made yet.
              </div>
            ) : (
              appointments.map(apt => (
                <div key={apt.id} className="p-3.5 bg-white border border-slate-205 rounded-2xl text-xs space-y-3.5 text-left shadow-sm">
                  <div className="flex justify-between items-start font-mono border-b border-slate-150 pb-2">
                    <div>
                      <span className="text-slate-400 font-bold">Schedule Ref: {apt.id}</span>
                      <h4 className="font-sans text-sm font-bold text-slate-800 mt-1">{apt.doctorName} ({apt.doctorCategory})</h4>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Consult Fee</span>
                      <span className="font-bold text-green-600">Rs. {apt.fee}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-slate-500 font-mono">
                    <div>Patient: <span className="font-sans text-slate-800 font-semibold">{apt.patientName}</span> • Type: {apt.type} Consult</div>
                    <select
                      className="bg-slate-50 border border-slate-250 text-slate-700 cursor-pointer rounded-lg text-[10px] py-1 px-2 focus:outline-none"
                      value={apt.status}
                      onChange={(e) => onUpdateAppointmentStatus(apt.id, e.target.value as any)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Panel 6: Lab tests draws */}
        {activeAdminTab === 'labs' && (
          <div className="space-y-3.5 animate-fade-in font-sans">
            <div>
              <h3 className="text-sm font-bold text-slate-800 font-bold">Diagnostics collection logs ({labBookings.length})</h3>
              <p className="text-[11px] text-slate-500 font-medium">Schedule home pathology draw routes. Direct lab test updates.</p>
            </div>

            {labBookings.length === 0 ? (
              <div className="p-8 bg-white border border-slate-205 rounded-3xl text-center italic text-xs text-slate-500 shadow-sm">
                No diagnostic bookings made yet.
              </div>
            ) : (
              labBookings.map(bk => (
                <div key={bk.id} className="p-3.5 bg-white border border-slate-205 rounded-2xl text-xs space-y-3.5 text-left shadow-sm">
                  <div className="flex justify-between items-start font-mono border-b border-slate-150 pb-2">
                    <div>
                      <span className="text-slate-400 font-bold">Lab Index ID: {bk.id}</span>
                      <h3 className="text-sm font-bold font-sans text-slate-850 mt-1">{bk.testName} ({bk.collectionType} Collection)</h3>
                    </div>
                    <span className="font-bold text-green-600">Rs. {bk.price}</span>
                  </div>

                  <div className="text-[11px] text-slate-500 font-medium">
                    Patient Address location: <span className="text-slate-800 font-bold">{bk.patientAddress}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-400 font-mono">
                    <span>Patient: <span className="font-sans text-slate-755 font-semibold text-slate-800">{bk.patientName}</span> • Draw date: {bk.date}</span>
                    <select
                      className="bg-slate-50 border border-slate-250 text-slate-700 cursor-pointer rounded-lg text-[10px] py-1 px-2 focus:outline-none"
                      value={bk.status}
                      onChange={(e) => onUpdateLabStatus(bk.id, e.target.value as any)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Sample Collected">Sample Collected</option>
                      <option value="Report Generated">Report Generated</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>

    </div>
  );
}
