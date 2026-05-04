import { useDraggable } from '@dnd-kit/core'

const SUIT_SYMBOLS = {
  hearts:   { symbol: '♥', color: 'text-red-600' },
  diamonds: { symbol: '♦', color: 'text-red-600' },
  clubs:    { symbol: '♣', color: 'text-gray-900' },
  spades:   { symbol: '♠', color: 'text-gray-900' },
}

export default function Card({ card, style = {}, className = '', onClick, dragId, dragData, isPartOfDrag }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: dragId ?? `static-${card.id}`,
    data: dragData,
    disabled: !dragId,
  })

  const dragStyle = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 999 }
    : {}

  const combinedStyle = {
    ...style,
    ...dragStyle,
    opacity: isDragging || isPartOfDrag ? 0.4 : 1,
  }

  const clickable = !!onClick
  const draggable = !!dragId

  if (!card.faceUp) {
    return (
      <div
        ref={setNodeRef}
        style={combinedStyle}
        onClick={onClick}
        className={`w-16 h-24 rounded-lg border border-gray-400 bg-blue-700 shadow-md flex items-center justify-center flex-shrink-0 ${clickable ? 'cursor-pointer' : ''} ${className}`}
      >
        <div className="w-12 h-20 rounded border-2 border-blue-400 opacity-40" />
      </div>
    )
  }

  const { symbol, color } = SUIT_SYMBOLS[card.suit]

  return (
    <div
      ref={setNodeRef}
      style={combinedStyle}
      onClick={onClick}
      {...(draggable ? { ...listeners, ...attributes } : {})}
      className={`w-16 h-24 rounded-lg border border-gray-300 bg-white shadow-md flex flex-col justify-between p-1 flex-shrink-0 select-none ${clickable || draggable ? 'cursor-pointer hover:brightness-95' : ''} ${className}`}
    >
      <div className={`flex flex-col items-start leading-none ${color}`}>
        <span className="text-sm font-bold leading-none">{card.value}</span>
        <span className="text-sm leading-none">{symbol}</span>
      </div>
      <div className={`flex items-center justify-center text-2xl ${color}`}>
        {symbol}
      </div>
      <div className={`flex flex-col items-end leading-none rotate-180 ${color}`}>
        <span className="text-sm font-bold leading-none">{card.value}</span>
        <span className="text-sm leading-none">{symbol}</span>
      </div>
    </div>
  )
}
