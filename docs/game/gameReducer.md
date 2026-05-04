# gameReducer.js
> Defines the initial game state and the reducer function that handles all state transitions in Cat Solitaire.

## Overview

`gameReducer.js` is the central hub of game logic in Cat Solitaire. It defines what the entire game state looks like at any point in time and provides a single function — `gameReducer` — that updates that state in response to player actions. This file was introduced in **Phase 2: Game Logic** and was updated in **Phase 4: Game Logic** to add the `DRAW`, `MOVE_CARD`, `AUTO_MOVE`, and `UNDO` action types.

A _reducer_ is a pattern used with React's `useReducer` hook (or with Redux). Instead of updating state directly, components _dispatch_ an action — a plain object that describes what happened. The reducer receives the current state and the action, and returns the next state. This keeps all game logic in one place and makes it easy to trace how the game changes over time.

`gameReducer.js` imports from `deck.js` and `deal.js` to bootstrap a fresh game board, and from `rules.js` to validate card moves.

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
| `history` | `Array` | A stack of past state snapshots used by the undo system. Starts empty. |
| `moveCount` | `number` | A counter tracking how many moves the player has made. Starts at `0`. |
| `drawCount` | `number` | How many cards are drawn from the stock at once. Defaults to `1`. Phase 7 will set this per difficulty level. |

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
| `action` | `Object` | A plain object with at minimum a `type` string property describing what happened. Some actions carry additional data (e.g. `action.from`, `action.to`). |

### Returns

A new state object representing the game after the action is applied. If the action type is not recognised, the current `state` is returned unchanged.

### Side Effects

None. `gameReducer` is a pure function. The `AUTO_MOVE` case delegates to `gameReducer` itself recursively, but this does not introduce side effects.

---

## Action Types

The following action types are handled by `gameReducer`.

### `NEW_GAME`

| Field | Value |
|---|---|
| Type | `'NEW_GAME'` |
| Triggered by | The player clicking a "New Game" button, or the game initialising for the first time. |
| Payload | None required. |
| Effect | Calls `createInitialState()` and returns a completely fresh game state — a new shuffled deck, reset tableau, empty foundations, empty waste, zeroed move counter, and cleared history. |

```js
dispatch({ type: 'NEW_GAME' })
```

---

### `DRAW`

| Field | Value |
|---|---|
| Type | `'DRAW'` |
| Triggered by | The player clicking the stock pile. Added in **Phase 4**. |
| Payload | None required. |
| Effect | If the stock has cards, moves `drawCount` cards from the top of the stock to the waste pile (flipping them face-up). If the stock is empty but the waste has cards, resets the waste back into the stock face-down (recycling). If both are empty, returns the state unchanged. Saves a snapshot to `history` for undo. |

```js
dispatch({ type: 'DRAW' })
```

---

### `MOVE_CARD`

| Field | Value |
|---|---|
| Type | `'MOVE_CARD'` |
| Triggered by | The player clicking a card to move it (after selecting a source and destination). Added in **Phase 4**. |
| Payload | `from` — source descriptor; `to` — destination descriptor (see below). |
| Effect | Extracts one or more cards from the source (`waste`, `tableau`, or `foundation`), validates the move against the rules in `rules.js`, and if valid, places the cards at the destination (`tableau` or `foundation`). Increments `moveCount`. Saves a snapshot to `history`. Returns the state unchanged if the move is illegal. |

**`from` shape:**

| Source type | Required fields |
|---|---|
| `{ type: 'waste' }` | No extra fields — always takes the top card. |
| `{ type: 'tableau', col: number, cardIndex: number }` | `col` is the column index (0–6); `cardIndex` is the index of the deepest card being moved (all cards from this index to the end of the array are moved together). |
| `{ type: 'foundation', suit: string }` | `suit` is one of `'hearts'`, `'diamonds'`, `'clubs'`, `'spades'` — takes the top card of that foundation. |

**`to` shape:**

| Destination type | Required fields |
|---|---|
| `{ type: 'tableau', col: number }` | `col` is the target column index. |
| `{ type: 'foundation', suit: string }` | `suit` is the target foundation suit. |

```js
dispatch({ type: 'MOVE_CARD', from: { type: 'waste' }, to: { type: 'tableau', col: 3 } })
```

---

### `AUTO_MOVE`

| Field | Value |
|---|---|
| Type | `'AUTO_MOVE'` |
| Triggered by | The player double-clicking a card (or a similar gesture). Added in **Phase 4**. |
| Payload | `from` — source descriptor, same shape as in `MOVE_CARD`. Only `waste` and `tableau` sources are supported. |
| Effect | Calls `findAutoMoveDestination` from `rules.js` to locate a valid destination for the card. If a destination is found, delegates to the `MOVE_CARD` case to execute the move (including history snapshot and move count increment). Returns state unchanged if no destination exists or the source is empty or face-down. |

```js
dispatch({ type: 'AUTO_MOVE', from: { type: 'tableau', col: 2, cardIndex: 5 } })
```

---

### `UNDO`

| Field | Value |
|---|---|
| Type | `'UNDO'` |
| Triggered by | The player pressing an Undo button. Added in **Phase 4**. |
| Payload | None required. |
| Effect | Pops the most recent snapshot from `history` and restores it as the current state (preserving the remaining history stack for further undos). Returns state unchanged if `history` is empty. |

```js
dispatch({ type: 'UNDO' })
```

---

## Notes

- The `history` array stores _snapshots_ — plain objects capturing `tableau`, `foundations`, `stock`, `waste`, `moveCount`, and `drawCount` at the moment before each reversible move. The `history` array itself is intentionally excluded from snapshots to avoid circular growth.
- Every action that changes game state (except `UNDO` and `NEW_GAME`) pushes a snapshot, making multi-step undo straightforward.
- `AUTO_MOVE` works by delegating to the `MOVE_CARD` case internally via a recursive `gameReducer` call. This means `AUTO_MOVE` always goes through the same validation path as a manual move.
- `drawCount` defaults to `1` but is designed to be configurable per difficulty setting in Phase 7. A draw-three mode would set `drawCount: 3`.
- Related files:
  - `src/game/deck.js` — provides `createDeck` and `shuffle`.
  - `src/game/deal.js` — provides `deal`.
  - `src/game/rules.js` — provides `canMoveToTableau`, `canMoveToFoundation`, and `findAutoMoveDestination`.
  - `src/hooks/useGameState.js` — connects `gameReducer` to React components via `useReducer`.
