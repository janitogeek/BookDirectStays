import { useRef, useState } from "react";

interface FileDropProps {
  onFileDrop: (file: File) => void;
}

export function FileDrop({ onFileDrop }: FileDropProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onFileDrop(file);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onFileDrop(file);
    }
  }

  return (
    <div
      className="border-2 border-dashed rounded p-6 flex flex-col items-center justify-center cursor-pointer bg-white"
      onClick={() => inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={e => e.preventDefault()}
      tabIndex={0}
      role="button"
      aria-label="Upload image"
    >
      {preview ? (
        <img src={preview} alt="Preview" className="h-24 w-24 object-cover rounded mb-2" />
      ) : (
        <>
          <span className="text-3xl mb-2">☁️</span>
          <span>Click to upload</span>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
} 