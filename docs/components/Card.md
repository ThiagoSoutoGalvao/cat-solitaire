# Card
> Renders a single playing card as a styled UI element — either face-up (showing value and suit) or face-down (showing a plain blue back).

## Overview

`Card` is a pure display component that takes a card data object and renders it as a fixed-size rectangle styled with Tailwind CSS. It has no internal state and performs no side effects — it simply maps card data to HTML. `Card` is the lowest-level visual building block in Cat Solitaire and is used by every pile component in `Pile.jsx`. It was introduced in **Phase 3: Card Component and Board Layout** and updated in **Phase 4: Game Logic** to support click interactions via the `onClick` prop.

## Card

`Card` renders one of two layouts based on the `card.faceUp` flag:

- **Face-down**: A solid blue rectangle with a faint inner border, representing the back of a card. No suit or value is displayed.
- **Face-up**: A white rectangle showing the card's rank (e.g. `K`, `7`, `A`) and suit symbol (e.g. `♥`, `♠`) in three positions — top-left corner, centre, and bottom-right corner (rotated 180° to read right-side-up when viewed from the opposite side of the table).

Suit colours follow standard card conventions: hearts and diamonds are red (`text-red-600`); clubs and spades are black (`text-gray-900`). These mappings are defined in the module-level constant `SUIT_SYMBOLS`.

### Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `card` | `object` | Yes | The card data object. Must have `faceUp` (boolean), `suit` (string: `'hearts'`, `'diamonds'`, `'clubs'`, or `'spades'`), and `value` (string: e.g. `'A'`, `'2'`…`'K'`). |
| `style` | `object` | No | Inline CSS styles passed directly to the outer `<div>`. Defaults to an empty object `{}`. Used by `TableauPile` to absolutely position stacked cards via `top` offset. |
| `className` | `string` | No | Additional Tailwind CSS class names appended to the outer `<div>`. Defaults to an empty string. |
| `onClick` | `function` | No | A callback function invoked when the player clicks the card. Added in **Phase 4**. When provided, the card renders with a `cursor-pointer` cursor; face-up cards also get a `hover:brightness-95` effect to give visual feedback that the card is interactive. When omitted, the card is non-interactive. |

### State

`Card` manages no internal state. It is a fully controlled, stateless component — its output depends entirely on the props it receives.

### Interactions & Side Effects

`Card` optionally handles click interactions via the `onClick` prop added in **Phase 4**. When `onClick` is provided, clicking anywhere on the card's outer `<div>` triggers the callback. The component runs no `useEffect` hooks and has no side effects, no API calls, and no `localStorage` access.

The clickable state is derived from `!!onClick` — a local variable named `clickable` that evaluates to `true` if a callback was passed, `false` otherwise. This boolean gates both the `cursor-pointer` class and (for face-up cards only) the `hover:brightness-95` hover effect.

The `select-none` CSS class on the face-up layout prevents the browser from highlighting card text when the user clicks or drags, which is important for a card game where mouse interactions are frequent.

## Notes

- `Card` accepts an optional `onClick` prop (added in Phase 4) but delegates all game logic to the caller. The component only fires the callback — it does not know anything about game state, selected cards, or move validation.
- The fixed dimensions (`w-16 h-24`, equivalent to 64 × 96 px) are relied upon by `TableauPile` in `Pile.jsx`, which calculates its total height based on these values plus a 28 px per-card vertical offset. Changing the card dimensions here will break the tableau layout.
- The `SUIT_SYMBOLS` constant is defined locally at the top of this file and is not exported. If suit symbols or colours need to be reused elsewhere, extract this constant to a shared utilities file.
- Related file: `src/components/Pile.jsx` — all pile components import and render `Card`.
