# Pile
> Exports four specialised pile components — `StockPile`, `WastePile`, `FoundationPile`, and `TableauPile` — that render each of the board areas in a Klondike Solitaire game.

## Overview

`Pile.jsx` contains all the board-area components that make up the Cat Solitaire game board. Each component is responsible for displaying one type of card pile. They all rely on the `Card` component (from `Card.jsx`) to render individual cards, and they share a local `EmptySlot` helper for showing a placeholder when a pile is empty. This file was introduced in **Phase 3: Card Component and Board Layout** and updated in **Phase 4: Game Logic** to add click callback props so the player can interact with the stock, waste, and tableau piles.

In Klondike Solitaire there are four types of piles:

- **Stock** — the face-down draw pile in the top-left corner.
- **Waste** — the face-up discard pile next to the stock.
- **Foundation** — the four suit-specific completion piles in the top-right area (Ace through King per suit).
- **Tableau** — the seven columns of overlapping cards that make up most of the playing field.

## EmptySlot (internal helper)

`EmptySlot` is a private component used only within this file. It renders a dashed green-bordered rectangle the same size as a card (`w-16 h-24`) with a centred label, giving the player a visual cue that a pile is empty and can accept a card.

### Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `label` | `string` | Yes | A short text or symbol shown in the centre of the empty slot (e.g. `↺` for stock, `♥` for a hearts foundation). |
| `onClick` | `function` | No | A callback function invoked when the player clicks the empty slot. Added in **Phase 4**. When provided, the slot renders with a `cursor-pointer` cursor. Used by `StockPile` to allow recycling the waste pile back into the stock even when the stock is empty. |

---

## StockPile

Renders the face-down draw pile. If the stock has cards, it displays the top card with `faceUp: false` (so only the card back is visible). If the stock is empty, it shows an `EmptySlot` with the recycle symbol `↺` as a visual hint that clicking will redeal from the waste pile.

### Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `cards` | `array` | Yes | The array of card objects currently in the stock pile. The component only renders the last card in the array (index `cards.length - 1`), treating the array as a stack. |
| `onDraw` | `function` | No | A callback function invoked when the player clicks the stock pile or its empty slot. Added in **Phase 4**. Passed directly to the `Card` component (when the stock has cards) or to `EmptySlot` (when the stock is empty), so clicking either triggers the same action — typically dispatching a `DRAW` action to the game reducer. |

### State

`StockPile` manages no internal state.

### Interactions & Side Effects

When `onDraw` is provided, `StockPile` is interactive. Clicking the visible card or the empty-slot recycle indicator both fire `onDraw`. The component itself runs no `useEffect` hooks and has no side effects.

---

## WastePile

Renders the top card of the waste pile face-up. The waste pile holds cards that have been drawn from the stock. If the waste is empty, it shows a blank `EmptySlot` with an empty label.

### Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `cards` | `array` | Yes | The array of card objects in the waste pile. Only the last card in the array is shown, face-up. |
| `onCardClick` | `function` | No | A callback function invoked when the player clicks the top waste card. Added in **Phase 4**. Passed directly to the `Card` component's `onClick` prop. Typically used to select the waste card as the source for a `MOVE_CARD` or `AUTO_MOVE` action. Not called when the waste is empty. |

### State

`WastePile` manages no internal state.

### Interactions & Side Effects

When `onCardClick` is provided, clicking the top waste card fires the callback. The component runs no `useEffect` hooks and has no side effects.

---

## FoundationPile

Renders one of the four foundation piles where the player stacks cards by suit from Ace to King to win the game. If the foundation is empty, it shows an `EmptySlot` labelled with the suit symbol (e.g. `♥`, `♦`, `♣`, `♠`). If the foundation has cards, it shows the top card face-up.

### Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `suit` | `string` | Yes | The suit this foundation pile belongs to: `'hearts'`, `'diamonds'`, `'clubs'`, or `'spades'`. Used to look up the display symbol in the local `SUIT_SYMBOLS` constant. |
| `cards` | `array` | Yes | The array of card objects currently on this foundation. Only the last card is shown. |

### State

`FoundationPile` manages no internal state.

### Interactions & Side Effects

`FoundationPile` is a display-only component with no click callbacks. Move validation and card placement logic live in `src/game/gameReducer.js`. Foundation piles receive cards via `MOVE_CARD` dispatched from other pile interactions, not from clicks on the foundation itself.

---

## TableauPile

Renders one of the seven tableau columns — the fanned-out stacks of overlapping cards that form the main playing area. Unlike the other pile components, `TableauPile` renders **all cards in the pile simultaneously** as an absolutely positioned stack, offset vertically so each card peeks out 28 px below the one above it.

If the tableau column is empty, it renders a plain dashed green border rectangle (no label) to mark the available slot.

### Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `cards` | `array` | Yes | The ordered array of card objects in this tableau column. Cards are rendered in array order from top (index `0`) to bottom (last index), each offset 28 px lower than the previous. Each card object must have an `id` property used as the React `key`. |
| `onCardClick` | `function` | No | A callback function invoked when the player clicks a face-up card in the column. Added in **Phase 4**. Receives the card's index within the column (`i`) as its argument, so the parent can identify which card (and all cards beneath it) to use as the source of a move. Face-down cards never fire this callback — `onClick` is set to `undefined` for them. |

### State

`TableauPile` manages no internal state.

### Interactions & Side Effects

When `onCardClick` is provided, clicking any face-up card in the column fires `onCardClick(i)`, where `i` is that card's index in the `cards` array. Face-down cards are non-interactive — their `onClick` prop is explicitly set to `undefined`. The outer container uses `position: relative` and a dynamically calculated height (`96 + (cards.length - 1) * 28` px) to ensure the parent layout accommodates the full height of the fanned stack. Each `Card` is rendered with `position: absolute` and a `top` offset computed as `i * 28` px, where `i` is the card's index in the array.

The 28 px offset and the base card height of 96 px (`h-24`) are tightly coupled to the fixed dimensions defined in `Card.jsx`. Changing either value without updating the other will break the visual layout.

## Notes

- All four pile components are named exports (e.g. `import { StockPile, WastePile } from './Pile.jsx'`). There is no default export from this file.
- `EmptySlot` is intentionally not exported — it is an internal implementation detail. If empty-slot styling ever needs to be shared with other components, it should be extracted and exported.
- The local `SUIT_SYMBOLS` constant in this file maps suit names to their Unicode symbols for use in `EmptySlot` labels within `FoundationPile`. Note that `Card.jsx` has its own separate `SUIT_SYMBOLS` constant that also includes colour information. These are independent — a change to one does not affect the other.
- As of Phase 4, `StockPile`, `WastePile`, and `TableauPile` accept click callback props (`onDraw`, `onCardClick`). `FoundationPile` remains display-only. Drag-and-drop support is not yet implemented — all interaction in Phase 4 is click-based.
- `TableauPile` passes the card's array index `i` to `onCardClick`, not the card object itself. The parent is responsible for reading `cards[i]` and composing the correct `from` descriptor for a `MOVE_CARD` or `AUTO_MOVE` dispatch.
- Related files:
  - `src/components/Card.jsx` — the `Card` component used by all piles.
  - `src/game/gameReducer.js` — defines the game state shape that the `cards` arrays come from.
  - `src/game/deal.js` — populates the initial `tableau` and `stock` arrays passed to these components.
