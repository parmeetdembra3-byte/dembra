import React, { useState } from 'react';
import { DOCTOR_CATALOG } from '../data';
import { Doctor, DoctorAppointment } from '../types';
import { Stethoscope, CheckCircle2, ChevronRight, X, Calendar, Clock, Video, Home, Info, Star } from 'lucide-react';

interface DoctorBookingProps {
  onAddAppointmentToHistory: (appointment: DoctorAppointment) => void;
}

export default function DoctorBooking({ onAddAppointmentToHistory }: DoctorBookingProps) {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [patientName, setPatientName] = useState('Parmeet Dembra');
  const [patientPhone, setPatientPhone] = useState('0333-1234567');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [consultType, setConsultType] = useState<'Video' | 'Clinic'>('Video');
  const [isBooked, setIsBooked] = useState(false);

  const specialties = ['All', 'General Physician', 'Cardiologist', 'Dermatologist', 'Pediatrician', 'Gynecologist'];

  const filteredDoctors = DOCTOR_CATALOG.filter(doc => 
    selectedSpecialty === 'All' || doc.category === selectedSpecialty
  );

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDoctor) return;
    if (!selectedDay || !selectedSlot) {
      alert('Please specify the date and consultation hour slot first!');
      return;
    }

    const newAppointment: DoctorAppointment = {
      id: 'APT-' + Math.floor(1000 + Math.random() * 9000),
      doctorId: bookingDoctor.id,
      doctorName: bookingDoctor.name,
      doctorCategory: bookingDoctor.category,
      patientName,
      patientPhone,
      date: selectedDay + ' (June 2026)',
      timeSlot: selectedSlot,
      type: consultType,
      fee: bookingDoctor.fee,
      status: 'Confirmed'
    };

    onAddAppointmentToHistory(newAppointment);
    setIsBooked(true);
  };

  const closeBookingModal = () => {
    setBookingDoctor(null);
    setIsBooked(false);
    setSelectedDay('');
    setSelectedSlot('');
  };

  return (
    <div className="space-y-5 pb-20 select-none">
      
      {/* Intro Header */}
      <div className="text-left space-y-1">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-1.2 uppercase tracking-tight">
          <Stethoscope className="w-5 h-5 text-blue-600" />
          Book Certified Doctor Consultation
        </h2>
        <p className="text-xs text-slate-555 font-medium">
          Consult Pakistan's verified healthcare specialists for live video conferences or medical clinic appointments.
        </p>
      </div>

      {/* Specialty Scroller */}
      <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-205">
        {specialties.map(spec => (
          <button
            key={spec}
            onClick={() => setSelectedSpecialty(spec)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border whitespace-nowrap shrink-0 transition cursor-pointer ${
              selectedSpecialty === spec
                ? 'bg-blue-600 text-white border-blue-600 shadow shadow-blue-600/15'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-350'
            }`}
          >
            {spec}
          </button>
        ))}
      </div>

      {/* Doctor list Cards */}
      <div className="grid grid-cols-1 gap-3.5 animate-fade-in">
        {filteredDoctors.map(doctor => (
          <div
            key={doctor.id}
            className="p-4 bg-white border border-slate-205 rounded-2xl flex flex-col justify-between hover:border-slate-300 transition space-y-3 shadow-sm"
          >
            <div className="flex gap-3 text-left">
              {/* Doctor Avatar */}
              <div className="w-16 h-16 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-200 shadow-sm">
                <img
                  src={doctor.imageUrl}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover animate-pulse-slow"
                  alt={doctor.name}
                />
              </div>

              {/* Bio details */}
              <div className="flex-1 space-y-0.5">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-bold text-slate-800">{doctor.name}</h4>
                  <div className="flex items-center gap-0.5 text-[10px] text-amber-600 font-bold">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{doctor.rating}</span>
                  </div>
                </div>
                <p className="text-[10px] text-green-700 font-bold">{doctor.category}</p>
                <p className="text-[11px] text-slate-500 leading-tight font-medium">{doctor.qualification}</p>
                <div className="text-[9px] font-mono text-slate-450 mt-1 uppercase font-semibold">
                  {doctor.experience} • {doctor.hospital.split(',')[1] || 'Karachi'}
                </div>
              </div>
            </div>

            {/* Price Fee & scheduling specs */}
            <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-left">
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Consultation Fee</span>
                <span className="text-sm font-bold text-slate-900 font-sans">Rs. {doctor.fee}</span>
              </div>

              <button
                onClick={() => setBookingDoctor(doctor)}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition active:scale-95 cursor-pointer shadow-sm shadow-blue-500/10"
              >
                Appoint Consultant
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Dialog Modal */}
      {bookingDoctor && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl relative text-left">
            <button
              onClick={closeBookingModal}
              className="absolute top-4 right-4 p-1 rounded-full bg-slate-100 text-slate-400 hover:text-slate-800 transition cursor-pointer font-bold"
            >
              <X className="w-4 h-4" />
            </button>

            {!isBooked ? (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                    <img src={bookingDoctor.imageUrl} referrerPolicy="no-referrer" className="w-full h-full object-cover" alt="avatar" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">{bookingDoctor.name}</h3>
                    <p className="text-xs text-blue-600 font-semibold">{bookingDoctor.category}</p>
                  </div>
                </div>

                {/* Patient Information input */}
                <div className="space-y-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Patient Name</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Patient Mobile Number</label>
                    <input
                      type="tel"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Consult Type */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Consultation Medium</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setConsultType('Video')}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                        consultType === 'Video'
                          ? 'bg-blue-50 border-blue-500 text-blue-800 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5 text-blue-600" /> Video Call
                    </button>
                    <button
                      type="button"
                      onClick={() => setConsultType('Clinic')}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                        consultType === 'Clinic'
                          ? 'bg-blue-50 border-blue-500 text-blue-800 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <Home className="w-3.5 h-3.5 text-blue-600" /> Clinic Visit
                    </button>
                  </div>
                </div>

                {/* Day Selection */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Select Day</label>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-205">
                    {bookingDoctor.availableDays.map(day => (
                      <button
                        type="button"
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition cursor-pointer ${
                          selectedDay === day
                            ? 'bg-green-600 text-white'
                            : 'bg-slate-50 border border-slate-200 text-slate-650'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slot hour selection */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Available Hour Slates</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {bookingDoctor.slots.map(slot => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-1.5 rounded text-[10px] font-mono whitespace-nowrap cursor-pointer transition border border-slate-150 ${
                          selectedSlot === slot
                            ? 'bg-green-600 text-white font-bold border-green-650'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-805'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Total Payment & Booking submission */}
                <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Consultation Fee</span>
                    <span className="text-sm font-bold text-slate-900">Rs. {bookingDoctor.fee}</span>
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl cursor-pointer transition shadow shadow-blue-600/10"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-4 text-center space-y-4 animate-fade-in">
                <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
                <div className="space-y-1">
                  <h2 className="text-sm font-bold text-slate-900">Consultation Booked!</h2>
                  <p className="text-xs text-slate-550 font-medium">
                    Your appointment with <strong>{bookingDoctor.name}</strong> on {selectedDay} has been successfully secured.
                  </p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl text-[10px] space-y-1 text-slate-600 font-mono text-left leading-normal border border-slate-200 shadow-inner">
                  <div>Patient: {patientName}</div>
                  <div>Medium: {consultType} Consultation</div>
                  <div>Time: {selectedSlot} ({selectedDay})</div>
                  <div>Status: Confirmed</div>
                </div>

                <button
                  type="button"
                  onClick={closeBookingModal}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-705 text-white rounded-xl text-xs font-bold cursor-pointer transition"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
