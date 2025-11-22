import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const api = axios.create({ baseURL: API_URL });

// 1. Dashboard & Lists
export const getDecisions = async () => (await api.get("/decisions")).data;
export const getDecisionById = async (id: string) => (await api.get(`/decisions/${id}`)).data;
export const getAnomalies = async () => (await api.get("/anomalies/history")).data;

// 2. Simulator (Run & Save)
export const runSimulation = async (features: any) => {
    const res = await api.post("/simulate", { features });
    return res.data;
};

// 3. Explanations
export const getExplanation = async (features: any) => {
    // Send features to get SHAP explanation
    const res = await api.post("/explain", { features });
    return res.data;
};

// 4. Settings
export const getSettings = async () => (await api.get("/settings")).data;
export const toggleSetting = async (id: string, enabled: boolean) => {
    await api.post("/settings/toggle", { id, enabled });
};

// 5. Demo Trigger
export const triggerAttack = async () => await api.post("/demo/trigger-attack");


export const sendChatMessage = async (message: string) => {
  const response = await api.post("/chat", { message });
  return response.data.reply;
}

// src/lib/api.ts
export const getUserProfile = async () => (await api.get("/user/profile")).data;