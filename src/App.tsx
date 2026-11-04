import Header from './components/Header'
import Schematic from './components/Schematic'
import Circuit from './components/Circuit'
import Chatbot from './components/Chatbot'


function App() {

  return (
    <div className="min-h-screen font-serif">
      <Header />

      <div className="flex">

        <div>
          <h2 className="mt-5 text-2xl font-bold px-4">Visual Circuit Inspector</h2>
          <div className="flex">

            <div className="p-4">
              <Schematic/>
            </div>

            <div className="p-4 h-[70vh]">
              <Circuit/>
            </div>

          </div>
        </div>

        <div>
          <h2 className="mt-5 text-2xl font-bold px-4">Circuit Assistent</h2>
          
          <div className="p-4 h-[70vh]">
            <Chatbot/>
          </div>

        </div>

      </div>

    </div>
  )
}

export default App
