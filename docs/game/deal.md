# deal.js
> Distributes a shuffled deck into the Klondike tableau and stock pile to set up a new game.

## Overview

`deal.js` is a pure utility file responsible for one specific job: taking a shuffled deck of 52 cards and laying them out in the starting configuration for Klondike Solitaire. It produces the seven tableau columns and the remaining stock pile. This file was introduced in Phase 2: Game Logic.

In Klondike Solitaire, the _tableau_ is the main playing area — the seven columns of cards spread across the table. The _stock_ is the face-down pile in the upper-left corner that players draw from during the game.

---

## `deal`

Distributes a shuffled deck into the classic Klondike starting layout.

### Parameters

| Name | Type | Description |
|---|---|---|
| `shuffledDeck` | `Array` | An array of 52 card objects (as produced by `createDeck` and randomized by `shuffle` from `deck.js`). The deck is consumed from left to right — index 0 is dealt first. |

### Returns

A plain object with two properties:

| Property | Type | Description |
|---|---|---|
| `tableau` | `Array<Array>` | An array of 7 columns. Column 0 has 1 card, column 1 has 2 cards, ..., column 6 has 7 cards — for a total of 28 cards dealt (1+2+3+4+5+6+7). The last card in each column (`row === col`) is `faceUp: true`; all others are `faceUp: false`. |
| `stock` | `Array` | The remaining 24 cards (indices 28–51 of the input deck), all with `faceUp: false`. These form the draw pile. |

### How it works

`deal` uses two nested loops to fill the tableau:

- The outer loop iterates over each column (0 through 6).
- The inner loop places cards into that column one at a time, from the top card down.
- Each card is spread (copied with `{ ...card }`) so the original deck array is not modified.
- The `faceUp` property is set to `true` only for the bottom-most card in each column (where `row === col`), matching the standard Klondike layout where only the last card in each column is revealed.

After dealing 28 cards into the tableau, the remaining cards are sliced off the deck and stored as the `stock` pile, all face-down.

### Side Effects

None. `shuffledDeck` is read but never modified. `deal` always returns a new object.

---

## Notes

- `deal` expects a full 52-card deck. Passing a shorter or differently-shaped array will produce an incorrect tableau without throwing an error — the loops will simply run out of cards silently.
- Each card is spread (`{ ...shuffledDeck[i++], faceUp: ... }`) to create a new object. This is intentional — it prevents tableau cards and stock cards from being the same object reference, which could cause unexpected mutation bugs if either pile is modified later.
- The tableau columns are indexed 0–6 (left to right), which matches how they are rendered and referenced throughout the rest of the game.
- Related files: `src/game/deck.js` (produces the input deck), `src/game/gameReducer.js` (calls `deal` as part of `createInitialState`).
