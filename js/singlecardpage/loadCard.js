// ======================================================
// 📦 loadCard.js
// Responsible for:
// - Reading the `?id=` query parameter from the URL
// - Fetching all card data from all_cards.json
// - Finding the specific card by normalized ID
// - Returning: { card, cards }
//
// Used by: renderSingleCard.js
//
// Future notes:
// - May be reused by battle sim or deck preview modules
// ======================================================
export async function loadCard() {
  const params = new URLSearchParams(window.location.search);
  const cardId = params.get('id');

  const response = await fetch('data/all_cards.json');
  const cards = await response.json();

  const normalizedId = cardId.replace(/_/g, "-").toLowerCase();
  const card = cards.find(c => c.id.replace(/_/g, "-").toLowerCase() === normalizedId);

  return { card, cards };
}
