const SAMPLES = [
  { src: "/samples/A.jpg", label: "Lettre A" },
  { src: "/samples/B.jpg", label: "Lettre B" },
  { src: "/samples/C.jpg", label: "Lettre C" },
  { src: "/samples/L.jpg", label: "Lettre L" },
];

export default function Gallery({ onImageSelected }) {
  // Transforme l'URL de l'échantillon en File pour réutiliser le même flux qu'un upload
  const handleClick = async (src, label) => {
    const res = await fetch(src);
    const blob = await res.blob();
    const file = new File([blob], `${label}.jpg`, { type: blob.type });
    onImageSelected(file);
  };

  return (
    <div className="grid grid-cols-4 gap-3">
      {SAMPLES.map((s) => (
        <button
          key={s.src}
          onClick={() => handleClick(s.src, s.label)}
          className="rounded-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition"
        >
          <img src={s.src} alt={s.label} className="w-full h-24 object-cover" />
          <p className="text-xs text-gray-400 py-1">{s.label}</p>
        </button>
      ))}
    </div>
  );
}