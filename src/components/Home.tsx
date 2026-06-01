import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Upload, 
  Stethoscope, 
  TrendingUp, 
  BadgePercent, 
  ChevronRight, 
  Activity, 
  ShieldCheck, 
  Sparkles,
  Layers,
  Heart,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { Medicine } from '../types';
import { MEDICINE_CATALOG } from '../data';

interface HomeProps {
  onNavigateTo: (screen: 'pharmacy' | 'dermatology' | 'devices' | 'prescription' | 'doctors' | 'labs') => void;
  onAddMedicineToCart: (medicine: Medicine) => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  onOpenMedicineDetails: (medicine: Medicine) => void;
}

export default function Home({
  onNavigateTo,
  onAddMedicineToCart,
  searchTerm,
  setSearchTerm,
  onOpenMedicineDetails
}: HomeProps) {
  const [activePromo, setActivePromo] = useState(0);

  const promoBanners = [
    {
      title: 'Upload Prescription & Order',
      description: 'Get verified by clinical pharmacologists in seconds',
      actionText: 'Scan Now',
      color: 'from-blue-600 to-sky-500',
      screen: 'prescription' as const
    },
    {
      title: 'Free Diagnostic Lab Collection',
      description: 'Secure home sample delivery & digital report downloads',
      actionText: 'Book Tests',
      color: 'from-emerald-600 to-sky-600',
      screen: 'labs' as const
    },
    {
      title: 'Dermal Care Specialists',
      description: 'Acquire dermatologist recommended products in Pakistan',
      actionText: 'Shop SkinCare',
      color: 'from-purple-600 to-emerald-500',
      screen: 'dermatology' as const
    }
  ];

  // Filter local trending medical products
  const featuredOfferProducts = MEDICINE_CATALOG.filter(m => m.stock > 0).slice(0, 4);

  // Suggested category shortcuts
  const categoriesShortcuts = [
    { id: 'pharmacy', name: 'Medications', count: '14+ Types', icon: Layers, screen: 'pharmacy' as const, color: 'text-blue-600 bg-blue-50' },
    { id: 'dermatology', name: 'Derma Care', count: 'Dermatology store', icon: Sparkles, screen: 'dermatology' as const, color: 'text-purple-600 bg-purple-50' },
    { id: 'devices', name: 'Oximeters & Devices', count: 'Home medical devices', icon: Activity, screen: 'devices' as const, color: 'text-emerald-600 bg-emerald-50' },
    { id: 'doctors', name: 'Book Doctors', count: 'Video consultations', icon: Stethoscope, screen: 'doctors' as const, color: 'text-sky-600 bg-sky-50' },
  ];

  // Dynamic filter for matching medications in live search
  const filteredSearch = MEDICINE_CATALOG.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.brand.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 5);

  return (
    <div className="space-y-6 pb-20 select-none">
      
      {/* Search Header Container with Gradient accent */}
      <div className="relative bg-gradient-to-b from-blue-50 to-transparent p-6 rounded-3xl border border-slate-205">
        <h2 className="text-xl font-bold tracking-tight text-blue-900 mb-2 flex items-center gap-1.5 leading-snug">
          SHRIDI WALA <span className="text-green-600">MEDICOS</span>
        </h2>
        <p className="text-xs text-slate-500 mb-4 font-semibold uppercase tracking-wider">
          Purchase authentic Pakistani pharmacy products securely.
        </p>

        {/* Global Catalog Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm text-slate-800 placeholder-slate-450 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
            placeholder="Search Panadol, Risek, Augmentin, Searle..."
          />
        </div>

        {/* Live Search Instant Dropdown Results (Extreme usability support) */}
        {searchTerm && (
          <div className="absolute left-4 right-4 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-35 mt-2 space-y-1">
            <div className="text-[10px] font-mono text-slate-400 px-3 py-1 uppercase tracking-wider">
              Live Catalog Matches ({filteredSearch.length})
            </div>
            {filteredSearch.length === 0 ? (
              <div className="text-xs text-slate-500 p-3 italic text-center">
                No matching medications found in catalog.
              </div>
            ) : (
              filteredSearch.map(med => (
                <div 
                  key={med.id}
                  onClick={() => {
                    onOpenMedicineDetails(med);
                    setSearchTerm('');
                  }}
                  className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-xl cursor-pointer transition text-left animate-fade-in"
                >
                  <div>
                    <div className="text-xs font-semibold text-slate-800">{med.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {med.brand} • {med.genericName}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-600">Rs. {med.price}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Promotional Slides (Animated switch) */}
      <div className="relative overflow-hidden rounded-2xl shadow-sm border border-slate-200">
        <div className={`p-5 rounded-2xl bg-gradient-to-tr ${promoBanners[activePromo].color} text-white flex flex-col justify-between min-h-[140px] relative`}>
          {/* Accent decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl transform translate-x-10 -translate-y-5" />
          
          <div className="space-y-1.5 z-10 max-w-[80%]">
            <h3 className="text-sm font-bold tracking-tight uppercase tracking-wider text-emerald-100">Special Highlights</h3>
            <h2 className="text-base font-extrabold tracking-tight font-sans leading-tight">
              {promoBanners[activePromo].title}
            </h2>
            <p className="text-xs opacity-90 font-normal">
              {promoBanners[activePromo].description}
            </p>
          </div>

          <div className="flex justify-between items-center z-10 mt-3 pt-2">
            <button
              onClick={() => onNavigateTo(promoBanners[activePromo].screen)}
              className="px-4 py-2 bg-white text-slate-900 hover:bg-slate-50 text-xs font-bold rounded-xl transition shadow shadow-black/10 flex items-center gap-1 cursor-pointer"
            >
              {promoBanners[activePromo].actionText}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <div className="flex gap-1">
              {promoBanners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActivePromo(i)}
                  className={`w-2 h-2 rounded-full transition ${activePromo === i ? 'bg-white w-4' : 'bg-white/40'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fast Shortcuts Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          Explore Health Categories
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {categoriesShortcuts.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigateTo(cat.screen)}
              className="p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-205 flex items-center gap-3 cursor-pointer group transition duration-300 shadow-sm"
            >
              <div className={`p-2.5 rounded-xl shrink-0 ${cat.color}`}>
                <cat.icon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition">
                  {cat.name}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">{cat.count}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prescription Quick Launcher Card */}
      <div 
        onClick={() => onNavigateTo('prescription')}
        className="p-4 bg-white border border-slate-205 rounded-2xl hover:border-blue-500/30 cursor-pointer flex justify-between items-center group transition shadow-sm"
      >
        <div className="flex gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
            <Upload className="w-5 h-5" />
          </div>
          <div className="text-left space-y-1">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
              Order via Prescription
              <span className="px-1.5 py-0.5 bg-green-150 text-green-800 border border-green-200 text-[9px] font-bold rounded">AI SCAN</span>
            </h4>
            <p className="text-[11px] text-slate-550">
              Drag-and-drop or snapshot. AI extracts medicines in seconds!
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
      </div>

      {/* Recommended Pakistani Pharmaceutics */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Recommended Products
          </h3>
          <button
            onClick={() => onNavigateTo('pharmacy')}
            className="text-xs text-blue-600 hover:underline flex items-center gap-0.5 font-semibold"
          >
            See All <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {featuredOfferProducts.map((med) => (
            <div
              key={med.id}
              className="bg-white border border-slate-205 rounded-2xl p-3 flex flex-col justify-between hover:border-slate-300 transition shadow-sm"
            >
              {/* Image & Heart icon */}
              <div 
                onClick={() => onOpenMedicineDetails(med)}
                className="relative cursor-pointer flex justify-center py-2 bg-slate-50 rounded-xl overflow-hidden mb-2"
              >
                <img
                  src={med.image}
                  referrerPolicy="no-referrer"
                  alt={med.name}
                  className="h-20 object-contain hover:scale-105 transition duration-300"
                />
                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-white border border-slate-200 text-[8px] text-slate-500 font-mono rounded-md shadow-sm">
                  {med.type}
                </span>
              </div>

              {/* Specs */}
              <div className="text-left flex-1 flex flex-col justify-between">
                <div>
                  <h4 
                    onClick={() => onOpenMedicineDetails(med)}
                    className="text-xs font-bold text-slate-800 line-clamp-1 hover:text-blue-600 cursor-pointer transition"
                  >
                    {med.name}
                  </h4>
                  <p className="text-[9px] font-mono text-slate-500 line-clamp-1 mt-0.5">
                    {med.brand} • {med.genericName}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs font-bold text-slate-900">Rs. {med.price}</span>
                  <button
                    onClick={() => onAddMedicineToCart(med)}
                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-[10px] font-extrabold rounded-lg text-white transition active:scale-95 cursor-pointer shadow-sm shadow-blue-500/10"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
