async function loadCards() {
  const res = await fetch('data/all_cards.json');
  const cards = await res.json();

  // Filter to your 10 test cards (all lowercase IDs)
  const testIds = [
    'a1-098',
    'a2b-094',
    'a2b-078',
    'a2-201',
    'a1-272',
    'a1-274',
    'a2a-081',
    'a2a-091',
    'a1a-083',
    'a1-248'
  ];

  const filteredCards = cards.filter(card =>
    testIds.includes(card.id.toLowerCase())
  );

  // ✅ Debug logs here
  console.log('Matched cards:', filteredCards.length);
  filteredCards.forEach(card => console.log('✔️', card.id));

  const container = document.getElementById('card-list');
  container.innerHTML = ''; // Clear in case this is reloaded

  filteredCards.forEach(card => {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card-container');

    const img = document.createElement('img');
    img.src = `images/${card.id.toLowerCase()}.jpeg`;
    img.alt = card.name;
    img.width = 200;

    const label = document.createElement('p');
    label.innerText = `${card.name} [${card.element}] (${card.rarity})`;

    cardDiv.appendChild(img);
    cardDiv.appendChild(label);
    container.appendChild(cardDiv);
  });
}

// Fire the function on page load
loadCards();

