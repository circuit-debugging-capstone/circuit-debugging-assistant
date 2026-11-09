import { useRef } from "react";

type SchematicProps = {
  fileName?: string;
  fileSize?: string;
  onFileSelect: (file: File) => void;
};

export default function Schematic({
  fileName,
  fileSize,
  onFileSelect,
}: SchematicProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <section className="w-120 p-2 border">
      <div className="flex items-center justify-between">
        <h2 className="font-bold">Reference Schematic</h2>
        <button
          type="button"
          className="border px-3 py-1 font-bold"
          onClick={() => fileInputRef.current?.click()}
        >
          Replace
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".sch"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              onFileSelect(file);
            }
          }}
        />
      </div>

      <hr className="-mx-2 mt-2 mb-2" />

      <div className="border border-dashed gray-400 bg-gray-50 p-10 flex flex-col items-center justify-center">
        <p className="text-lg mb-10">Drop .sch file here</p>

        {fileName && fileSize && (
          <div className="border p-3 w-full">
            <p className="text-sm">{fileName}</p>
            <p className="text-sm text-gray-500">SCH · {fileSize}</p>
          </div>
        )}
      </div>
    </section>
  );
}
