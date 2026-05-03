const SUIT_SYMBOLS = {
  hearts:   { symbol: '♥', color: 'text-red-600' },
  diamonds: { symbol: '♦', color: 'text-red-600' },
  clubs:    { symbol: '♣', color: 'text-gray-900' },
  spades:   { symbol: '♠', color: 'text-gray-900' },
}

export default function Card({ card, style = {}, className = '' }) {
  if (!card.faceUp) {
    return (
      <div
        style={style}
        className={`w-16 h-24 rounded-lg border border-gray-400 bg-blue-700 shadow-md flex items-center justify-center flex-shrink-0 ${className}`}
      >
        <div className="w-12 h-20 rounded border-2 border-blue-400 opacity-40" />
      </div>
    )
  }

  const { symbol, color } = SUIT_SYMBOLS[card.suit]

  return (
    <div
      style={style}
      className={`w-16 h-24 rounded-lg border border-gray-300 bg-white shadow-md flex flex-col justify-between p-1 flex-shrink-0 select-none ${className}`}
    >
      {/* Top-left corner */}
      <div className={`flex flex-col items-start leading-none ${color}`}>
        <span className="text-sm font-bold leading-none">{card.value}</span>
        <span className="text-sm leading-none">{symbol}</span>
      </div>
      {/* Centre symbol */}
      <div className={`flex items-center justify-center text-2xl ${color}`}>
        {symbol}
      </div>
      {/* Bottom-right corner (rotated) */}
      <div className={`flex flex-col items-end leading-none rotate-180 ${color}`}>
        <span className="text-sm font-bold leading-none">{card.value}</span>
        <span className="text-sm leading-none">{symbol}</span>
      </div>
    </div>
  )
}
