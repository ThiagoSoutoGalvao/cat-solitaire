export const SUITS = ['hearts', 'diamonds', 'clubs', 'spades']
export const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

export function createDeck() {
  return SUITS.flatMap(suit =>
    VALUES.map(value => ({ id: `${suit}-${value}`, suit, value, faceUp: false }))
  )
}

export function shuffle(deck) {
  const d = [...deck]
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[d[i], d[j]] = [d[j], d[i]]
  }
  return d
}
