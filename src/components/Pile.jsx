import Card from './Card.jsx'

const SUIT_SYMBOLS = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' }

function EmptySlot({ label }) {
  return (
    <div className="w-16 h-24 rounded-lg border-2 border-dashed border-green-500 border-opacity-50 flex items-center justify-center flex-shrink-0">
      <span className="text-green-400 text-opacity-60 text-xl">{label}</span>
    </div>
  )
}

export function StockPile({ cards }) {
  if (cards.length === 0) return <EmptySlot label="↺" />
  return <Card card={{ ...cards[cards.length - 1], faceUp: false }} />
}

export function WastePile({ cards }) {
  if (cards.length === 0) return <EmptySlot label="" />
  return <Card card={{ ...cards[cards.length - 1], faceUp: true }} />
}

export function FoundationPile({ suit, cards }) {
  if (cards.length === 0) return <EmptySlot label={SUIT_SYMBOLS[suit]} />
  return <Card card={{ ...cards[cards.length - 1], faceUp: true }} />
}

export function TableauPile({ cards }) {
  if (cards.length === 0) {
    return <div className="w-16 h-24 rounded-lg border-2 border-dashed border-green-500 border-opacity-50 flex-shrink-0" />
  }

  return (
    <div
      className="relative flex-shrink-0 w-16"
      style={{ height: `${96 + (cards.length - 1) * 28}px` }}
    >
      {cards.map((card, i) => (
        <Card
          key={card.id}
          card={card}
          style={{ position: 'absolute', top: `${i * 28}px` }}
        />
      ))}
    </div>
  )
}
