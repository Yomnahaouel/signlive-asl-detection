import { useEffect, useRef } from "react";

// Palette de couleurs pour différencier les lettres
const COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4",
  "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6", "#f43f5e",
];

const colorForLetter = (letter) =>
  COLORS[letter.charCodeAt(0) % COLORS.length];

export default function BoundingBoxCanvas({ imageUrl, detections, imageWidth, imageHeight }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!imageUrl || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      // Adapter le canvas à la taille réelle de l'image
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);

      // Redimensionner les boîtes si l'API a renvoyé une autre résolution
      const scaleX = img.naturalWidth / (imageWidth || img.naturalWidth);
      const scaleY = img.naturalHeight / (imageHeight || img.naturalHeight);

      detections?.forEach((det) => {
        const { x1, y1, x2, y2 } = det.box;
        const color = colorForLetter(det.letter);

        // Boîte
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.strokeRect(x1 * scaleX, y1 * scaleY, (x2 - x1) * scaleX, (y2 - y1) * scaleY);

        // Étiquette : lettre + confiance
        const label = `${det.letter} ${(det.confidence * 100).toFixed(1)}%`;
        ctx.font = "bold 22px sans-serif";
        const textWidth = ctx.measureText(label).width;

        ctx.fillStyle = color;
        ctx.fillRect(x1 * scaleX, y1 * scaleY - 30, textWidth + 12, 30);
        ctx.fillStyle = "#ffffff";
        ctx.fillText(label, x1 * scaleX + 6, y1 * scaleY - 8);
      });
    };
  }, [imageUrl, detections, imageWidth, imageHeight]);

  return (
    <canvas
      ref={canvasRef}
      className="max-w-full rounded-xl border border-gray-700"
    />
  );
}