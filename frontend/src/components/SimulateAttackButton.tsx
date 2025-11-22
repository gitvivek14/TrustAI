import React, { useState } from 'react';
import axios from 'axios';
import { Siren } from 'lucide-react';

const SimulateAttackButton = () => {
  const [loading, setLoading] = useState(false);

  const triggerAttack = async () => {
    setLoading(true);
    try {
      // Calls the backend, which asks Python to generate fraud, then broadcasts it back to Frontend
      await axios.post("http://localhost:5000/api/demo/trigger-attack");
    } catch (error) {
      console.error("Simulation failed", error);
      alert("Failed to trigger simulation. Is Backend running?");
    }
    setLoading(false);
  };

  return (
    <button 
      onClick={triggerAttack}
      disabled={loading}
      className="group relative bg-red-950 hover:bg-red-900 border border-red-800 text-red-100 px-4 py-2 rounded-md flex items-center gap-2 transition-all overflow-hidden"
    >
      <div className={`absolute inset-0 bg-red-600/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000`} />
      <Siren className={`${loading ? 'animate-spin' : 'animate-pulse'} text-red-500`} size={18} />
      <span className="font-mono text-sm font-bold tracking-wider">
        {loading ? "INJECTING MALWARE..." : "SIMULATE ATTACK"}
      </span>
    </button>
  );
};

export default SimulateAttackButton;