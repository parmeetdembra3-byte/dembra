import React, { useState } from 'react';
import { LAB_TESTS_CATALOG } from '../data';
import { LabTest, LabBooking } from '../types';
import { FlaskConical, CheckCircle2, X, Download, FileText } from 'lucide-react';

interface LabSectionProps {
  onAddLabBookingToHistory: (booking: LabBooking) => void;
}

export default function LabSection({ onAddLabBookingToHistory }: LabSectionProps) {
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
  const [patientName, setPatientName] = useState('Parmeet Dembra');
  const [patientPhone, setPatientPhone] = useState('0333-1234567');
  const [patientAddress, setPatientAddress] = useState('Defense Housing Authority (DHA), phase 6, Karachi Code 7550');
  const [appointmentDate, setAppointmentDate] = useState('2026-06-05');
  const [appointmentSlot, setAppointmentSlot] = useState('08:00 AM - 10:00 AM');
  const [collectionType, setCollectionType] = useState<'Home' | 'Lab'>('Home');
  const [isBooked, setIsBooked] = useState(false);

  // Simulated Completed Reports Database (For beautiful user download exploration!)
  const reportRecords = [
    { id: 'REP-781', testName: 'Complete Blood Count (CBC)', date: 'May 12, 2026', status: 'Completed', specs: { Hemoglobin: '14.2 g/dL (Normal: 13.5-17.5)', WBC: '6.4 x10^3/uL (Normal: 4.0-11.0)', PLT: '240 x10^3/uL (Normal: 150-450)' } },
    { id: 'REP-782', testName: 'HbA1c Diagnostic', date: 'May 12, 2026', status: 'Completed', specs: { HbA1c: '5.8 % (Normal: < 5.7%, Prediabetes: 5.7-6.4%)' } },
  ];

  const [activeReportSpecs, setActiveReportSpecs] = useState<any>(null);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTest) return;

    const newBooking: LabBooking = {
      id: 'LAB-' + Math.floor(1000 + Math.random() * 9000),
      testId: selectedTest.id,
      testName: selectedTest.name,
      patientName,
      patientPhone,
      patientAddress: collectionType === 'Home' ? patientAddress : 'Visiting Center',
      date: appointmentDate,
      timeSlot: appointmentSlot,
      collectionType,
      price: selectedTest.price,
      status: 'Pending'
    };

    onAddLabBookingToHistory(newBooking);
    setIsBooked(true);
  };

  const closeBookingModal = () => {
    setSelectedTest(null);
    setIsBooked(false);
  };

  return (
    <div className="space-y-5 pb-20 select-none font-sans">
      
      {/* Lab Intro */}
      <div className="text-left space-y-1">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-tight">
          <FlaskConical className="w-5 h-5 text-blue-600" />
          Certified Lab Diagnostics & Screening
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          Order blood panels or molecular diagnostics with PMDC-certified lab technologists. Select home service to have our clinical technicians collect samples at your doorstep.
        </p>
      </div>

      {/* Grid of lab tests */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-slate-450 uppercase tracking-widest text-left px-0.5">Available Diagnostics</h3>
        {LAB_TESTS_CATALOG.map((test) => (
          <div
            key={test.id}
            className="p-3.5 bg-white border border-slate-205 rounded-2xl flex flex-col hover:border-slate-350 transition lg:flex-row lg:justify-between lg:items-center space-y-2.5 lg:space-y-0 shadow-sm"
          >
            <div className="flex-1 text-left space-y-1">
              <dt className="text-xs font-bold text-slate-800">{test.name}</dt>
              <dd className="text-[10px] text-slate-500 font-mono font-bold">CODE: {test.code} • SAMPLE: {test.sampleType}</dd>
              <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{test.description}</p>
              <div className="text-[10px] text-blue-600 font-semibold italic">Preparation req: {test.instructions}</div>
            </div>

            <div className="flex justify-between items-center lg:gap-4 lg:shrink-0 pt-2 lg:pt-0 border-t border-slate-150 lg:border-none text-left">
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Report turnaround</span>
                <span className="text-xs font-mono font-bold text-slate-700">{test.turnaroundTime}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-blue-700 font-mono">Rs. {test.price}</span>
                <button
                  type="button"
                  onClick={() => setSelectedTest(test)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-705 text-white font-bold text-[10px] uppercase tracking-wider rounded-xl transition cursor-pointer shadow-md shadow-blue-500/10 active:scale-95"
                >
                  Schedule Test
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Digital Reports list (Download/View panels) */}
      <div className="bg-white border border-slate-205 rounded-3xl p-4 text-left space-y-3 shadow-xs">
        <h3 className="text-xs font-bold text-slate-850 flex items-center gap-1.5 uppercase font-mono tracking-wider">
          <FileText className="w-4 h-4 text-emerald-600 animate-pulse" />
          Patient Digital Reports ({reportRecords.length})
        </h3>
        <p className="text-[10px] text-slate-500 font-medium">
          Review your medical diagnostics securely online. Tap to view biochemical measurements instantly.
        </p>

        <div className="space-y-2">
          {reportRecords.map(rep => (
            <div key={rep.id} className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex justify-between items-center">
              <div>
                <span className="text-[9px] font-mono font-bold text-emerald-600 uppercase tracking-widest">{rep.id}</span>
                <div className="text-xs font-bold text-slate-800">{rep.testName}</div>
                <div className="text-[10px] text-slate-400 font-bold font-mono">{rep.date}</div>
              </div>
              <button
                type="button"
                onClick={() => setActiveReportSpecs(rep)}
                className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 font-bold text-[10px] rounded-lg flex items-center gap-1 border border-slate-200 cursor-pointer shadow-xs transition"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" /> Preview Report
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Report PDF preview modal */}
      {activeReportSpecs && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-slate-205 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl relative text-left">
            <button
              type="button"
              onClick={() => setActiveReportSpecs(null)}
              className="absolute top-4 right-4 p-1 rounded-full bg-slate-50 text-slate-400 hover:text-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="border-b border-slate-150 pb-3">
              <span className="text-[9px] font-mono text-emerald-600 font-bold tracking-wider">OFFICIAL CLINICAL REPORT</span>
              <h3 className="text-sm font-bold text-slate-800">{activeReportSpecs.testName}</h3>
              <p className="text-[10px] text-slate-450 font-mono mt-0.5 font-bold">Drawn date: {activeReportSpecs.date} • ID: {activeReportSpecs.id}</p>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Bio-measurement readouts:</span>
              <div className="space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-150">
                {Object.entries(activeReportSpecs.specs).map(([key, val]: any) => (
                  <div key={key} className="flex justify-between items-center text-xs py-1 border-b border-slate-200 last:border-0 font-sans">
                    <span className="text-slate-500 font-semibold">{key}:</span>
                    <span className="text-slate-800 font-bold font-mono">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-[9px] text-emerald-700 leading-normal font-mono font-medium">
              ★ Electronically signed and validated by Laboratory Chief Dr. Jamil Malik (Phd Haematology, PMDC #8812c). No physical stamp requested.
            </div>

            <button
              type="button"
              onClick={() => setActiveReportSpecs(null)}
              className="w-full py-2 bg-blue-600 hover:bg-blue-705 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Close Print Window
            </button>
          </div>
        </div>
      )}

      {/* Booking Form Dialog Modal */}
      {selectedTest && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-205 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl relative text-left">
            <button
              type="button"
              onClick={closeBookingModal}
              className="absolute top-4 right-4 p-1 rounded-full bg-slate-50 text-slate-400 hover:text-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {!isBooked ? (
              <form onSubmit={handleBookingSubmit} className="space-y-3.5">
                <div>
                  <span className="text-[10px] text-blue-600 font-mono font-bold uppercase tracking-widest">{selectedTest.code}</span>
                  <h3 className="text-sm font-bold text-slate-800 mt-0.5">{selectedTest.name}</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">{selectedTest.description}</p>
                </div>

                {/* Patient Specs */}
                <div className="space-y-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Patient Name</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl py-2 px-3 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Patient Contact Number</label>
                    <input
                      type="tel"
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl py-2 px-3 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Mode Select */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Collection Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCollectionType('Home')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition ${
                        collectionType === 'Home'
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      🏠 Home Collection
                    </button>
                    <button
                      type="button"
                      onClick={() => setCollectionType('Lab')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition ${
                        collectionType === 'Lab'
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      🔬 Visit Clinical Lab
                    </button>
                  </div>
                </div>

                {/* Address block for home selection */}
                {collectionType === 'Home' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Collection Address (Pakistan)</label>
                    <textarea
                      rows={2}
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl py-2 px-3 text-xs text-slate-800 focus:outline-none focus:border-blue-600 leading-normal"
                      value={patientAddress}
                      onChange={(e) => setPatientAddress(e.target.value)}
                      required
                    />
                  </div>
                )}

                {/* Date & slots scheduling */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Booking Date</label>
                    <input
                      type="date"
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl py-2 px-3 text-xs text-slate-850 font-semibold"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Time Window</label>
                    <select
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl py-2 px-2 text-xs text-slate-850 font-semibold focus:outline-none focus:border-blue-600"
                      value={appointmentSlot}
                      onChange={(e) => setAppointmentSlot(e.target.value)}
                    >
                      <option>07:00 AM - 09:00 AM</option>
                      <option>09:00 AM - 11:00 AM</option>
                      <option>11:00 AM - 01:00 PM</option>
                      <option>03:00 PM - 05:00 PM</option>
                    </select>
                  </div>
                </div>

                {/* Confirm Panel */}
                <div className="flex justify-between items-center pt-3 border-t border-slate-150">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Lab Service Fee</span>
                    <span className="text-sm font-extrabold text-green-600 font-mono">Rs. {selectedTest.price}</span>
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-705 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shadow-md shadow-blue-500/10 active:scale-95"
                  >
                    Confirm Order
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-4 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-800">Lab Diagnostic Scheduled!</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Your appointment for <strong>{selectedTest.name}</strong> has been received by verified clinical operators.
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl text-[10px] text-slate-600 font-mono text-left leading-normal space-y-1 border border-slate-200">
                  <div>Patient: <span className="font-sans font-bold text-slate-800">{patientName}</span></div>
                  <div>Mode: <span className="font-sans font-bold text-slate-800">{collectionType} Collection</span></div>
                  <div>Scheduled Time: <span className="font-sans font-bold text-slate-800">{appointmentDate} {appointmentSlot}</span></div>
                  <div>Report ETA: {selectedTest.turnaroundTime} post draw</div>
                </div>

                <button
                  type="button"
                  onClick={closeBookingModal}
                  className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs uppercase tracking-wider font-bold cursor-pointer transition hover:bg-blue-705 shadow-md shadow-blue-500/10 active:scale-95"
                >
                  Confirm & Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
