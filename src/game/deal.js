export function deal(shuffledDeck) {
  const tableau = Array.from({ length: 7 }, () => [])
  let i = 0

  for (let col = 0; col < 7; col++) {
    for (let row = 0; row <= col; row++) {
      tableau[col].push({ ...shuffledDeck[i++], faceUp: row === col })
    }
  }

  const stock = shuffledDeck.slice(i).map(c => ({ ...c, faceUp: false }))

  return { tableau, stock }
}
