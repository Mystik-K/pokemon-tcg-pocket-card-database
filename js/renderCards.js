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
	const normalizedId = card.id.replace(/_/g, "-").toLowerCase();
    //const fixedCardId = card.id.replace(/_/g, "-");
    const cardsFolder = card.id.startsWith("a1a-") ? "a1a" : card.id.startsWith("a1-") ? "a1" : folder;
	
    // cardImg.src = `images/${cardsFolder}/${fixedCardId}.webp`;
    // cardImg.alt = card.name;
	
	// ✅ Use normalizedId here
	cardImg.src = `images/${cardsFolder}/${normalizedId}.webp`;
	cardImg.alt = card.name;
	cardImg.loading = "lazy";

    const label = document.createElement('div');
    label.className = 'card-label';

    const number = document.createElement('div');
    number.className = 'card-number';
    number.textContent = extractCardNumber(card.id);

    const rarityIcons = window.getRarityImages(card.rarity);
    if (rarityIcons) {
      label.appendChild(number);
      label.appendChild(rarityIcons);
    }
	
	// ✅ Link to individual card page
	cardContainer.addEventListener('click', () => {
		window.location.href = `card.html?id=${normalizedId}`;
		});

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
    
    // ✅ Insert the logo right after the header title
    DOM.headerTitle.parentNode.insertBefore(setLogo, DOM.headerTitle.nextSibling);
  }

  const mapping = setMappings[setName];
  if (!mapping) {
    console.warn(`No mapping found for set: ${setName}`);
    return;
  }

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

