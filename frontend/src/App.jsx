import { useEffect, useState } from "react";
import { getHealth } from "./services/api";

export default function App() {
  const [status, setStatus] = useState("chargement...");

  useEffect(() => {
    getHealth()
      .then((res) => setStatus(`✅ API en ligne — modèle : ${res.data.model_version}`))
      .catch(() => setStatus("❌ API hors ligne"));
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">SignLive</h1>
      <p className="text-gray-400">Détection ASL en temps réel</p>
      <div className="bg-gray-800 px-6 py-3 rounded-xl text-sm">{status}</div>
    </div>
  );
}