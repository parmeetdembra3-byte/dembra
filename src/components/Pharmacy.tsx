import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MEDICINE_CATALOG } from '../data';
import { Medicine, MedicineCategory } from '../types';
import { Filter, Layers, CheckCircle2, ChevronRight, X, Heart, ShieldAlert, BadgeCheck } from 'lucide-react';

interface PharmacyProps {
  onAddMedicineToCart: (medicine: Medicine) => void;
  selectedDetailsMedicine: Medicine | null;
  setSelectedDetailsMedicine: (medicine: Medicine | null) => void;
}

export default function Pharmacy({
  onAddMedicineToCart,
  selectedDetailsMedicine,
  setSelectedDetailsMedicine
}: PharmacyProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');

  // Major Categories lists
  const categories: string[] = [
    'All',
    'Tablets',
    'Capsules',
    'Syrups',
    'Antibiotics',
    'Pain Relief Medicines',
    'Diabetes Medicines',
    'Blood Pressure Medicines',
    'Vitamins & Supplements',
    'Pediatric Medicines'
  ];

  // Pick up top brands featured in our catalog
  const brands: string[] = [
    'All',
    'GSK Pakistan',
    'Getz Pharma',
    'Abbott Pakistan',
    'Searle Pakistan',
    'Sami Pharmaceuticals',
    'Ferozsons Laboratories'
  ];

  // Filtering Logic
  const filteredProducts = MEDICINE_CATALOG.filter((med) => {
    const categoryMatch = selectedCategory === 'All' || 
      med.category === selectedCategory || 
      (selectedCategory === 'Tablets' && med.type === 'Tablet') ||
      (selectedCategory === 'Capsules' && med.type === 'Capsule') ||
      (selectedCategory === 'Syrups' && med.type === 'Syrup');
      
    const brandMatch = selectedBrand === 'All' || med.brand === selectedBrand;
    return categoryMatch && brandMatch;
  });

  return (
    <div className="space-y-5 pb-20 select-none">
      
      {/* Search/Filter Intro Bar */}
      <div className="text-left space-y-1">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-tight">
          <Layers className="w-5 h-5 text-blue-600" />
          Online Pharmacy Store
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          Browse clinical formulations. Fully verified by clinical pharmacists.
        </p>
      </div>

      {/* Categories Filter Tabs (Horizontal Scroller) */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-400 tracking-wider uppercase px-0.5">Filter by Category</div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-205">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full border whitespace-nowrap shrink-0 transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/15'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-350'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Brands Filter (Horizontal Scroller) */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-400 tracking-wider uppercase px-0.5">Filter by Pharma Brand</div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-205">
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full border whitespace-nowrap shrink-0 transition cursor-pointer ${
                selectedBrand === brand
                  ? 'bg-green-600 text-white border-green-605 shadow-md shadow-green-600/15'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-350'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Products matches count */}
      <div className="text-[10px] font-mono text-slate-450 text-left uppercase px-1">
        Showing {filteredProducts.length} certified medicines
      </div>

      {/* Grid of Medicines */}
      {filteredProducts.length === 0 ? (
        <div className="p-8 bg-white border border-slate-200 rounded-3xl text-center space-y-2 text-slate-600 shadow-sm">
          <p className="text-sm italic">No products match current combination filter.</p>
          <button 
            onClick={() => { setSelectedCategory('All'); setSelectedBrand('All'); }}
            className="text-xs text-blue-600 font-semibold underline"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredProducts.map((med) => {
            const isLowStock = med.stock <= 15;
            return (
              <div
                key={med.id}
                className="p-3 bg-white border border-slate-205 rounded-2xl flex gap-3.5 hover:border-slate-300 transition shadow-sm animate-fade-in"
              >
                {/* Thumb */}
                <div 
                  onClick={() => setSelectedDetailsMedicine(med)}
                  className="w-20 h-20 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center shrink-0 cursor-pointer overflow-hidden p-1 relative"
                >
                  <img
                    src={med.image}
                    alt={med.name}
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain hover:scale-105 transition"
                  />
                  <div className="absolute top-1 left-1 px-1.5 text-[8px] font-mono bg-white border border-slate-200 text-slate-500 rounded shadow-sm">
                    {med.type}
                  </div>
                </div>

                {/* Info and Purchase specs */}
                <div className="flex-1 flex flex-col justify-between text-left">
                  <div className="space-y-0.5">
                    <div className="flex items-start justify-between">
                      <h4 
                        onClick={() => setSelectedDetailsMedicine(med)}
                        className="text-sm font-bold text-slate-800 line-clamp-1 hover:text-blue-600 transition cursor-pointer"
                      >
                        {med.name}
                      </h4>
                    </div>
                    <div className="text-xs font-mono text-slate-500 font-normal">
                      Brand: <span className="text-slate-700 font-sans font-medium">{med.brand}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-normal line-clamp-1">
                      Formula: {med.genericName}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-2 pt-1 border-t border-slate-100">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900">Rs. {med.price}</span>
                      {isLowStock && (
                        <span className="text-[8px] font-bold text-amber-600 tracking-wider">
                          ONLY {med.stock} LEFT IN INVENTORY
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={() => onAddMedicineToCart(med)}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-sm shadow-blue-500/10"
                    >
                      + Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details Modal Overlay (Full detailed overlay) */}
      <AnimatePresence>
        {selectedDetailsMedicine && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end justify-center p-4"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl relative text-left"
            >
              <button
                onClick={() => setSelectedDetailsMedicine(null)}
                className="absolute top-4 right-4 p-1 rounded-full bg-slate-100 text-slate-400 hover:text-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex justify-center p-3.5 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden mb-2">
                <img
                  src={selectedDetailsMedicine.image}
                  alt={selectedDetailsMedicine.name}
                  referrerPolicy="no-referrer"
                  className="h-32 object-contain"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-1 text-[10px] text-green-800 bg-green-50 w-fit px-2 py-0.5 rounded-full border border-green-200 font-bold">
                  <BadgeCheck className="w-3" />
                  <span>Verified Pharmaceutical Formulation</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{selectedDetailsMedicine.name}</h3>
                <p className="text-xs text-slate-500 font-mono">
                  Active Formula: <span className="text-blue-650 font-sans font-semibold">{selectedDetailsMedicine.genericName}</span>
                </p>
                <p className="text-xs text-slate-500 font-mono">
                  Pharma Manufacturer: <span className="text-slate-700 font-sans font-medium">{selectedDetailsMedicine.brand}</span>
                </p>
              </div>

              <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-150">
                <div className="font-bold text-slate-700 mb-1">Indications & Usage:</div>
                {selectedDetailsMedicine.description}
                <div className="mt-2 text-[10px] text-blue-750 font-bold font-mono">
                  Standard Dosage: {selectedDetailsMedicine.dosage}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-450 font-semibold">Store Retail Price</span>
                  <span className="text-lg font-bold text-slate-900">Rs. {selectedDetailsMedicine.price}</span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onAddMedicineToCart(selectedDetailsMedicine);
                      setSelectedDetailsMedicine(null);
                    }}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/10 active:scale-95 transition cursor-pointer"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
