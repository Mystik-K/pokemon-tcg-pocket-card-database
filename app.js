let allCards = [];

async function init() {
  // Fetch the card data
  try {
    const res = await fetch('data/all_cards.json');
    if (!res.ok) throw new Error('Failed to fetch cards');
    allCards = await res.json();
    const sets = getUniqueSets(allCards);
    renderSetGrid(sets);
  } catch (error) {
    console.error('Error loading cards:', error);
  }
}

function getUniqueSets(cards) {
  const setMap = new Map();
  cards.forEach(card => {
    if (!setMap.has(card.set)) {
      setMap.set(card.set, card.set);
    }
  });
  return Array.from(setMap.values());
}

function renderSetGrid(sets) {
  const container = document.getElementById('set-grid');
  container.innerHTML = ''; // Clear any existing content

  sets.forEach(setName => {
    const div = document.createElement('div');
    div.className = 'set-button-container';

    const a = document.createElement('a');
    a.href = '#';
    a.className = 'set-link';

    const img = document.createElement('img');
    const setId = setName.match(/\((.*?)\)/)?.[1].toLowerCase();
    img.src = `images/${setId}/cover.webp`;
    img.alt = `${setName} Cover`;
    img.className = 'set-cover';

    const span = document.createElement('span');
    span.innerText = setName;

    a.appendChild(img);
    a.appendChild(span);

    a.onclick = () => showCardsForSet(setName);

    div.appendChild(a);
    container.appendChild(div);
  });
}

function showCardsForSet(setName) {
  document.getElementById('homepage-sections').style.display = 'none';
  document.getElementById('back-button').style.display = 'block';
  document.getElementById('card-list').style.display = 'grid';

  document.title = `${setName} - PTCGP Road to Masters`;

  const filtered = allCards.filter(card => card.set === setName);
  renderCardList(filtered);
}

document.getElementById('back-button').onclick = () => {
  document.getElementById('homepage-sections').style.display = 'flex';
  document.getElementById('back-button').style.display = 'none';
  document.getElementById('card-list').style.display = 'none';

  document.title = 'PTCGP Road to Masters';
};

function renderCardList(cards) {
  const container = document.getElementById('card-list');
  container.innerHTML = ''; // Clear any existing card content

  cards.forEach(card => {
    const div = document.createElement('div');
    div.className = 'card-container';

    const img = document.createElement('img');
    const id = card.id.toLowerCase().replace('_', '-');
    const setFolder = card.set.match(/\((.*?)\)/)?.[1]?.toLowerCase();
    img.src = `images/${setFolder}/${id}.webp`;
    img.alt = card.name;

    const p = document.createElement('p');
    const icons = getRarityIcons(card.rarity);
    const number = card.id.match(/(\d+)$/)?.[1] || '???';
    p.innerHTML = `<span class="card-number">${number}</span><br>${icons}`;

    div.appendChild(img);
    div.appendChild(p);
    container.appendChild(div);
  });
}

function getRarityIcons(rarity) {
  const r = rarity.toLowerCase();

  const icon = (src, count = 1) =>
    Array(count)
      .fill(`<img src="images/rarity/${src}" class="rarity-icon" alt="${rarity}">`)
      .join('');

  if (r.includes('double shiny')) return icon('shiny.png', 2);
  if (r.includes('shiny')) return icon('shiny.png');
  if (r.includes('gold crown')) return icon('crown.png');
  if (r.includes('immersive')) return icon('star.png', 3);
  if (r.includes('full art ex') || r.includes('support')) return icon('star.png', 2);
  if (r.includes('full art')) return icon('star.png');
  if (r.includes('rare ex')) return icon('diamond.png', 4);
  if (r.includes('rare')) return icon('diamond.png', 3);
  if (r.includes('uncommon')) return icon('diamond.png', 2);
  if (r.includes('common')) return icon('diamond.png', 1);
  if (r.includes('promo')) return icon('promo.png');

  return rarity; // fallback
}

// Initialize the app
init();

