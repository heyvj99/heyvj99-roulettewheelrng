import './App.css'
import RouletteWheel from './components/RouletteWheel'

function App() {

  return (
    <div className="max-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-start p-4 h-full">
      <h1 className="casino-title text-4xl font-bold text-yellow-500 mb-8 text-center">
        Casino Roulette
      </h1>
      <div className="relative">
        <RouletteWheel />
        <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 text-yellow-500 text-center">
          {/* <p className="text-lg">Drag and release to spin!</p> */}
        </div>
      </div>
    </div>
  )
}

export default App
