# rules.js
> Provides pure functions that encode the movement rules for Cat Solitaire — determining whether a card can be placed on a tableau column or a foundation pile, and finding valid auto-move destinations.

## Overview

`rules.js` is the single source of truth for Klondike Solitaire's card placement rules. It is a pure utility module — every function here takes inputs, computes a result, and returns it without touching any outside state. No React, no UI, no side effects.

This file was introduced in **Phase 4: Game Logic** and is imported by `gameReducer.js` to validate moves before applying them to the game state.

---

## `VALUE_ORDER`

A module-level constant (exported) listing every card rank in ascending order:

```js
['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
```

Its index position (plus one) defines a card's numeric value and is used by `cardValue` to compare ranks.

---

## `cardValue`

Converts a card's rank string to a comparable number.

### Parameters

| Name | Type | Description |
|---|---|---|
| `value` | `string` | A card rank string, e.g. `'A'`, `'7'`, `'K'`. Must be a member of `VALUE_ORDER`. |

### Returns

`number` — the 1-based numeric position of the rank in `VALUE_ORDER`. For example, `'A'` returns `1`, `'K'` returns `13`.

### Side Effects

None.

---

## `isRed`

Determines whether a suit is red.

### Parameters

| Name | Type | Description |
|---|---|---|
| `suit` | `string` | One of `'hearts'`, `'diamonds'`, `'clubs'`, or `'spades'`. |

### Returns

`boolean` — `true` if the suit is `'hearts'` or `'diamonds'`, `false` otherwise.

### Side Effects

None.

---

## `canMoveToTableau`

Checks whether a card can legally be placed on top of a tableau column according to Klondike rules: alternating colours, descending rank.

- An empty column accepts **only a King**.
- A non-empty column accepts a card if it is the opposite colour to the top card and is exactly one rank lower.

### Parameters

| Name | Type | Description |
|---|---|---|
| `card` | `object` | The card being moved. Must have `suit` (string) and `value` (string) properties. |
| `targetColumn` | `array` | The array of card objects already in the destination tableau column. May be empty. |

### Returns

`boolean` — `true` if the move is legal, `false` otherwise.

### Side Effects

None.

---

## `canMoveToFoundation`

Checks whether a card can legally be placed on a foundation pile according to Klondike rules: same suit, ascending rank starting from Ace.

- An empty foundation pile accepts **only an Ace**.
- A non-empty foundation pile accepts a card if it matches the pile's suit and is exactly one rank higher than the current top card.

### Parameters

| Name | Type | Description |
|---|---|---|
| `card` | `object` | The card being moved. Must have `suit` (string) and `value` (string) properties. |
| `foundationPile` | `array` | The array of card objects already on the target foundation pile. May be empty. |

### Returns

`boolean` — `true` if the move is legal, `false` otherwise.

### Side Effects

None.

---

## `findAutoMoveDestination`

Given a card (and the number of cards being moved as a group), searches the current game state for a valid destination. Foundations are preferred over tableau columns for single cards.

The auto-move logic works in two steps:
1. If `cardCount === 1` and the card can legally go to its matching foundation pile, return that foundation as the destination.
2. Otherwise, scan the tableau columns left to right and return the first column that can legally accept the card.
3. If no valid destination is found, return `null`.

### Parameters

| Name | Type | Description |
|---|---|---|
| `card` | `object` | The card at the bottom of the moving stack (the one that must satisfy placement rules). Must have `suit` and `value` properties. |
| `cardCount` | `number` | The number of cards being moved together. Only `1` is eligible for a foundation move. |
| `state` | `object` | The current game state. Must include `foundations` (object keyed by suit) and `tableau` (array of column arrays). |

### Returns

One of:
- `{ type: 'foundation', suit: string }` — move to the foundation for this suit.
- `{ type: 'tableau', col: number }` — move to this tableau column index.
- `null` — no valid destination exists.

### Side Effects

None.

---

## Notes

- All functions in this file are pure and stateless — they are safe to call as many times as needed without any risk of changing game state.
- `gameReducer.js` imports `canMoveToTableau`, `canMoveToFoundation`, and `findAutoMoveDestination` to validate moves before applying them.
- The `VALUE_ORDER` export can be used by any module that needs to compare or sort card ranks — for example, a future statistics or hints system.
- `findAutoMoveDestination` only looks for the **first** valid tableau destination, not necessarily the best strategic move. Future difficulty or hint systems may want a smarter version of this function.
- Related files:
  - `src/game/gameReducer.js` — imports and uses all three move-validation functions.
  - `src/game/deck.js` — defines the card object shape that these functions operate on.
