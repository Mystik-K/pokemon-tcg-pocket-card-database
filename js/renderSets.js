window.populateSetButtons = function(cards) {
  const setNames = [...new Set(cards.map(card => card.set))];
  DOM.setGrid.innerHTML = '';

  setNames.forEach(setName => {
    if (!setMappings[setName]) return;
    const mapping = setMappings[setName];

    const btn = document.createElement('button');
    btn.className = 'set-button-container';

    const coverImg = document.createElement('img');
    coverImg.className = 'set-cover';
    coverImg.src = `images/${mapping.cardsFolder}/cover.webp`;
    coverImg.alt = setName;
    btn.appendChild(coverImg);

    const logoImg = document.createElement('img');
    logoImg.className = 'set-logo';
    logoImg.src = `images/${mapping.cardsFolder}/${mapping.cardsFolder}-set-logo.png`;
    logoImg.alt = `${setName} Logo`;
    btn.appendChild(logoImg);

    btn.addEventListener('click', () => displayCardsForSet(setName));
    DOM.setGrid.appendChild(btn);
  });
};

