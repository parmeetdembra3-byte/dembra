import React, { useState } from 'react';
import { MEDICINE_CATALOG } from '../data';
import { Medicine } from '../types';
import { Sparkles, Heart, HelpCircle, BadgePercent, ShieldCheck } from 'lucide-react';

interface DermatologyProps {
  onAddMedicineToCart: (medicine: Medicine) => void;
  onOpenMedicineDetails: (medicine: Medicine) => void;
}

export default function Dermatology({
  onAddMedicineToCart,
  onOpenMedicineDetails
}: DermatologyProps) {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Face Wash' | 'Cream' | 'Moisturizer'>('All');

  const dermaProducts = MEDICINE_CATALOG.filter(m => m.category === 'Skin Care');

  const filteredDerma = dermaProducts.filter(m => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Face Wash') return m.name.toLowerCase().includes('wash');
    if (activeCategory === 'Cream') return m.name.toLowerCase().includes('cream') || m.name.toLowerCase().includes('sunscreen');
    if (activeCategory === 'Moisturizer') return m.name.toLowerCase().includes('moisturizer');
    return true;
  });

  return (
    <div className="space-y-5 pb-20 select-none">
      
      {/* Aesthetic Header */}
      <div className="relative p-6 bg-gradient-to-r from-purple-50 to-pink-50 border border-slate-205 rounded-3xl text-left overflow-hidden shadow-sm animate-fade-in">
        <div className="absolute top-0 right-0 w-20 h-20 bg-pink-550/5 rounded-full blur-xl" />
        <div className="space-y-1 z-10 relative">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-pink-100 text-pink-700 text-[10px] font-bold rounded-full border border-pink-200 uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-pink-650" />
            Dermatologist Recommended
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 mt-2 uppercase tracking-tight">Dermal Care Center</h2>
          <p className="text-xs text-slate-605 max-w-[90%]">
            Premium Serums, Oil-free Hydrators, Sunscreens, and spot treatments authenticated for sensitive skin.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 scrollbar-thin">
        {(['All', 'Face Wash', 'Cream', 'Moisturizer'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 text-xs font-bold rounded-full transition border cursor-pointer ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-600 shadow shadow-purple-500/15'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-350'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product List */}
      <div className="grid grid-cols-2 gap-3.5 animate-fade-in">
        {filteredDerma.map(product => (
          <div
            key={product.id}
            className="bg-white border border-slate-205 rounded-2xl p-3 flex flex-col justify-between hover:border-slate-300 transition shadow-sm"
          >
            {/* Image container */}
            <div
              onClick={() => onOpenMedicineDetails(product)}
              className="relative aspect-square rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center p-2 overflow-hidden cursor-pointer"
            >
              <img
                src={product.image}
                referrerPolicy="no-referrer"
                alt={product.name}
                className="max-h-full object-contain hover:scale-105 transition"
              />
              <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 bg-purple-50 border border-purple-200 text-[8px] text-purple-700 font-bold rounded">
                Cosmeceutical
              </span>
            </div>

            {/* Spec Details */}
            <div className="text-left mt-2 flex-1 flex flex-col justify-between space-y-1.5">
              <div>
                <button 
                  onClick={() => onOpenMedicineDetails(product)}
                  className="font-bold text-xs text-slate-800 line-clamp-1 hover:text-purple-650 cursor-pointer transition text-left"
                >
                  {product.name}
                </button>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">{product.brand}</p>
                <p className="text-[9px] text-slate-500 mt-1 h-8 line-clamp-2 leading-tight">
                  {product.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-900">Rs. {product.price}</span>
                <button
                  onClick={() => onAddMedicineToCart(product)}
                  className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-[10px] font-bold rounded-lg text-white transition active:scale-95 cursor-pointer shadow shadow-purple-900/10"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Safety tip banner */}
      <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-2xl flex gap-3 text-left shadow-inner">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold text-slate-800">Dermato-safety check</h4>
          <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
            All dermatology products are certified non-comedogenic and hypo-allergenic. Patch testing is recommended.
          </p>
        </div>
      </div>

    </div>
  );
}
