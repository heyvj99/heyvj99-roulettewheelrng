import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import RouletteWheel from './components/RouletteWheel'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-yellow-500 mb-8 text-center">
        Casino Roulette
      </h1>
      <div className="relative">
        <RouletteWheel />
        <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 text-yellow-500 text-center">
          <p className="text-lg">Drag and release to spin!</p>
        </div>
      </div>
    </div>
  )
}

export default App
