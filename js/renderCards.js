window.displayCardsForSet = function(setName) {
  updateHeaderForSet(setName);
  showCardList();

  const folder = setMappings[setName].cardsFolder;
  const filteredCards = allCards.filter(card => card.set === setName);

  DOM.cardList.innerHTML = filteredCards.length === 0 ? 'No cards found.' : '';

  filteredCards.forEach(card => {
    const cardContainer = document.createElement('div');
    cardContainer.className = 'card-container';

    const cardImg = document.createElement('img');
    const fixedCardId = card.id.replace(/_/g, "-");
    const cardsFolder = card.id.startsWith("a1a-") ? "a1a" : card.id.startsWith("a1-") ? "a1" : folder;
    cardImg.src = `images/${cardsFolder}/${fixedCardId}.webp`;
    cardImg.alt = card.name;

    const label = document.createElement('div');
    label.className = 'card-label';

    const number = document.createElement('div');
    number.className = 'card-number';
    number.textContent = extractCardNumber(card.id);

    const rarityIcons = getRarityImages(card.rarity);
    if (rarityIcons) {
      label.appendChild(number);
      label.appendChild(rarityIcons);
    }

    cardContainer.appendChild(cardImg);
    cardContainer.appendChild(label);
    DOM.cardList.appendChild(cardContainer);
  });
};

window.extractCardNumber = function(cardID) {
  const normalized = cardID.replace(/_/g, '-');
  const parts = normalized.split('-');
  return parts[parts.length - 1];
};

window.updateHeaderForSet = function(setName) {
  DOM.headerTitle.style.display = 'none';
  let setLogo = document.querySelector('.set-theme-logo');
  if (!setLogo) {
    setLogo = document.createElement('img');
    setLogo.className = 'set-theme-logo';
    DOM.mainContainer.insertBefore(setLogo, DOM.homepageSections);
  }
  const mapping = setMappings[setName];
  setLogo.src = `images/${mapping.cardsFolder}/${mapping.cardsFolder}-set-logo.png`;
  setLogo.alt = `${setName} Logo`;
};

window.showCardList = function() {
  DOM.setsSection.style.display = 'none';
  DOM.battleSection.style.display = 'none';
  DOM.cardList.style.display = 'grid';
  DOM.backButton.style.display = 'block';
};

window.showHomeSections = function() {
  DOM.setsSection.style.display = 'block';
  DOM.battleSection.style.display = 'block';
  DOM.cardList.style.display = 'none';
  DOM.backButton.style.display = 'none';
  DOM.headerTitle.style.display = 'block';

  const setLogo = document.querySelector('.set-theme-logo');
  if (setLogo) setLogo.remove();
};

