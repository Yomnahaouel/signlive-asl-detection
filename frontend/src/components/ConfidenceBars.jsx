export default function ConfidenceBars({ detections }) {
  if (!detections || detections.length === 0) {
    return <p className="text-gray-500 text-sm">Aucune détection.</p>;
  }

  return (
    <div className="space-y-3">
      {detections.map((det, i) => (
        <div key={i}>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-bold text-white">{det.letter}</span>
            <span className="text-gray-400">
              {(det.confidence * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-green-400 transition-all duration-500"
              style={{ width: `${det.confidence * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}