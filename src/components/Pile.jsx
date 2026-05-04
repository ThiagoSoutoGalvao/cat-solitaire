import { useDroppable } from '@dnd-kit/core'
import Card from './Card.jsx'

const SUIT_SYMBOLS = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' }

function EmptySlot({ label, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`w-16 h-24 rounded-lg border-2 border-dashed border-green-500 border-opacity-50 flex items-center justify-center flex-shrink-0 ${onClick ? 'cursor-pointer' : ''}`}
    >
      <span className="text-green-400 text-opacity-60 text-xl">{label}</span>
    </div>
  )
}

export function StockPile({ cards, onDraw }) {
  if (cards.length === 0) return <EmptySlot label="↺" onClick={onDraw} />
  return <Card card={{ ...cards[cards.length - 1], faceUp: false }} onClick={onDraw} />
}

export function WastePile({ cards, drawCount = 1, onCardClick }) {
  if (cards.length === 0) return <EmptySlot label="" />

  const visibleCount = Math.min(drawCount, cards.length)
  const visible = cards.slice(-visibleCount)
  const topCard = visible[visible.length - 1]

  if (visibleCount === 1) {
    return (
      <Card
        card={{ ...topCard, faceUp: true }}
        onClick={onCardClick}
        dragId={topCard.id}
        dragData={{ from: { type: 'waste' } }}
      />
    )
  }

  return (
    <div
      className="relative flex-shrink-0 h-24"
      style={{ width: 64 + (visibleCount - 1) * 16 }}
    >
      {visible.map((card, i) => {
        const isTop = i === visible.length - 1
        return (
          <Card
            key={card.id}
            card={{ ...card, faceUp: true }}
            style={{ position: 'absolute', left: i * 16 }}
            onClick={isTop ? onCardClick : undefined}
            dragId={isTop ? card.id : undefined}
            dragData={isTop ? { from: { type: 'waste' } } : undefined}
          />
        )
      })}
    </div>
  )
}

export function FoundationPile({ suit, cards }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `foundation-${suit}`,
    data: { to: { type: 'foundation', suit } },
  })

  const borderClass = isOver
    ? 'border-yellow-300'
    : 'border-green-500 border-opacity-50'

  if (cards.length === 0) {
    return (
      <div
        ref={setNodeRef}
        className={`w-16 h-24 rounded-lg border-2 border-dashed ${borderClass} flex items-center justify-center flex-shrink-0 transition-colors`}
      >
        <span className="text-green-400 text-opacity-60 text-xl">{SUIT_SYMBOLS[suit]}</span>
      </div>
    )
  }

  return (
    <div ref={setNodeRef} className="relative flex-shrink-0 w-16 h-24">
      <Card card={{ ...cards[cards.length - 1], faceUp: true }} />
      {isOver && (
        <div className="absolute inset-0 rounded-lg border-2 border-yellow-300 pointer-events-none" />
      )}
    </div>
  )
}

export function TableauPile({ cards, col, onCardClick, activeDragFrom }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `tableau-${col}`,
    data: { to: { type: 'tableau', col } },
  })

  if (cards.length === 0) {
    return (
      <div
        ref={setNodeRef}
        className={`w-16 h-24 rounded-lg border-2 border-dashed ${isOver ? 'border-yellow-300' : 'border-green-500 border-opacity-50'} flex-shrink-0 transition-colors`}
      />
    )
  }

  return (
    <div
      ref={setNodeRef}
      className="relative flex-shrink-0 w-16"
      style={{ height: `${96 + (cards.length - 1) * 28}px` }}
    >
      {cards.map((card, i) => (
        <Card
          key={card.id}
          card={card}
          style={{ position: 'absolute', top: `${i * 28}px` }}
          onClick={card.faceUp && onCardClick ? () => onCardClick(i) : undefined}
          dragId={card.faceUp ? card.id : undefined}
          dragData={card.faceUp ? { from: { type: 'tableau', col, cardIndex: i } } : undefined}
          isPartOfDrag={activeDragFrom != null && i >= activeDragFrom}
        />
      ))}
      {isOver && (
        <div className="absolute inset-0 rounded-lg border-2 border-yellow-300 pointer-events-none" />
      )}
    </div>
  )
}
