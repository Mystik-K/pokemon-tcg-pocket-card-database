// ======================================================
// 🧬 renderCardInfo.js
// Renders the selected card’s:
// - Image and blurred background
// - Set logo and card number
// - Metadata: type, subtype, element, health, weakness
// - Abilities and attacks (with costs)
//
// Expects: `card` object from all_cards.json
//
// Depends on:
// - getFolderFromId() (from helpers.js)
// - renderCostIcons() (from helpers.js)
// - window.getTypeIcon / window.getRarityImages
//
// Used by: renderSingleCard.js
// ======================================================
import { getFolderFromId, renderCostIcons } from './helpers.js';

export function renderCardInfo(card) {
  // 🌠 IMAGE + META RENDERING
  const normalizedId = card.id.replace(/_/g, "-").toLowerCase();
  const folder = getFolderFromId(card.id);
  const imageSrc = `images/${folder}/${normalizedId}.webp`;

  // Card image + background glow and blur
  document.getElementById('card-image').src = imageSrc;
  document.getElementById('card-image').loading = "lazy";
  document.getElementById('card-image').alt = card.name;
  document.getElementById("card-glow").style.backgroundImage = `url(${imageSrc})`;

  // Set info: logo, set name, card #
  document.getElementById('set-info').innerHTML = `
    <img class="set-logo" src="images/${folder}/${folder}-set-logo.png" alt="${card.set} Logo" />
    <p><strong>Set:</strong> ${card.set}</p>
    <h2 class="card-name-title">${card.name}</h2>
    <p><strong>Card #:</strong> ${card.id.replace(/_/g, "-").split('-').pop()}</p>
  `;

  // Card metadata (types, subtype, health, rarity, abilities, attacks)
  document.getElementById('card-meta').innerHTML = `
    <div class="left-info">
      <p><span class="info-key">Type:</span> <span class="info-value">${card.type || 'Unknown'}</span></p>
      <p><span class="info-key">Subtype:</span> <span class="info-value">${card.subtype || '—'}</span></p>
      <p>
        <span class="info-key">Element:</span>
        <span class="info-value">
          ${card.element ? window.getTypeIcon(card.element).outerHTML : ''}
        </span>
      </p>
      <p><span class="info-key">Health:</span> <span class="info-value">${card.health || '—'}</span></p>
      <p>
        <span class="info-key">Weakness:</span>
        <span class="info-value">
          ${card.weakness ? window.getTypeIcon(card.weakness).outerHTML : ''}
        </span>
      </p>
      <p>
        <span class="info-key">Rarity:</span>
        ${card.rarity ? window.getRarityImages(card.rarity, 'rarity-in-meta').outerHTML : '<span class="info-value">—</span>'}
      </p>
    </div>
    <div class="right-info">
      ${card.abilities?.length ? card.abilities.map(ab => `
        <p><span class="info-key">Abilities:</span> <span class="info-value">${ab.name}</span></p>
        <p><span class="description-text">${ab.effect}</span></p>
      `).join('') : ''}

      ${card.attacks?.length ? card.attacks.map(a => `
        <p><span class="info-key">Attacks:</span> <span class="info-value">${a.name}</span>: ${a.damage || 0} dmg</p>
        <p><span class="description-text"><strong>Cost:</strong> ${renderCostIcons(a.cost)}</span></p>
        ${a.effect ? `<p><span class="description-text">${a.effect}</span></p>` : ''}
      `).join('') : ''}
    </div>
  `;
}
