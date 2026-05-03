import './index.css'

function App() {
  return (
    <div className="min-h-screen bg-green-800 flex flex-col items-center p-4">
      <header className="w-full max-w-5xl flex items-center justify-between py-3 px-4 mb-6">
        <h1 className="text-white text-2xl font-bold tracking-wide">🐾 Cat Solitaire</h1>
        <div className="flex gap-2">
          <button className="bg-green-700 hover:bg-green-600 text-white text-sm px-3 py-1.5 rounded-md transition-colors">
            New Game
          </button>
          <button className="bg-green-700 hover:bg-green-600 text-white text-sm px-3 py-1.5 rounded-md transition-colors">
            Stats
          </button>
        </div>
      </header>

      <main className="w-full max-w-5xl">
        <div className="flex justify-center items-center h-96 rounded-xl border-2 border-green-600 border-dashed">
          <p className="text-green-300 text-lg">Game board coming in Phase 2 🐱</p>
        </div>
      </main>
    </div>
  )
}

export default App
