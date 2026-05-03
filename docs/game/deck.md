# deck.js
> Creates and shuffles a standard 52-card deck for use in Cat Solitaire.

## Overview

`deck.js` is a pure utility file — it has no React components, no UI, and no side effects. Its sole responsibility is to define what a playing card looks like in the game and to produce a randomized deck of 52 cards ready for dealing. This file was introduced in Phase 2: Game Logic.

Two constants are exported alongside two functions. Everything in the rest of the game that needs to know about suits, values, or deck structure starts here.

## `SUITS`

An ordered array of the four card suits used in the game.

### Value

```
['hearts', 'diamonds', 'clubs', 'spades']
```

Suits are represented as lowercase strings. This exact spelling is used as keys throughout the game — for example, the `foundations` object in the game state uses these strings as property names.

---

## `VALUES`

An ordered array of the thirteen card values, from Ace to King.

### Value

```
['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
```

Values are represented as strings (not numbers), so face cards (`J`, `Q`, `K`) and the Ace (`A`) are handled naturally alongside numeric ranks.

---

## `createDeck`

Builds an unshuffled deck of 52 unique card objects — one for each combination of suit and value.

### Parameters

None.

### Returns

An array of 52 card objects. Each card object has the following shape:

| Property | Type | Description |
|---|---|---|
| `id` | `string` | A unique identifier for the card, e.g. `"hearts-A"` or `"spades-K"`. Formed by joining `suit` and `value` with a hyphen. |
| `suit` | `string` | One of the four values from `SUITS` (e.g. `"hearts"`). |
| `value` | `string` | One of the thirteen values from `VALUES` (e.g. `"A"`, `"10"`, `"K"`). |
| `faceUp` | `boolean` | Whether the card is visible to the player. Always `false` on creation — cards start face-down and are flipped by the game logic later. |

### Side Effects

None. `createDeck` always returns a fresh array without modifying any external state.

---

## `shuffle`

Randomizes the order of cards in a deck using the [Fisher-Yates algorithm](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle) — a widely-used method that guarantees each possible ordering is equally likely.

### Parameters

| Name | Type | Description |
|---|---|---|
| `deck` | `Array` | An array of card objects, typically the result of `createDeck()`. |

### Returns

A new array containing the same 52 card objects in a randomized order. The original `deck` array passed in is **not modified** — `shuffle` makes a copy first.

### How it works

Starting from the last card and working backwards, each card is swapped with a randomly chosen card at or before its current position. This produces a statistically unbiased shuffle.

### Side Effects

None. The input `deck` is not mutated.

---

## Notes

- `createDeck` always produces cards in the same deterministic order (hearts A–K, then diamonds A–K, etc.). Always pass the result through `shuffle` before dealing, or every game will be identical.
- The `id` field (`"hearts-A"`, `"spades-K"`, etc.) is used as a React key when rendering cards in the UI. It must remain unique across the entire deck — do not change the format without updating any components that rely on it.
- This file has no dependencies on any other project file. It is safe to modify or test in complete isolation.
- Related files: `src/game/deal.js` (consumes the shuffled deck), `src/game/gameReducer.js` (calls `createDeck` and `shuffle` via `deal` to set up a new game).
