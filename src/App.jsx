import { useReducer } from 'react'
import { gameReducer, createInitialState } from './game/gameReducer.js'
import { StockPile, WastePile, FoundationPile, TableauPile } from './components/Pile.jsx'
import './index.css'

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState)

  const handleStockClick = () => dispatch({ type: 'DRAW' })

  const handleWasteCardClick = () =>
    dispatch({ type: 'AUTO_MOVE', from: { type: 'waste' } })

  const handleTableauCardClick = (col, cardIndex) =>
    dispatch({ type: 'AUTO_MOVE', from: { type: 'tableau', col, cardIndex } })

  return (
    <div className="min-h-screen bg-green-800 flex flex-col items-center p-4">
      <header className="w-full max-w-5xl flex items-center justify-between py-3 px-4 mb-6">
        <h1 className="text-white text-2xl font-bold tracking-wide">🐾 Cat Solitaire</h1>
        <div className="flex items-center gap-3">
          <span className="text-green-300 text-sm">Moves: {state.moveCount}</span>
          <button
            onClick={() => dispatch({ type: 'UNDO' })}
            disabled={state.history.length === 0}
            className="bg-green-700 hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm px-3 py-1.5 rounded-md transition-colors"
          >
            Undo
          </button>
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
          <StockPile cards={state.stock} onDraw={handleStockClick} />
          <WastePile cards={state.waste} onCardClick={handleWasteCardClick} />
          <div className="flex-1" />
          {['hearts', 'diamonds', 'clubs', 'spades'].map(suit => (
            <FoundationPile key={suit} suit={suit} cards={state.foundations[suit]} />
          ))}
        </div>

        {/* Tableau */}
        <div className="flex gap-2 items-start">
          {state.tableau.map((col, i) => (
            <TableauPile
              key={i}
              cards={col}
              onCardClick={(cardIndex) => handleTableauCardClick(i, cardIndex)}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
