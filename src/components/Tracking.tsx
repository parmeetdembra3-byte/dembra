import React from 'react';
import { CustomerOrder } from '../types';
import { Check, ClipboardList, Loader2, Container, Bike, BadgeCheck, Compass } from 'lucide-react';

interface TrackingProps {
  orders: CustomerOrder[];
}

export default function Tracking({ orders }: TrackingProps) {
  
  // Stages Definition
  const STAGES = [
    { title: 'Confirmed', desc: 'Securely registered', icon: ClipboardList },
    { title: 'Processing', desc: 'Sourcing items', icon: Loader2 },
    { title: 'Verification', desc: 'Pharmacist vetting', icon: BadgeCheck },
    { title: 'Packed', desc: 'In protective box', icon: Container },
    { title: 'Dispatched', desc: 'Rider outbound', icon: Bike },
    { title: 'Delivered', desc: 'Welcome delivery', icon: Check }
  ];

  const getStageCodeIndex = (status: CustomerOrder['status']): number => {
    switch (status) {
      case 'Order Confirmation': return 0;
      case 'Processing': return 1;
      case 'Pharmacy Verification': return 2;
      case 'Packed': return 3;
      case 'Out for Delivery': return 4;
      case 'Delivered': return 5;
      default: return 0;
    }
  };

  return (
    <div className="space-y-5 pb-20 select-none text-left font-sans">
      
      {/* Tracker Intro */}
      <div className="text-left space-y-1">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-tight">
          <Compass className="w-5 h-5 text-blue-600 animate-spin-slow" />
          Fulfillment Order Tracker
        </h2>
        <p className="text-xs text-slate-505 font-medium">
          Track the live delivery progress of your certified pharmaceutical orders.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="p-10 bg-white border border-slate-205 rounded-3xl text-center space-y-3 shadow-xs">
          <ClipboardList className="w-12 h-12 text-slate-350 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-slate-800 text-sm font-bold uppercase tracking-wider">No active orders</h3>
            <p className="text-slate-500 text-xs leading-normal font-medium">
              Any pharmaceutical checkout or prescription orders placed will instantly register inside this live tracker panel.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const currentStageIndex = getStageCodeIndex(order.status);
            
            return (
              <div 
                key={order.id} 
                className="bg-white border border-slate-205 rounded-3xl p-5 space-y-5 shadow-sm text-left"
              >
                {/* Meta Header */}
                <div className="flex justify-between items-start border-b border-slate-150 pb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Fulfillment ID</span>
                    <span className="text-sm font-extrabold font-mono text-blue-600">{order.id}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Est. Delivery</span>
                    <span className="text-xs font-bold text-slate-800">Asap • Today</span>
                  </div>
                </div>

                {/* Items Summaries */}
                <div className="p-3 bg-slate-50 rounded-2xl space-y-1.5 border border-slate-200 text-xs">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Order Contents:</span>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-slate-700 leading-normal font-semibold">
                      <span>{item.medicine.name} (x{item.quantity})</span>
                      <span className="font-mono text-slate-500">PKR {item.medicine.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center text-slate-800 font-bold border-t border-slate-200 pt-1.5 mt-1.5">
                    <span>Total Amount:</span>
                    <span className="text-green-600 font-mono text-sm">Rs. {order.total}</span>
                  </div>
                </div>

                {/* Vertical Tracking Milestones Line (Extremely responsive & elegant) */}
                <div className="space-y-4 pt-1.5">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Live Status Steps:</span>
                  
                  <div className="relative pl-7 space-y-5 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {STAGES.map((step, idx) => {
                      const isCompleted = idx < currentStageIndex;
                      const isCurrent = idx === currentStageIndex;
                      const isPending = idx > currentStageIndex;

                      return (
                        <div key={idx} className="relative text-xs">
                          {/* Indicator circle */}
                          <div className={`absolute -left-7 top-0.5 w-6.5 h-6.5 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                            isCompleted 
                              ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-500/10' 
                              : isCurrent 
                              ? 'bg-blue-600 border-blue-600 text-white animate-pulse shadow-md shadow-blue-500/10' 
                              : 'bg-white border-slate-250 text-slate-400'
                          }`}>
                            <step.icon className={`w-3.5 h-3.5 ${isCurrent && idx === 1 ? 'animate-spin' : ''}`} />
                          </div>

                          <div className="pl-2">
                            <h4 className={`font-bold transition ${isCompleted || isCurrent ? 'text-slate-800' : 'text-slate-400'}`}>
                              {step.title}
                              {isCurrent && <span className="ml-1.5 text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 font-sans uppercase">Active</span>}
                            </h4>
                            <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed font-semibold">{step.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Consignee Shipping */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[10px] space-y-1 font-mono text-slate-500 leading-normal">
                  <div>Consignee: <span className="font-sans text-slate-800 font-semibold">{order.patientName}</span></div>
                  <div>Phone: <span className="text-slate-700 font-bold">{order.patientPhone}</span></div>
                  {order.deliveryType === 'Home Delivery' ? (
                    <div>Ship to: <span className="font-sans text-slate-600 font-semibold">{order.shippingAddress}</span></div>
                  ) : (
                    <div>Store address: <span className="font-sans text-emerald-700 font-bold">SHRIDI WALA main medical branch, Pakistan</span></div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
