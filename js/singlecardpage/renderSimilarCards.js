// ======================================================
// 🔁 renderSimilarCards.js
// Finds other cards with the same base name (e.g., “Charizard”)
// Ignores prefix/suffix like “Shiny”, “ex”, “V”, etc.
//
// Renders a row of clickable thumbnails beneath the card.
//
// Expects:
// - `card` (the current one)
// - `cards` (all cards)
//
// Depends on:
// - getBasePokemonName() from helpers.js
// - getFolderFromId() from helpers.js
//
// Used by: renderSingleCard.js
// ======================================================
import { getBasePokemonName, getFolderFromId } from './helpers.js';

export function renderSimilarCards(card, allCards) {
  const baseName = getBasePokemonName(card.name);
  const relatedCards = allCards.filter(c =>
    getBasePokemonName(c.name) === baseName && c.id !== card.id
  );

  const similarContainer = document.getElementById("similar-cards");
  const header = similarContainer.querySelector("h3");
 
  // 🎴 Inject thumbnails of similar cards
  if (relatedCards.length > 0) {
    header.textContent = `Other ${baseName.charAt(0).toUpperCase() + baseName.slice(1)} Cards`;
    const relatedThumbs = document.getElementById("related-card-thumbs");
    relatedThumbs.innerHTML = '';

    relatedCards.forEach((relatedCard) => {
      const rId = relatedCard.id.toLowerCase().replace(/_/g, "-");
      const rFolder = getFolderFromId(relatedCard.id);
      const rImgSrc = `images/${rFolder}/${rId}.webp`;

      const cardThumb = document.createElement("a");
      cardThumb.href = `card.html?id=${rId}`;
      cardThumb.classList.add("related-thumb");
      cardThumb.innerHTML = `
        <div class="thumb-preview">
          <img src="${rImgSrc}" alt="${relatedCard.name}" loading="lazy" />
          <div class="related-meta">
            <strong>${relatedCard.name}</strong>
            <div class="id-and-rarity">#${relatedCard.id.replace(/.*[-_]/, '')}</div>
          </div>
        </div>
      `;

      const idRarityRow = cardThumb.querySelector('.id-and-rarity');
      const rarityIcons = window.getRarityImages(relatedCard.rarity);
      if (idRarityRow && rarityIcons) {
        idRarityRow.appendChild(rarityIcons);
      }

      relatedThumbs.appendChild(cardThumb);
    });

  } else {
    header.textContent = `No other ${card.name} cards found.`;
  }
}