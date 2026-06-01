import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, Phone, ArrowLeft, KeyRound, ShieldAlert, ArrowRight, Smartphone, Sparkles } from 'lucide-react';

interface AuthProps {
  onSuccess: (user: { name: string; phone: string; email: string }) => void;
  onBypass: () => void;
}

export default function Auth({ onSuccess, onBypass }: AuthProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'otp'>('login');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [simulatedOtp, setSimulatedOtp] = useState('7860');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (mode === 'otp' && secondsLeft > 0) {
      timer = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [mode, secondsLeft]);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setErrorMsg('Please enter a valid Pakistani mobile number (e.g., 03001234567)');
      return;
    }
    setErrorMsg('');
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setSimulatedOtp(code);
    setSecondsLeft(60);
    setMode('otp');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      if (!email.includes('@') || password.length < 5) {
        setErrorMsg('Please provide valid credentials (min 5 chars password)');
        return;
      }
      onSuccess({
        name: email.split('@')[0].toUpperCase(),
        phone: '0312-4567890',
        email
      });
    } else if (mode === 'signup') {
      if (!name || !email || !phone) {
        setErrorMsg('All fields are mandatory.');
        return;
      }
      onSuccess({ name, phone, email });
    }
  };

  const handleOtpVerify = () => {
    const codeString = otpCode.join('');
    if (codeString === simulatedOtp) {
      onSuccess({
        name: name || 'User Customer',
        phone: phone || '0300-1112223',
        email: email || 'customer@medicos.pk'
      });
    } else {
      setErrorMsg('Invalid OTP. Please enter the generated code correctly or click the Auto-fill helper.');
    }
  };

  return (
    <div className="absolute inset-0 bg-slate-50 text-slate-800 flex flex-col justify-center px-6 py-8 md:px-12 z-40 overflow-y-auto">
      <div className="max-w-md w-full mx-auto space-y-6">
        
        {/* Brand Banner */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 mb-1">
            <Sparkles className="w-8 h-8 animate-spin-slow" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-800">
            SHRIDI WALA MEDICOS
          </h2>
          <p className="text-xs text-slate-500 font-semibold tracking-wide uppercase">
            Pakistan's Complete Digital Healthcare Hub
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2 font-semibold">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {mode === 'login' && (
            <motion.form
              key="login"
              initial={{ x: 15, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -15, opacity: 0 }}
              onSubmit={handleFormSubmit}
              className="space-y-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"
            >
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setErrorMsg(''); setEmail(e.target.value); }}
                    className="w-full bg-slate-50 border border-slate-205 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30"
                    placeholder="name@email.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-xs text-blue-600 hover:underline font-bold"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => { setErrorMsg(''); setPassword(e.target.value); }}
                    className="w-full bg-slate-50 border border-slate-205 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30"
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 transition text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/10"
              >
                Sign In
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-150"></div>
                <span className="flex-shrink mx-3 text-slate-400 text-[10px] uppercase font-bold tracking-wider font-mono">Or Mobile OTP</span>
                <div className="flex-grow border-t border-slate-150"></div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mobile Number (Pakistan)</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="03001234567"
                      className="w-full bg-slate-50 border border-slate-205 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handlePhoneSubmit}
                    className="px-4 bg-slate-100 hover:bg-slate-200 active:scale-95 rounded-xl text-xs font-bold text-blue-600 flex items-center gap-1.5 shrink-0 cursor-pointer border border-slate-200"
                  >
                    <Smartphone className="w-4 h-4" />
                    Send OTP
                  </button>
                </div>
              </div>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500 font-medium">
                  New to Shridi Wala Medicos?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-blue-600 font-bold hover:underline ml-0.5"
                  >
                    Create Account
                  </button>
                </span>
              </div>
            </motion.form>
          )}

          {mode === 'signup' && (
            <motion.form
              key="signup"
              initial={{ x: 15, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -15, opacity: 0 }}
              onSubmit={handleFormSubmit}
              className="space-y-3 bg-white p-6 rounded-3xl border border-slate-205 shadow-sm"
            >
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-205 rounded-xl py-2.5 px-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600"
                  placeholder="e.g. Parmeet Dembra"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-205 rounded-xl py-2.5 px-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600"
                  placeholder="name@email.com"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-205 rounded-xl py-2.5 px-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600"
                  placeholder="e.g. 0333-1234567"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-205 rounded-xl py-2.5 px-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600"
                  placeholder="Min 6 characters"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-xl mt-2 flex items-center justify-center gap-1 cursor-pointer"
              >
                Sign Up
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs text-slate-550 font-bold hover:underline flex items-center gap-1 mx-auto"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-blue-600" /> Already have an account? Sign In
                </button>
              </div>
            </motion.form>
          )}

          {mode === 'forgot' && (
            <motion.div
              key="forgot"
              initial={{ x: 15, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -15, opacity: 0 }}
              className="space-y-4 bg-white p-6 rounded-3xl border border-slate-205 shadow-sm"
            >
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Reset Password</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Enter your email address, and we will send a direct reset passcode to your registered email securely.
              </p>
              <div className="space-y-1">
                <input
                  type="email"
                  className="w-full bg-slate-50 border border-slate-205 rounded-xl py-3 px-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600"
                  placeholder="Enter email address"
                />
              </div>
              <button
                onClick={() => {
                  alert('Reset code simulated successfully!');
                  setMode('login');
                }}
                className="w-full py-3 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer"
              >
                Request Code
              </button>
              <button
                onClick={() => setMode('login')}
                className="w-full text-xs text-slate-500 font-bold hover:underline"
              >
                Go Back
              </button>
            </motion.div>
          )}

          {mode === 'otp' && (
            <motion.div
              key="otp"
              initial={{ x: 15, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -15, opacity: 0 }}
              className="space-y-5 bg-white p-6 rounded-3xl border border-slate-205 shadow-sm"
            >
              <div className="text-center space-y-1.5">
                <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Verification Code</h3>
                <p className="text-xs text-slate-500 font-medium">
                  We sent a 4-digit verification code to
                </p>
                <div className="text-sm font-extrabold text-blue-600 font-mono">
                  {phone || '0300-XXXXXXX'}
                </div>
              </div>

              {/* OTP Input Fields */}
              <div className="flex gap-4 justify-center py-2">
                {otpCode.map((char, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    maxLength={1}
                    value={char}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      const nextCode = [...otpCode];
                      nextCode[index] = val;
                      setOtpCode(nextCode);
                      
                      // Auto focus next
                      if (val && index < 3) {
                        const nextInput = document.getElementById(`otp-input-${index + 1}`) as HTMLInputElement;
                        nextInput?.focus();
                      }
                    }}
                    className="w-12 h-14 bg-slate-50 border border-slate-250 focus:border-blue-600 text-center text-xl font-bold rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600/30"
                  />
                ))}
              </div>

              {/* SIMULAR HELPER PANEL (High value UX support) */}
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl space-y-2 text-center text-xs text-blue-700">
                <div className="flex items-center justify-center gap-1.5 font-bold">
                  <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                  <span>[Pakistan SMS Gateway Simulation]</span>
                </div>
                <div className="font-mono text-slate-650 font-semibold text-[11px]">
                  SMS Code received: <span className="font-bold text-emerald-600 select-all">{simulatedOtp}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOtpCode(simulatedOtp.split(''));
                    setErrorMsg('');
                  }}
                  className="px-3 py-1 bg-white hover:bg-blue-100/50 active:scale-95 text-blue-600 rounded-full text-[10px] font-bold border border-blue-200 cursor-pointer transition shadow-xs"
                >
                  Click to Auto-fill securely
                </button>
              </div>

              <div className="flex justify-between items-center text-xs px-2 text-slate-505 font-bold">
                <span>Resend in {secondsLeft}s</span>
                <button
                  disabled={secondsLeft > 0}
                  onClick={() => {
                    const code = Math.floor(1000 + Math.random() * 9000).toString();
                    setSimulatedOtp(code);
                    setSecondsLeft(60);
                  }}
                  className={`${secondsLeft > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-blue-600 hover:underline cursor-pointer'}`}
                >
                  Resend OTP Gateway
                </button>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleOtpVerify}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  Verify OTP
                </button>
                <button
                  onClick={() => setMode('login')}
                  className="w-full text-xs text-slate-500 font-bold hover:underline py-1"
                >
                  Go Back
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Guest Bypass button for rapid frictionless testing of modules */}
        <div className="pt-6 border-t border-slate-200 flex flex-col items-center gap-3">
          <p className="text-[10px] text-slate-450 tracking-wider uppercase font-bold font-mono">Bypass with Guest Mode</p>
          <button
            onClick={onBypass}
            className="px-6 py-2.5 bg-white hover:bg-slate-50 border border-slate-205 text-xs font-bold text-slate-650 rounded-full hover:text-slate-900 cursor-pointer transition flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            Explore App Instantly (Bypass Auth)
            <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
          </button>
        </div>

      </div>
    </div>
  );
}
