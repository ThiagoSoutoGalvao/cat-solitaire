# gameReducer.js
> Defines the initial game state and the reducer function that handles all state transitions in Cat Solitaire.

## Overview

`gameReducer.js` is the central hub of game logic in Cat Solitaire. It defines what the entire game state looks like at any point in time and provides a single function — `gameReducer` — that updates that state in response to player actions. This file was introduced in Phase 2: Game Logic.

A _reducer_ is a pattern used with React's `useReducer` hook (or with Redux). Instead of updating state directly, components _dispatch_ an action — a plain object that describes what happened. The reducer receives the current state and the action, and returns the next state. This keeps all game logic in one place and makes it easy to trace how the game changes over time.

`gameReducer.js` imports from both `deck.js` and `deal.js` to bootstrap a fresh game board.

---

## `createInitialState`

Builds the complete starting state for a new game of Cat Solitaire.

### Parameters

None.

### Returns

A plain state object with the following shape:

| Property | Type | Description |
|---|---|---|
| `tableau` | `Array<Array>` | Seven columns of cards representing the main playing area. Produced by `deal`. See `deal.js` for the exact layout. |
| `foundations` | `Object` | Four empty arrays, one per suit: `{ hearts: [], diamonds: [], clubs: [], spades: [] }`. The goal of the game is to move all cards here, Ace through King, sorted by suit. |
| `stock` | `Array` | The face-down draw pile — the 24 cards not dealt into the tableau. |
| `waste` | `Array` | The face-up discard pile next to the stock. Starts empty. Cards from the stock are flipped here when the player draws. |
| `history` | `Array` | A list of past states or moves, reserved for undo functionality. Starts empty. |
| `moveCount` | `number` | A counter tracking how many moves the player has made. Starts at `0`. |

### Side Effects

None. Calls `createDeck`, `shuffle`, and `deal` internally, but does not read from or write to any external state.

---

## `gameReducer`

The reducer function that processes dispatched actions and returns the next game state.

A _reducer_ must be a _pure function_ — given the same state and action, it always returns the same result, and it never modifies the state object it receives directly.

### Parameters

| Name | Type | Description |
|---|---|---|
| `state` | `Object` | The current game state, shaped as described in `createInitialState` above. |
| `action` | `Object` | A plain object with at minimum a `type` string property describing what happened. Some actions carry additional data in other properties (e.g. `action.card`, `action.fromCol`). |

### Returns

A new state object representing the game after the action is applied. If the action type is not recognized, the current `state` is returned unchanged.

### Side Effects

None. `gameReducer` is a pure function.

---

## Action Types

The following action types are currently handled by `gameReducer`. As new gameplay features are added in later phases, this list will grow.

### `NEW_GAME`

| Field | Value |
|---|---|
| Type | `'NEW_GAME'` |
| Triggered by | The player clicking a "New Game" button in the UI, or the game initializing for the first time. |
| Payload | None required. |
| Effect | Calls `createInitialState()` and returns a completely fresh game state — a new shuffled deck, reset tableau, empty foundations, empty waste, zeroed move counter, and cleared history. |

```js
dispatch({ type: 'NEW_GAME' })
```

---

## Notes

- At Phase 2, `gameReducer` handles only the `NEW_GAME` action. The `default` branch returns the current state unchanged, so dispatching an unrecognized action is safe — the game will not crash, but it will not do anything either.
- As gameplay actions are added (moving cards, drawing from stock, sending cards to foundations, undoing moves), each should be added as a new `case` in the `switch` statement. Keep each case focused: compute the new state and return it without mutating `state`.
- The `history` array in the state is pre-wired for undo support. A common pattern is to push a snapshot of the previous state onto `history` before applying any reversible move, then restore it on an `UNDO` action.
- The `moveCount` field is available for the statistics system — it can be read by hooks like `useStats.js` to record how many moves a completed game took.
- Related files: `src/game/deck.js` (provides `createDeck` and `shuffle`), `src/game/deal.js` (provides `deal`), `src/hooks/useGameState.js` (connects `gameReducer` to React components via `useReducer`).
