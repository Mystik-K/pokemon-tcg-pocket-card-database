// ======================================================
// 🧭 renderNavigation.js
// Handles:
// - Sorting cards by number within the same set
// - Prefetching the next/previous card
// - Displaying card thumbnails for prev/next
// - Wiring the arrow buttons for navigation
//
// Expects:
// - `card` (current card)
// - `cards` (all cards)
//
// Depends on:
// - getFolderFromId() from helpers.js
//
// Used by: renderSingleCard.js
// ======================================================

import { getFolderFromId } from './helpers.js';

export function renderNavigation(card, cards) {
  const sortedSetCards = cards
    .filter(c => c.set === card.set)
    .sort((a, b) => {
      const getNum = id => parseInt(id.replace(/^.*[-_]/, ''), 10);
      return getNum(a.id) - getNum(b.id);
    });

  const currentIndex = sortedSetCards.findIndex(c => c.id === card.id);
  const prev = sortedSetCards[currentIndex - 1];
  const next = sortedSetCards[currentIndex + 1];

  // Prefetch links
  if (next) {
    const nextId = next.id.toLowerCase().replace(/_/g, "-");
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = `card.html?id=${nextId}`;
    document.head.appendChild(link);
  }

  if (prev) {
    const prevId = prev.id.toLowerCase().replace(/_/g, "-");
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = `card.html?id=${prevId}`;
    document.head.appendChild(link);
  }

  const buildThumb = (imgEl, data, linkId, nameId, numId) => {
    if (!data) {
      imgEl.style.display = "none";
      if (nameId) document.getElementById(nameId).textContent = '';
      if (numId) document.getElementById(numId).textContent = '';
      return;
    }

    const folder = getFolderFromId(data.id);
    const normalizedId = data.id.toLowerCase().replace(/_/g, "-");

    imgEl.src = `images/${folder}/${normalizedId}.webp`;
    imgEl.loading = "lazy";
    imgEl.alt = data.name;
    imgEl.title = `${data.name} (#${data.id.replace(/^.*[-_]/, '')})`;

    const linkEl = document.getElementById(linkId);
    if (linkEl) linkEl.href = `card.html?id=${normalizedId}`;

    if (nameId) {
      const nameEl = document.getElementById(nameId);
      if (nameEl) nameEl.textContent = data.name;
    }

    if (numId) {
      const numEl = document.getElementById(numId);
      if (numEl) numEl.textContent = `#${data.id.replace(/^.*[-_]/, '')}`;
    }
  };

  buildThumb(
    document.getElementById('prev-thumb-img'),
    prev,
    'prev-link',
    'prev-card-name',
    'prev-card-num'
  );

  buildThumb(
    document.getElementById('next-thumb-img'),
    next,
    'next-link',
    'next-card-name',
    'next-card-num'
  );

  const prevBtn = document.getElementById('prev-card');
  const nextBtn = document.getElementById('next-card');

  if (prevBtn) {
    if (!prev) prevBtn.disabled = true;
    else {
      prevBtn.onclick = () => {
        window.location.href = `card.html?id=${prev.id.toLowerCase().replace(/_/g, "-")}`;
      };
    }
  }

  if (nextBtn) {
    if (!next) nextBtn.disabled = true;
    else {
      nextBtn.onclick = () => {
        window.location.href = `card.html?id=${next.id.toLowerCase().replace(/_/g, "-")}`;
      };
    }
  }
}
