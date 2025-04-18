// ======================================================
// 🎴 renderSingleCard.js
// This is the main entry point for the single card view.
//
// Responsibilities:
// - Loads the card ID from the URL (?id=...)
// - Loads card data using loadCard()
// - Delegates rendering to:
//     → renderCardInfo(card)
//     → renderSimilarCards(card, cards)
//     → renderNavigation(card, cards)
//
// Dependencies:
// - helpers.js
// - loadCard.js
// - renderCardInfo.js
// - renderSimilarCards.js
// - renderNavigation.js
// ======================================================
import { getBasePokemonName, getFolderFromId, renderCostIcons } from './helpers.js';
import { renderSimilarCards } from './renderSimilarCards.js';
import { renderCardInfo } from './renderCardInfo.js';
import { renderNavigation } from './renderNavigation.js';

import { loadCard } from './loadCard.js';

loadCard().then(({ card, cards }) => {
  if (!card) {
    const fallback = document.createElement('h2');
    fallback.textContent = 'Card not found';
    document.querySelector('.card-info-box')?.appendChild(fallback);
    return;
  }

  renderCardInfo(card);
  renderSimilarCards(card, cards);
  renderNavigation(card, cards);
});


