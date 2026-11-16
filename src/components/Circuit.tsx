import { useRef } from "react";

type CircuitProps = {
  images: {
    src: string;
    name: string;
    size: string;
  }[];
  onFileSelect: (file: File) => void;
};

export default function Circuit({ images, onFileSelect }: CircuitProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <section className="w-120 p-2 border flex flex-col h-full">
      <div className="flex items-center justify-between shrink-0">
        <h2 className="font-bold">Actual Circuit Photos</h2>
        <button
          type="button"
          className="border px-3 py-1 font-bold"
          onClick={() => fileInputRef.current?.click()}
        >
          Upload New
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              onFileSelect(file);
            }
          }}
        />
      </div>

      <hr className="-mx-2 mt-2 mb-2 shrink-0" />

      <div className="min-h-0 flex-1 overflow-y-auto border border-dashed gray-400 bg-gray-50 p-10 flex flex-col items-center ">
        <p className="text-lg mb-10">Drop images here</p>

        {images.map((image) => (
          <div className="border p-3 w-full mb-5">
            <img src={image.src} alt={image.name} className="mb-3" />

            <p className="text-sm">{image.name}</p>
            <p className="text-sm text-gray-500">JPG · {image.size}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
