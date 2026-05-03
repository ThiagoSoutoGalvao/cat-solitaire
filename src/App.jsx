import { useReducer } from 'react'
import { gameReducer, createInitialState } from './game/gameReducer.js'
import { StockPile, WastePile, FoundationPile, TableauPile } from './components/Pile.jsx'
import './index.css'

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState)

  return (
    <div className="min-h-screen bg-green-800 flex flex-col items-center p-4">
      <header className="w-full max-w-5xl flex items-center justify-between py-3 px-4 mb-6">
        <h1 className="text-white text-2xl font-bold tracking-wide">🐾 Cat Solitaire</h1>
        <div className="flex gap-2">
          <button
            onClick={() => dispatch({ type: 'NEW_GAME' })}
            className="bg-green-700 hover:bg-green-600 text-white text-sm px-3 py-1.5 rounded-md transition-colors"
          >
            New Game
          </button>
        </div>
      </header>

      <main className="w-full max-w-5xl space-y-4">
        {/* Top row: stock, waste, gap, 4 foundations */}
        <div className="flex items-start gap-2">
          <StockPile cards={state.stock} />
          <WastePile cards={state.waste} />
          <div className="flex-1" />
          {['hearts', 'diamonds', 'clubs', 'spades'].map(suit => (
            <FoundationPile key={suit} suit={suit} cards={state.foundations[suit]} />
          ))}
        </div>

        {/* Tableau */}
        <div className="flex gap-2 items-start">
          {state.tableau.map((col, i) => (
            <TableauPile key={i} cards={col} />
          ))}
        </div>
      </main>
    </div>
  )
}
