import { useEffect, useState } from "react";
import Header from "./components/Header";
import Schematic from "./components/Schematic";
import Circuit from "./components/Circuit";
import Chatbot from "./components/Chatbot";
import breadboardImage from "./assets/breadboard.jpg";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function App() {
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [referencePreview, setReferencePreview] = useState<string | undefined>(
    breadboardImage
  );

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [circuitImages, setCircuitImages] = useState([
    { src: breadboardImage, name: "breadboard_top.jpg", size: "1.8 MB" },
  ]);

  // Preload the bundled breadboard.jpg as default File objects so Chat works out of the box
  useEffect(() => {
    fetch(breadboardImage)
      .then((res) => res.blob())
      .then((blob) => {
        const defaultRef = new File([blob], "reference_circuit.jpg", {
          type: blob.type || "image/jpeg",
        });
        const defaultPhoto = new File([blob], "breadboard_top.jpg", {
          type: blob.type || "image/jpeg",
        });
        setReferenceFile((prev) => prev ?? defaultRef);
        setPhotoFile((prev) => prev ?? defaultPhoto);
      })
      .catch((err) => console.error("Failed to load default sample image:", err));
  }, []);

  function handleSchematicSelect(file: File) {
    setReferenceFile(file);
    setReferencePreview(URL.createObjectURL(file));
  }

  function handleCircuitPhotoSelect(file: File) {
    setPhotoFile(file);
    const previewUrl = URL.createObjectURL(file);
    setCircuitImages((prev) => [
      { src: previewUrl, name: file.name, size: formatFileSize(file.size) },
      ...prev,
    ]);
  }

  return (
    <div className="min-h-screen font-serif">
      <Header />

      <div className="flex">
        <div>
          <h2 className="mt-5 text-2xl font-bold px-4">
            Visual Circuit Inspector
          </h2>
          <div className="flex">
            <div className="p-4">
              <Schematic
                fileName={referenceFile?.name ?? "reference_circuit.jpg"}
                fileSize={
                  referenceFile ? formatFileSize(referenceFile.size) : "1.8 MB"
                }
                previewUrl={referencePreview}
                onFileSelect={handleSchematicSelect}
              />
            </div>

            <div className="p-4 h-[70vh]">
              <Circuit
                images={circuitImages}
                onFileSelect={handleCircuitPhotoSelect}
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="mt-5 text-2xl font-bold px-4">Circuit Assistant</h2>

          <div className="p-4 h-[70vh]">
            <Chatbot referenceFile={referenceFile} photoFile={photoFile} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;