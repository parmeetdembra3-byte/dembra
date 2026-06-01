import React from 'react';
import { MEDICINE_CATALOG } from '../data';
import { Medicine } from '../types';
import { Activity, ShieldAlert, BadgeInfo, Check } from 'lucide-react';

interface DevicesProps {
  onAddMedicineToCart: (medicine: Medicine) => void;
  onOpenMedicineDetails: (medicine: Medicine) => void;
}

export default function Devices({
  onAddMedicineToCart,
  onOpenMedicineDetails
}: DevicesProps) {
  const deviceProducts = MEDICINE_CATALOG.filter(m => m.category === 'Medical Devices');

  return (
    <div className="space-y-5 pb-20 select-none">
      
      {/* Devices Header */}
      <div className="p-5 bg-white border border-slate-205 rounded-3xl text-left space-y-1 shadow-sm animate-fade-in">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-tight">
          <Activity className="w-5 h-5 text-blue-600" />
          Vital Devices & Diagnostics
        </h2>
        <p className="text-xs text-slate-550 font-medium">
          Professional health monitors and self-testing devices for precise home diagnostics.
        </p>
      </div>

      {/* Grid of Devices */}
      <div className="grid grid-cols-1 gap-3.5 animate-fade-in">
        {deviceProducts.map((device) => (
          <div
            key={device.id}
            className="bg-white border border-slate-205 rounded-2xl p-4 text-left flex flex-col justify-between hover:border-slate-300 transition shadow-sm"
          >
            <div className="flex gap-4">
              {/* Product Visual */}
              <div
                onClick={() => onOpenMedicineDetails(device)}
                className="w-24 h-24 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center p-2 shrink-0 cursor-pointer overflow-hidden relative"
              >
                <img
                  src={device.image}
                  referrerPolicy="no-referrer"
                  alt={device.name}
                  className="max-h-full object-contain hover:scale-105 transition"
                />
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 text-[8px] font-mono bg-blue-50 border border-blue-200 text-blue-700 rounded font-bold uppercase tracking-wider shadow-sm">
                  Device
                </span>
              </div>

              {/* Specs & Descriptions */}
              <div className="flex-1 space-y-1">
                <button 
                  onClick={() => onOpenMedicineDetails(device)}
                  className="text-sm font-bold text-slate-800 hover:text-blue-600 cursor-pointer transition leading-tight text-left"
                >
                  {device.name}
                </button>
                <p className="text-[10px] text-slate-550 font-mono">{device.brand}</p>
                <p className="text-[11px] text-slate-600 leading-normal line-clamp-2 mt-1">
                  {device.description}
                </p>
                
                {/* Guidelines */}
                <div className="flex items-center gap-1.5 text-[9px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 w-fit mt-1.5 font-mono font-bold">
                  <BadgeInfo className="w-3 h-3 text-teal-600" />
                  <span>Clinical Calibration Approved</span>
                </div>
              </div>
            </div>

            {/* Price and Cart controls */}
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Price (PKR)</span>
                <span className="text-base font-bold text-slate-900">Rs. {device.price}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onAddMedicineToCart(device)}
                  className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition active:scale-95 shadow shadow-blue-500/10 cursor-pointer"
                >
                  Add to Shopping Bag
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Calibration Guidelines section */}
      <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-2xl text-left space-y-2 shadow-inner">
        <h4 className="text-xs font-bold text-slate-805 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          Calibration & Usage Safety Guide
        </h4>
        <ul className="space-y-1 text-[10px] text-slate-600 font-medium leading-normal pl-4 list-disc">
          <li>For BP Monitors: Ensure arm is rested at heart level. Rest quietly for 5 minutes before reading.</li>
          <li>For Glucometer strips: Seal vial immediately after pick. Do not reuse blood lancing needles.</li>
          <li>All devices are backed by a 1-Year Brand Replacement Warranty. Keep packaging & invoice card.</li>
        </ul>
      </div>

    </div>
  );
}
