export const VALUE_ORDER = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

export function cardValue(value) {
  return VALUE_ORDER.indexOf(value) + 1
}

export function isRed(suit) {
  return suit === 'hearts' || suit === 'diamonds'
}

export function canMoveToTableau(card, targetColumn) {
  if (targetColumn.length === 0) return card.value === 'K'
  const top = targetColumn[targetColumn.length - 1]
  return (
    isRed(card.suit) !== isRed(top.suit) &&
    cardValue(card.value) === cardValue(top.value) - 1
  )
}

export function canMoveToFoundation(card, foundationPile) {
  if (foundationPile.length === 0) return card.value === 'A'
  const top = foundationPile[foundationPile.length - 1]
  return card.suit === top.suit && cardValue(card.value) === cardValue(top.value) + 1
}

export function findNextFoundationMove(state) {
  const { waste, tableau, foundations } = state

  if (waste.length > 0) {
    const card = waste[waste.length - 1]
    if (canMoveToFoundation(card, foundations[card.suit])) {
      return { from: { type: 'waste' }, to: { type: 'foundation', suit: card.suit } }
    }
  }

  for (let col = 0; col < tableau.length; col++) {
    const column = tableau[col]
    if (column.length === 0) continue
    const card = column[column.length - 1]
    if (!card.faceUp) continue
    if (canMoveToFoundation(card, foundations[card.suit])) {
      return { from: { type: 'tableau', col, cardIndex: column.length - 1 }, to: { type: 'foundation', suit: card.suit } }
    }
  }

  return null
}

export function findAutoMoveDestination(card, cardCount, state) {
  // Only single cards can go to foundations
  if (cardCount === 1 && canMoveToFoundation(card, state.foundations[card.suit])) {
    return { type: 'foundation', suit: card.suit }
  }
  for (let col = 0; col < state.tableau.length; col++) {
    if (canMoveToTableau(card, state.tableau[col])) {
      return { type: 'tableau', col }
    }
  }
  return null
}
