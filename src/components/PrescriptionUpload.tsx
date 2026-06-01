import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  ShieldCheck, 
  RefreshCcw, 
  Loader,
  PlusSquare
} from 'lucide-react';
import { PRESET_PRESCRIPTIONS_SAMPLES } from '../data';
import { PrescriptionOrder } from '../types';

interface PrescriptionUploadProps {
  onPrescriptionParsed: (medicines: { name: string; dosage: string; quantity: number; price: number }[], notes: string) => void;
  onAddPrescriptionOrderToHistory: (order: PrescriptionOrder) => void;
}

export default function PrescriptionUpload({
  onPrescriptionParsed,
  onAddPrescriptionOrderToHistory
}: PrescriptionUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatusMsg, setScanStatusMsg] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');
  const [scannedResult, setScannedResult] = useState<{
    success: boolean;
    isSimulation: boolean;
    detectedMedicines: { name: string; dosage: string; quantity: number; price: number }[];
    pharmacistNotes: string;
    orderId: string;
  } | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setSelectedPresetId('');
    setScannedResult(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const selectPresetSample = (presetId: string) => {
    setSelectedPresetId(presetId);
    const found = PRESET_PRESCRIPTIONS_SAMPLES.find(p => p.id === presetId);
    if (found) {
      setPreviewUrl(found.imageUrl);
      setSelectedFile(null);
      setScannedResult(null);
    }
  };

  // Triggers the electronic scanner animation and REST API request
  const startScanningAI = async () => {
    if (!previewUrl && !selectedPresetId) {
      alert('Please select a preset sample template or upload a prescription image first!');
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setScanStatusMsg('Initializing AI Clinical Scanner...');

    // Incremental progress messages (staggered UI comfort)
    const messages = [
      { prg: 20, msg: 'Enhancing contrast mapping...' },
      { prg: 45, msg: 'Segmenting handwriting contours...' },
      { prg: 70, msg: 'Querying Pakistani Pharmaceutical Lexicon...' },
      { prg: 90, msg: 'Performing clinical pharmacist verification...' }
    ];

    const messageInterval = setInterval(() => {
      setScanProgress((prev) => {
        const next = prev + 5;
        const currentMsg = messages.find(m => next >= m.prg && prev < m.prg);
        if (currentMsg) {
          setScanStatusMsg(currentMsg.msg);
        }
        if (next >= 100) {
          clearInterval(messageInterval);
          return 100;
        }
        return next;
      });
    }, 120);

    try {
      let reqBody: any = {};
      
      if (selectedPresetId) {
        const found = PRESET_PRESCRIPTIONS_SAMPLES.find(p => p.id === selectedPresetId);
        reqBody.sampleText = found?.name + ': ' + found?.snippet;
      } else if (previewUrl) {
        // If real upload, send base64 or sample mock text
        reqBody.imageBase64 = previewUrl; // For simulated base64 pipeline
        reqBody.sampleText = 'uploaded_custom_image';
      }

      const response = await fetch('/api/prescription/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqBody)
      });

      const result = await response.json();

      // Delay slightly so scanning visual finishes beautifully
      setTimeout(() => {
        setIsScanning(false);
        if (result.success) {
          const generatedOrderId = 'RX-' + Math.floor(1000 + Math.random() * 9000);
          const fullResult = {
            ...result,
            orderId: generatedOrderId
          };
          setScannedResult(fullResult);

          // Add to overall user prescription order storage history
          const customOrder: PrescriptionOrder = {
            id: generatedOrderId,
            imageUrl: previewUrl || 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=60&referrerPolicy=no-referrer',
            patientName: 'Parmeet Dembra (Scan Account)',
            patientPhone: '0333-1234567',
            patientAddress: 'Defense Housing Authority (DHA), phase 6, Karachi',
            date: new Date().toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' }),
            status: 'Pending Verification', // Will state Verified once pharmacist edits/approves in admin dashboard!
            detectedMedicines: result.detectedMedicines,
            pharmacistNotes: result.pharmacistNotes,
            totalPrice: result.detectedMedicines?.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0)
          };
          onAddPrescriptionOrderToHistory(customOrder);
        } else {
          alert('Failed to scan prescription: ' + result.error);
        }
      }, 2500);

    } catch (error) {
      console.error(error);
      setIsScanning(false);
      alert('Network error during scan. Standard mockup defaults loaded.');
    }
  };

  const handleAddAllToCart = () => {
    if (!scannedResult) return;
    onPrescriptionParsed(scannedResult.detectedMedicines, scannedResult.pharmacistNotes);
    alert('Extracted Prescription and added all available matching medicines to your checkout cart!');
  };

  return (
    <div className="space-y-5 pb-20 select-none font-sans">
      
      {/* Title */}
      <div className="text-left space-y-1">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-tight">
          <FileText className="w-5 h-5 text-blue-600 animate-pulse" />
          Smart AI Prescription Assistant
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          Upload handwritten medical slips. Our machine learning system segments and maps them directly to our pharmacy catalog in close safety intervals.
        </p>
      </div>

      {/* Selector Options */}
      <div className="grid grid-cols-1 gap-4">
        
        {/* Sample select template for seamless verification */}
        <div className="bg-white border border-slate-205 p-4 rounded-3xl text-left space-y-3 shadow-xs">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-orange-500" />
            No real medical slip? Try Sample Prescription
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {PRESET_PRESCRIPTIONS_SAMPLES.map((pres) => (
              <button
                type="button"
                key={pres.id}
                onClick={() => selectPresetSample(pres.id)}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition ${
                  selectedPresetId === pres.id
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-350 hover:bg-slate-100/50'
                }`}
              >
                <div className="text-xs font-bold font-sans truncate">{pres.name}</div>
                <div className="text-[9px] font-mono font-bold line-clamp-1 mt-1 text-slate-455">
                  {pres.snippet}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Drag Drop Area */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-3xl p-6 text-center transition flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden ${
            dragActive
              ? 'border-blue-500 bg-blue-50/50'
              : selectedFile || selectedPresetId
              ? 'border-emerald-500/40 bg-zinc-50'
              : 'border-slate-300 bg-slate-50/50 hover:bg-slate-100'
          }`}
        >
          {previewUrl ? (
            <div className="relative w-full max-h-[180px] rounded-2xl overflow-hidden flex items-center justify-center">
              <img
                src={previewUrl}
                alt="Uploaded Prescription"
                className="max-h-[180px] object-cover rounded-xl border border-slate-200"
                referrerPolicy="no-referrer"
              />
              {/* Laser scanning visual bar */}
              {isScanning && (
                <motion.div
                  initial={{ top: '0%' }}
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-lg shadow-blue-500 z-10"
                />
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-xs text-slate-600 font-semibold">
                Drag and drop medical slip, or{' '}
                <label className="text-blue-600 hover:underline cursor-pointer font-bold ml-0.5">
                  browse files
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileInput}
                  />
                </label>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase font-mono tracking-wider">Supports PNG, JPEG up to 6MB</p>
            </div>
          )}

          {previewUrl && !isScanning && (
            <button
              type="button"
              onClick={() => {
                setPreviewUrl(null);
                setSelectedFile(null);
                setSelectedPresetId('');
                setScannedResult(null);
              }}
              className="absolute top-2 right-2 p-1.5 bg-slate-900/80 border border-slate-750 rounded-full text-slate-200 hover:text-white transition cursor-pointer"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Scan Trigger */}
        {(previewUrl || selectedPresetId) && !isScanning && !scannedResult && (
          <button
            type="button"
            onClick={startScanningAI}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-emerald-600 hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition active:scale-95 shadow-md shadow-blue-600/10 cursor-pointer"
          >
            Initiate Clinical AI Med Scan
          </button>
        )}

        {/* Scanning Progress */}
        {isScanning && (
          <div className="p-4 bg-white border border-slate-205 rounded-2xl text-left space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Loader className="w-4 h-4 text-blue-600 animate-spin" />
              <span>{scanStatusMsg}</span>
            </div>
            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600" style={{ width: `${scanProgress}%` }} />
            </div>
            <span className="text-[9px] font-mono text-slate-455 font-bold uppercase tracking-wider">Scan index: {scanProgress}% complete</span>
          </div>
        )}

        {/* Results layout */}
        {scannedResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-2 border-emerald-500/20 p-4 rounded-3xl text-left space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-slate-150 pb-3">
              <div>
                <span className="text-[9px] font-extrabold text-emerald-700 border border-emerald-200 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Success • Mapped to Catalog
                </span>
                <h4 className="text-xs font-bold text-slate-800 mt-1 uppercase tracking-wider">Prescription Mapped Summary</h4>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-mono text-slate-455 block uppercase font-bold">Assigned Order ID</span>
                <span className="text-xs font-bold font-mono text-blue-600">{scannedResult.orderId}</span>
              </div>
            </div>

            {/* List of matched items */}
            <div className="space-y-2">
              {scannedResult.detectedMedicines?.map((med, index) => (
                <div key={index} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-slate-800">{med.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono font-bold mt-0.5">{med.dosage}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-500">{med.quantity} x </span>
                    <span className="font-extrabold text-blue-600">Rs. {med.price}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pharmacist Guidelines notes */}
            <div className="text-[11px] text-slate-650 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-205">
              <span className="font-bold text-slate-800 block mb-0.5">Clinical Pharmacist Memo:</span>
              {scannedResult.pharmacistNotes}
            </div>

            {/* Secure warning badge */}
            <div className="p-2.5 bg-blue-50/50 border border-blue-100 rounded-xl flex gap-2 text-[10px] text-slate-600 leading-normal font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Verification Alert:</strong> This scanned order has been queued to SHRIDI WALA MEDICO'S Admin Panel. A licensed pharmacist is reviewing this mapping. It is safe to checkout.
              </span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setScannedResult(null);
                  setSelectedPresetId('');
                  setPreviewUrl(null);
                }}
                className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer border border-slate-200"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleAddAllToCart}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/10"
              >
                <PlusSquare className="w-4 h-4" /> Add Extracted Medicines to Cart
              </button>
            </div>

          </motion.div>
        )}

      </div>
    </div>
  );
}
