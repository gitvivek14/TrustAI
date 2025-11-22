import React, { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { 
  ShieldAlert, X, Activity, Lock, CheckCircle, 
  MapPin, Globe, Smartphone, Wifi, DollarSign, AlertTriangle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SOCKET_URL = "http://localhost:5000";

interface AlertData {
  type: string;
  message: string;
  score: number;
  transaction?: any; // This now has the rich data
  details?: string;
}

const GlobalAlert = () => {
  const [alertData, setAlertData] = useState<AlertData | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);
    newSocket.on("ANOMALY_ALERT", (data: AlertData) => {
      console.log("🚨 RICH ALERT RECEIVED:", data);
      setAlertData(data);
    });
    return () => { newSocket.disconnect(); };
  }, []);

  const handleAction = (actionId: string) => {
    alert(actionId === 'freeze_account' ? "❄️ ACCOUNT FROZEN! Future transactions blocked." : "Alert Dismissed.");
    setAlertData(null);
  };

  if (!alertData) return null;

  // Extract the rich data (fallback to defaults if missing)
  const txn = alertData.transaction || {};
  const isCritical = alertData.score < 0;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: -150, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -150, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-10 px-4 pointer-events-none"
      >
        <div className="bg-slate-950 text-white border-2 border-red-600 w-full max-w-3xl rounded-xl shadow-[0_0_50px_rgba(220,38,38,0.5)] overflow-hidden pointer-events-auto backdrop-blur-xl">
          
          {/* --- HEADER --- */}
          <div className="bg-red-950/80 p-4 flex items-center justify-between border-b border-red-800">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-600 rounded-lg animate-pulse">
                <ShieldAlert size={32} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-2xl tracking-widest text-red-100">THREAT DETECTED</h3>
                <span className="text-xs text-red-300 font-mono uppercase flex items-center gap-2">
                  <Activity size={12} /> AI Confidence: {Math.abs(alertData.score * 100).toFixed(1)}% | Severity: CRITICAL
                </span>
              </div>
            </div>
            <button onClick={() => setAlertData(null)} className="p-2 hover:bg-red-900/50 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* --- FORENSIC GRID --- */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/40">
            
            {/* Left Col: Location & Network */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 border-b border-slate-700 pb-1">
                Network Forensics
              </h4>
              
              <div className="flex items-start gap-3">
                <Globe className="text-blue-400 mt-1" size={18} />
                <div>
                  <p className="text-xs text-slate-400">Source IP Address</p>
                  <p className="font-mono text-red-300">{txn.ip_address || "Unknown"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="text-orange-400 mt-1" size={18} />
                <div>
                  <p className="text-xs text-slate-400">Geo-Location</p>
                  <p className="font-medium text-white">{txn.location || "Unknown"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Wifi className="text-purple-400 mt-1" size={18} />
                <div>
                  <p className="text-xs text-slate-400">Connection Type</p>
                  <p className="font-medium text-white">{txn.connection_type || "Standard"}</p>
                </div>
              </div>
            </div>

            {/* Right Col: Transaction & Device */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 border-b border-slate-700 pb-1">
                Transaction Details
              </h4>

              <div className="flex items-start gap-3">
                <DollarSign className="text-green-400 mt-1" size={18} />
                <div>
                  <p className="text-xs text-slate-400">Attempted Amount</p>
                  <p className="font-bold text-xl text-white">{txn.amount || "$0.00"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Smartphone className="text-yellow-400 mt-1" size={18} />
                <div>
                  <p className="text-xs text-slate-400">Device Fingerprint</p>
                  <p className="font-mono text-xs text-slate-300 break-all">{txn.device_id || "Unknown Device"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <AlertTriangle className="text-red-500 mt-1" size={18} />
                <div>
                  <p className="text-xs text-slate-400">Risk Factor</p>
                  <p className="text-red-400 text-sm">Abnormal DTI ({txn.dti_ratio}) & Suspicious IP</p>
                </div>
              </div>
            </div>

          </div>

          {/* --- ACTION BAR --- */}
          <div className="p-4 bg-red-950/30 border-t border-red-900/50 flex gap-4">
            <button 
              onClick={() => handleAction('freeze_account')}
              className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-lg shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Lock size={18} />
              BLOCK & FREEZE
            </button>
            <button 
              onClick={() => handleAction('ignore')}
              className="flex-1 bg-transparent hover:bg-white/5 text-slate-300 border border-slate-600 font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all"
            >
              <CheckCircle size={18} />
              Verify Identity
            </button>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GlobalAlert;