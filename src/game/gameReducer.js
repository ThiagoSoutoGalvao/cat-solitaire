import { createDeck, shuffle } from './deck.js'
import { deal } from './deal.js'
import { canMoveToTableau, canMoveToFoundation, findAutoMoveDestination } from './rules.js'

export const DIFFICULTIES = {
  easy:   { label: 'Easy',   drawCount: 1, undoLimit: Infinity },
  normal: { label: 'Normal', drawCount: 3, undoLimit: 3 },
  hard:   { label: 'Hard',   drawCount: 3, undoLimit: 0 },
}

export function createInitialState(difficulty = 'easy') {
  const { drawCount } = DIFFICULTIES[difficulty]
  const { tableau, stock } = deal(shuffle(createDeck()))
  return {
    tableau,
    foundations: { hearts: [], diamonds: [], clubs: [], spades: [] },
    stock,
    waste: [],
    history: [],
    moveCount: 0,
    drawCount,
    difficulty,
  }
}

function snapshot(state) {
  return {
    tableau: state.tableau,
    foundations: state.foundations,
    stock: state.stock,
    waste: state.waste,
    moveCount: state.moveCount,
    drawCount: state.drawCount,
    difficulty: state.difficulty,
  }
}

function pushHistory(state) {
  const { undoLimit } = DIFFICULTIES[state.difficulty]
  if (undoLimit === 0) return state.history
  const next = [...state.history, snapshot(state)]
  return undoLimit === Infinity ? next : next.slice(-undoLimit)
}

function flipTopCard(tableau, col) {
  const column = tableau[col]
  if (column.length === 0 || column[column.length - 1].faceUp) return tableau
  return tableau.map((c, i) =>
    i === col ? [...c.slice(0, -1), { ...c[c.length - 1], faceUp: true }] : c
  )
}

export function gameReducer(state, action) {
  switch (action.type) {

    case 'NEW_GAME':
      return createInitialState(action.difficulty || state.difficulty)

    case 'DRAW': {
      if (state.stock.length === 0) {
        if (state.waste.length === 0) return state
        return {
          ...state,
          stock: [...state.waste].reverse().map(c => ({ ...c, faceUp: false })),
          waste: [],
          history: pushHistory(state),
        }
      }
      const drawn = state.stock
        .slice(-state.drawCount)
        .map(c => ({ ...c, faceUp: true }))
      return {
        ...state,
        stock: state.stock.slice(0, -state.drawCount),
        waste: [...state.waste, ...drawn],
        history: pushHistory(state),
      }
    }

    case 'MOVE_CARD': {
      const { from, to } = action
      let movingCards = []
      let newTableau = state.tableau
      let newFoundations = state.foundations
      let newWaste = state.waste

      if (from.type === 'waste') {
        if (state.waste.length === 0) return state
        movingCards = [state.waste[state.waste.length - 1]]
        newWaste = state.waste.slice(0, -1)
      } else if (from.type === 'tableau') {
        const col = state.tableau[from.col]
        if (from.cardIndex >= col.length) return state
        movingCards = col.slice(from.cardIndex)
        newTableau = state.tableau.map((c, i) =>
          i === from.col ? c.slice(0, from.cardIndex) : c
        )
        newTableau = flipTopCard(newTableau, from.col)
      } else if (from.type === 'foundation') {
        const pile = state.foundations[from.suit]
        if (pile.length === 0) return state
        movingCards = [pile[pile.length - 1]]
        newFoundations = { ...state.foundations, [from.suit]: pile.slice(0, -1) }
      }

      const card = movingCards[0]
      if (to.type === 'tableau') {
        if (from.type === 'tableau' && from.col === to.col) return state
        if (!canMoveToTableau(card, newTableau[to.col])) return state
        newTableau = newTableau.map((c, i) => i === to.col ? [...c, ...movingCards] : c)
      } else if (to.type === 'foundation') {
        if (movingCards.length !== 1) return state
        if (!canMoveToFoundation(card, newFoundations[to.suit])) return state
        newFoundations = { ...newFoundations, [to.suit]: [...newFoundations[to.suit], card] }
      }

      return {
        ...state,
        tableau: newTableau,
        foundations: newFoundations,
        waste: newWaste,
        moveCount: state.moveCount + 1,
        history: pushHistory(state),
      }
    }

    case 'AUTO_MOVE': {
      const { from } = action
      let card, cardCount

      if (from.type === 'waste') {
        if (state.waste.length === 0) return state
        card = state.waste[state.waste.length - 1]
        cardCount = 1
      } else if (from.type === 'tableau') {
        const col = state.tableau[from.col]
        if (from.cardIndex >= col.length || !col[from.cardIndex].faceUp) return state
        card = col[from.cardIndex]
        cardCount = col.length - from.cardIndex
      } else {
        return state
      }

      const dest = findAutoMoveDestination(card, cardCount, state)
      if (!dest) return state
      return gameReducer(state, { type: 'MOVE_CARD', from, to: dest })
    }

    case 'UNDO': {
      if (state.history.length === 0) return state
      const prev = state.history[state.history.length - 1]
      return { ...prev, history: state.history.slice(0, -1) }
    }

    default:
      return state
  }
}
