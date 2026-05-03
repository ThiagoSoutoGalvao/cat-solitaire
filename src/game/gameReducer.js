import { createDeck, shuffle } from './deck.js'
import { deal } from './deal.js'

export function createInitialState() {
  const { tableau, stock } = deal(shuffle(createDeck()))
  return {
    tableau,
    foundations: { hearts: [], diamonds: [], clubs: [], spades: [] },
    stock,
    waste: [],
    history: [],
    moveCount: 0,
  }
}

export function gameReducer(state, action) {
  switch (action.type) {
    case 'NEW_GAME':
      return createInitialState()
    default:
      return state
  }
}
