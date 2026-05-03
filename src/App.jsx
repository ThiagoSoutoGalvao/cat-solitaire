import { useReducer, useEffect } from 'react'
import { gameReducer, createInitialState } from './game/gameReducer.js'
import './index.css'

const RED_SUITS = new Set(['hearts', 'diamonds'])

function SimpleCard({ card }) {
  if (!card.faceUp) {
    return <div className="w-10 h-14 rounded bg-blue-700 border border-blue-500 flex-shrink-0" />
  }
  const red = RED_SUITS.has(card.suit)
  return (
    <div className={`w-10 h-14 rounded bg-white border border-gray-300 flex flex-col justify-between p-0.5 flex-shrink-0 ${red ? 'text-red-600' : 'text-gray-900'}`}>
      <span className="text-xs font-bold leading-none">{card.value}</span>
      <span className="text-xs leading-none capitalize">{card.suit.slice(0, 2)}</span>
    </div>
  )
}

function TableauColumn({ cards }) {
  return (
    <div className="relative flex-1" style={{ minHeight: '56px', height: `${56 + Math.max(0, cards.length - 1) * 22}px` }}>
      {cards.length === 0 && (
        <div className="w-10 h-14 rounded border-2 border-dashed border-green-600 opacity-40" />
      )}
      {cards.map((card, i) => (
        <div key={card.id} className="absolute" style={{ top: `${i * 22}px` }}>
          <SimpleCard card={card} />
        </div>
      ))}
    </div>
  )
}

function PilePlaceholder({ label, count }) {
  return (
    <div className="w-10 h-14 rounded border-2 border-dashed border-green-600 opacity-60 flex items-center justify-center flex-shrink-0">
      <span className="text-green-400 text-xs text-center leading-tight">{label}{count > 0 ? `\n${count}` : ''}</span>
    </div>
  )
}

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState)

  useEffect(() => {
    console.log('Game state:', state)
    console.log('Tableau counts:', state.tableau.map(col => col.length))
  }, [])

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
        {/* Top row: stock, waste, gap, foundations */}
        <div className="flex items-start gap-2">
          <PilePlaceholder label="Stock" count={state.stock.length} />
          <PilePlaceholder label="Waste" count={state.waste.length} />
          <div className="flex-1" />
          {Object.entries(state.foundations).map(([suit, cards]) => (
            <PilePlaceholder key={suit} label={suit.slice(0, 2).toUpperCase()} count={cards.length} />
          ))}
        </div>

        {/* Tableau */}
        <div className="flex gap-2 items-start">
          {state.tableau.map((col, i) => (
            <TableauColumn key={i} cards={col} />
          ))}
        </div>
      </main>
    </div>
  )
}
