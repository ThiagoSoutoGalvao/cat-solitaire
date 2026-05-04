import { useReducer, useState, useEffect } from 'react'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { gameReducer, createInitialState, DIFFICULTIES } from './game/gameReducer.js'
import { findNextFoundationMove } from './game/rules.js'
import { StockPile, WastePile, FoundationPile, TableauPile } from './components/Pile.jsx'
import Card from './components/Card.jsx'
import './index.css'

export default function App() {
  const [state, dispatch] = useReducer(
    gameReducer,
    localStorage.getItem('catSolitaire_difficulty') || 'easy',
    createInitialState
  )

  useEffect(() => {
    localStorage.setItem('catSolitaire_difficulty', state.difficulty)
  }, [state.difficulty])
  const [activeDrag, setActiveDrag] = useState(null)
  const [autoCompleting, setAutoCompleting] = useState(false)

  const isWon = Object.values(state.foundations).every(pile => pile.length === 13)

  const canAutoComplete =
    !isWon &&
    state.stock.length === 0 &&
    state.waste.length === 0 &&
    state.tableau.every(col => col.every(card => card.faceUp))

  useEffect(() => {
    if (!autoCompleting || isWon) {
      setAutoCompleting(false)
      return
    }
    const timer = setTimeout(() => {
      const move = findNextFoundationMove(state)
      if (!move) {
        setAutoCompleting(false)
        return
      }
      dispatch({ type: 'MOVE_CARD', ...move })
    }, 150)
    return () => clearTimeout(timer)
  }, [autoCompleting, state, isWon])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const handleStockClick = () => dispatch({ type: 'DRAW' })

  const handleWasteCardClick = () =>
    dispatch({ type: 'AUTO_MOVE', from: { type: 'waste' } })

  const handleTableauCardClick = (col, cardIndex) =>
    dispatch({ type: 'AUTO_MOVE', from: { type: 'tableau', col, cardIndex } })

  function handleDragStart({ active }) {
    setActiveDrag(active.data.current)
  }

  function handleDragEnd({ active, over }) {
    setActiveDrag(null)
    if (!over) return
    const from = active.data.current?.from
    const to = over.data.current?.to
    if (!from || !to) return
    dispatch({ type: 'MOVE_CARD', from, to })
  }

  const draggedCards = activeDrag
    ? activeDrag.from.type === 'waste'
      ? [state.waste[state.waste.length - 1]]
      : state.tableau[activeDrag.from.col].slice(activeDrag.from.cardIndex)
    : []

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-green-800 flex flex-col items-center p-4">
        <header className="w-full max-w-5xl flex items-center justify-between py-3 px-4 mb-6">
          <h1 className="text-white text-2xl font-bold tracking-wide">🐾 Cat Solitaire</h1>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {Object.entries(DIFFICULTIES).map(([key, { label }]) => (
                <button
                  key={key}
                  onClick={() => dispatch({ type: 'NEW_GAME', difficulty: key })}
                  className={`text-xs px-2.5 py-1 rounded transition-colors ${
                    state.difficulty === key
                      ? 'bg-white text-green-800 font-semibold'
                      : 'bg-green-700 hover:bg-green-600 text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <span className="text-green-300 text-sm">Moves: {state.moveCount}</span>
            {canAutoComplete && !autoCompleting && (
              <button
                onClick={() => setAutoCompleting(true)}
                className="bg-yellow-500 hover:bg-yellow-400 text-white text-sm px-3 py-1.5 rounded-md transition-colors"
              >
                Auto-complete
              </button>
            )}
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
          <div className="flex items-start gap-2">
            <StockPile cards={state.stock} onDraw={handleStockClick} />
            <WastePile cards={state.waste} drawCount={state.drawCount} onCardClick={handleWasteCardClick} />
            <div className="flex-1" />
            {['hearts', 'diamonds', 'clubs', 'spades'].map(suit => (
              <FoundationPile key={suit} suit={suit} cards={state.foundations[suit]} />
            ))}
          </div>

          <div className="flex gap-2 items-start">
            {state.tableau.map((col, i) => (
              <TableauPile
                key={i}
                col={i}
                cards={col}
                onCardClick={(cardIndex) => handleTableauCardClick(i, cardIndex)}
                activeDragFrom={
                  activeDrag?.from.type === 'tableau' && activeDrag.from.col === i
                    ? activeDrag.from.cardIndex
                    : null
                }
              />
            ))}
          </div>
        </main>
      </div>

      {isWon && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center shadow-2xl">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">You won!</h2>
            <p className="text-gray-500 mb-6">Completed in {state.moveCount} moves</p>
            <button
              onClick={() => dispatch({ type: 'NEW_GAME' })}
              className="bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
            >
              Play again
            </button>
          </div>
        </div>
      )}

      <DragOverlay>
        {draggedCards.length > 0 && (
          <div
            className="relative"
            style={{ width: 64, height: 96 + (draggedCards.length - 1) * 28 }}
          >
            {draggedCards.map((card, i) => (
              <Card
                key={card.id}
                card={card}
                style={{ position: 'absolute', top: i * 28 }}
              />
            ))}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
