import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function Dropzone({ onImageSelected }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onImageSelected(acceptedFiles[0]);
    }
  }, [onImageSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors
        ${isDragActive
          ? "border-blue-400 bg-blue-950"
          : "border-gray-600 hover:border-blue-500 bg-gray-900"
        }`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-blue-400 text-lg">Dépose l'image ici...</p>
      ) : (
        <div>
          <p className="text-gray-300 text-lg">📁 Glisse une image ici</p>
          <p className="text-gray-500 text-sm mt-2">ou clique pour parcourir</p>
        </div>
      )}
    </div>
  );
}