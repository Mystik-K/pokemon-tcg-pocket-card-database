// Refactored app.js with clearer structure and futureproofing

document.addEventListener('DOMContentLoaded', function () {
  const DOM = {
    setGrid: document.getElementById('set-grid'),
    cardList: document.getElementById('card-list'),
    backButton: document.getElementById('back-button'),
    headerTitle: document.querySelector('h1'),
    mainContainer: document.querySelector('.main-container'),
    homepageSections: document.getElementById('homepage-sections'),
    setsSection: document.getElementById('sets-section'),
    battleSection: document.getElementById('battle-section'),
  };

  const setMappings = {
    "Genetic Apex (A1)": { cardsFolder: "a1" },
    "Mythical Island (A1a)": { cardsFolder: "a1a" },
    "Space-Time Smackdown (A2)": { cardsFolder: "a2" },
    "Triumphant light (A2a)": { cardsFolder: "a2a" },
    "Shining Revelry (A2b)": { cardsFolder: "a2b" },
    "Promo A (P-A)": { cardsFolder: "pa" }
  };

  let allCards = [];

  // --- Helper Functions ---

  function extractCardNumber(cardID) {
    const normalized = cardID.replace(/_/g, '-');
    const parts = normalized.split('-');
    return parts[parts.length - 1];
  }

  function getRarityImages(rarity) {
    const rarityMapping = {
      "Common": { icon: "diamond.png", count: 1 },
      "Uncommon": { icon: "diamond.png", count: 2 },
      "Rare": { icon: "diamond.png", count: 3 },
      "Rare EX": { icon: "diamond.png", count: 4 },
      "Full Art": { icon: "star.png", count: 1 },
      "Full Art EX/Support": { icon: "star.png", count: 2 },
      "Immersive": { icon: "star.png", count: 3 },
      "Gold Crown": { icon: "crown.png", count: 1 },
      "one star shiny": { icon: "shiny.png", count: 1 },
      "One shiny star": { icon: "shiny.png", count: 1 },
      "two star shiny": { icon: "shiny.png", count: 2 },
      "Two shiny star": { icon: "shiny.png", count: 2 },
      "Promo": { icon: "promo.png", count: 1 }
    };
    const mapping = rarityMapping[rarity];
    if (!mapping) return null;

    const wrapper = document.createElement('div');
    wrapper.className = 'rarity-wrapper';
    for (let i = 0; i < mapping.count; i++) {
      const iconImg = document.createElement('img');
      iconImg.src = `images/rarity/${mapping.icon}`;
      iconImg.alt = rarity;
      iconImg.className = 'rarity-icon';
      wrapper.appendChild(iconImg);
    }
    return wrapper;
  }

  function updateHeaderForSet(setName) {
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
  }

  function showHomeSections() {
    DOM.setsSection.style.display = 'block';
    DOM.battleSection.style.display = 'block';
    DOM.cardList.style.display = 'none';
    DOM.backButton.style.display = 'none';
    DOM.headerTitle.style.display = 'block';

    const setLogo = document.querySelector('.set-theme-logo');
    if (setLogo) setLogo.remove();
  }

  function showCardList() {
    DOM.setsSection.style.display = 'none';
    DOM.battleSection.style.display = 'none';
    DOM.cardList.style.display = 'grid';
    DOM.backButton.style.display = 'block';
  }

  // --- Rendering Functions ---

  function populateSetButtons(cards) {
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
  }

  function displayCardsForSet(setName) {
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
  }

  // --- Initialize ---

  DOM.backButton.addEventListener('click', showHomeSections);

  fetch('data/all_cards.json')
    .then(res => res.json())
    .then(data => {
      allCards = data;
      populateSetButtons(data);
    })
    .catch(err => console.error('Error loading cards:', err));
});