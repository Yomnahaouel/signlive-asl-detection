import { useState } from "react";
import Dropzone from "./components/Dropzone";
import BoundingBoxCanvas from "./components/BoundingBoxCanvas";
import ConfidenceBars from "./components/ConfidenceBars";
import Gallery from "./components/Gallery";
import { predict } from "./services/api";

export default function App() {
  const [imageUrl, setImageUrl] = useState(null);
  const [detections, setDetections] = useState([]);
  const [imageSize, setImageSize] = useState({ width: 640, height: 480 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inferenceMs, setInferenceMs] = useState(null);

  const handleImage = async (file) => {
    // Affiche l'image immédiatement
    setImageUrl(URL.createObjectURL(file));
    setDetections([]);
    setError(null);
    setLoading(true);

    try {
      const res = await predict(file);
      setDetections(res.data.detections);
      setImageSize({ width: res.data.image_width, height: res.data.image_height });
      setInferenceMs(res.data.inference_ms);
    } catch (err) {
      setError("Erreur lors de la prédiction. Vérifiez que l'API tourne.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">SignLive</h1>
        <p className="text-gray-400">Détection ASL en temps réel</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Dropzone */}
        <Dropzone onImageSelected={handleImage} />

        {/* Galerie d'exemples */}
        <div>
          <p className="text-gray-400 text-sm mb-3">Ou teste avec un exemple :</p>
          <Gallery onImageSelected={handleImage} />
        </div>

        {/* Résultats */}
        {loading && (
          <p className="text-blue-400 text-center animate-pulse">Analyse en cours...</p>
        )}

        {error && (
          <p className="text-red-400 text-center">{error}</p>
        )}

        {imageUrl && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Canvas avec boîtes */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Détection</h2>
              <BoundingBoxCanvas
                imageUrl={imageUrl}
                detections={detections}
                imageWidth={imageSize.width}
                imageHeight={imageSize.height}
              />
            </div>

            {/* Barres de confiance */}
            <div>
              <h2 className="text-lg font-semibold mb-3">
                Confiance
                {inferenceMs && (
                  <span className="text-gray-500 text-sm font-normal ml-2">
                    ({inferenceMs.toFixed(1)} ms)
                  </span>
                )}
              </h2>
              <ConfidenceBars detections={detections} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}