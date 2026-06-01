import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Heart, ShieldCheck, Activity } from 'lucide-react';

interface SplashProps {
  onDismiss: () => void;
}

export default function Splash({ onDismiss }: SplashProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onDismiss, 600); // slight pause at 100%
          return 100;
        }
        return prev + 4;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [onDismiss]);

  return (
    <div className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-between text-slate-800 p-8 z-50 overflow-hidden select-none font-sans">
      {/* Decorative pulse background */}
      <div className="absolute inset-0 opacity-5 flex items-center justify-center">
        <Activity className="w-96 h-96 animate-pulse text-blue-600" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Animated Brand Pulse */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="relative flex items-center justify-center w-28 h-28 bg-gradient-to-tr from-blue-600 via-blue-500 to-emerald-500 rounded-3xl shadow-xl shadow-blue-500/10 mb-6"
        >
          <Heart className="w-14 h-14 text-white fill-white/10 animate-bounce" />
          <motion.div
            className="absolute -inset-2 border-2 border-emerald-500/30 rounded-3xl"
            animate={{ scale: [1, 1.15, 1], rotate: [0, 90, 180] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
          />
        </motion.div>

        {/* Store Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-black tracking-tight text-center text-slate-800 px-4"
        >
          SHRIDI WALA MEDICOS STORE
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-[10px] text-slate-450 mt-1 uppercase font-bold tracking-widest font-mono"
        >
          Pakistan's Healthcare Super App
        </motion.p>
      </div>

      {/* Progress and bottom assurances */}
      <div className="w-full max-w-xs flex flex-col items-center space-y-4">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden relative">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <span className="text-xs font-mono text-slate-400 font-bold text-center">
          Initializing Medical Network... {progress}%
        </span>

        {/* Secure Assurances */}
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 mt-2 font-bold shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>HIPAA Secure & Certified Pharmacy</span>
        </div>
      </div>
    </div>
  );
}
