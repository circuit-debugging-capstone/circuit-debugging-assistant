import Header from "./components/Header";
import Schematic from "./components/Schematic";
import Circuit from "./components/Circuit";
import Chatbot from "./components/Chatbot";
import breadboardImage from "./assets/breadboard.jpg";

function App() {
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
                fileName="circuit-schematic.sch"
                fileSize="24 KB"
                onFileSelect={(file) => console.log(file)}
              />
            </div>

            <div className="p-4 h-[70vh]">
              <Circuit
                images={[
                  {
                    src: breadboardImage,
                    name: "breadboard_top.jpg",
                    size: "1.8 MB",
                  },
                  {
                    src: breadboardImage,
                    name: "breadboard_left.jpg",
                    size: "2.1 MB",
                  },
                  {
                    src: breadboardImage,
                    name: "breadboard_right.jpg",
                    size: "2.2 MB",
                  },
                ]}
                onFileSelect={(file) => console.log(file)}
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="mt-5 text-2xl font-bold px-4">Circuit Assistent</h2>

          <div className="p-4 h-[70vh]">
            <Chatbot />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
