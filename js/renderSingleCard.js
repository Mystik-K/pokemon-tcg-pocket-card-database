// 1️⃣ Get the `id` from the URL (like ?id=a1-005)
const params = new URLSearchParams(window.location.search);
const cardId = params.get('id');

// 2️⃣ Load your master card list
fetch('data/all_cards.json')
  .then(res => res.json())
  .then(cards => {
    // 3️⃣ Normalize both the card ID from URL and from data (replace underscores, make lowercase)
    const normalizedParamId = cardId.replace(/_/g, "-").toLowerCase();
    const card = cards.find(c => c.id.replace(/_/g, "-").toLowerCase() === normalizedParamId);

    // 4️⃣ If the card doesn't exist, show error
    if (!card) {
      const fallback = document.createElement('h2');
      fallback.textContent = 'Card not found';
      document.querySelector('.card-info-box')?.appendChild(fallback);
      return;
    }

    // 🔁 === RELATED CARD LOGIC ===
    // Normalize names to find related cards with the same root name (e.g., Pikachu ex, Pikachu V, etc.)
    const getBaseName = (name) =>
      name
        .toLowerCase()
        .replace(/( ex| gx| vstar| vmax| v| prism| break| lv\\.x| δ| ☆| ★| ∆| form| forme)/g, '')
        .replace(/origin for|origin forme/g, 'origin')
        .replace(/[^a-z0-9]/g, '')
        .trim();

    const baseName = getBaseName(card.name);
    const relatedCards = cards.filter(c =>
      getBaseName(c.name) === baseName && c.id !== card.id
    );

    // 🎴 Inject thumbnails of similar cards
    if (relatedCards.length > 0) {
      const similarContainer = document.getElementById("similar-cards");
      const header = similarContainer.querySelector("h3");
      header.textContent = `Other ${baseName.charAt(0).toUpperCase() + baseName.slice(1)} Cards`;

      const relatedThumbs = document.getElementById("related-card-thumbs");
      relatedThumbs.innerHTML = '';

      relatedCards.forEach((relatedCard) => {
        const rId = relatedCard.id.toLowerCase().replace(/_/g, "-");
        const rFolder = rId.startsWith("a1a-") ? "a1a"
                      : rId.startsWith("a1-") ? "a1"
                      : rId.startsWith("a2a-") ? "a2a"
                      : rId.startsWith("a2b-") ? "a2b"
                      : rId.startsWith("a2-") ? "a2"
                      : rId.startsWith("p-a-") ? "pa"
                      : "unknown";
        const rImgSrc = `images/${rFolder}/${rId}.webp`;

        const cardThumb = document.createElement("a");
        cardThumb.href = `card.html?id=${rId}`;
        cardThumb.classList.add("related-thumb");
        cardThumb.innerHTML = `
          <img src="${rImgSrc}" alt="${relatedCard.name}" />
          <div class="related-meta">
            <strong>${relatedCard.name}</strong>
            <div class="id-and-rarity">#${relatedCard.id.replace(/.*[-_]/, '')}</div>
          </div>
        `;

        // Add rarity icons to the row under the name
        const idRarityRow = cardThumb.querySelector('.id-and-rarity');
        const rarityIcons = window.getRarityImages(relatedCard.rarity);
        if (idRarityRow && rarityIcons) {
          idRarityRow.appendChild(rarityIcons);
        }

        relatedThumbs.appendChild(cardThumb);
      });
    }

    // 🌠 IMAGE + META RENDERING
    const normalizedId = card.id.replace(/_/g, "-").toLowerCase();
    const folder = normalizedId.startsWith("a1a-") ? "a1a"
                : normalizedId.startsWith("a1-") ? "a1"
                : normalizedId.startsWith("a2a-") ? "a2a"
                : normalizedId.startsWith("a2b-") ? "a2b"
                : normalizedId.startsWith("a2-")  ? "a2"
                : normalizedId.startsWith("p-a-") ? "pa"
                : "unknown";

    const imageSrc = `images/${folder}/${normalizedId}.webp`;

    // Set the big card image and blurred background
    document.getElementById('card-image').src = imageSrc;
    document.getElementById('card-image').alt = card.name;
    document.getElementById("card-glow").style.backgroundImage = `url(${imageSrc})`;

    // Set info in the right panel (set logo, set name, card #)
    document.getElementById('set-info').innerHTML = `
      <img class="set-logo" src="images/${folder}/${folder}-set-logo.png" alt="${card.set} Logo" />
      <p><strong>Set:</strong> ${card.set}</p>
      <p><strong>Card #:</strong> ${card.id.replace(/_/g, "-").split('-').pop()}</p>
    `;

    // Full breakdown of card properties
    document.getElementById('card-meta').innerHTML = `
      <h2>${card.name}</h2>
      <p><strong>Type:</strong> ${card.type || 'Unknown'}</p>
      <p><strong>Subtype:</strong> ${card.subtype || '—'}</p>
      <p><strong>Element:</strong> ${card.element || '—'}</p>
      <p><strong>Health:</strong> ${card.health || '—'}</p>
      <p><strong>Weakness:</strong> ${card.weakness || '—'}</p>
      <p><strong>Rarity:</strong> ${card.rarity || '—'}</p>
      ${
        card.attacks?.length
          ? `<h3>Attacks:</h3><ul>` +
            card.attacks.map(
              (a) => `
                <li><strong>${a.name}</strong>: ${a.damage || 0} dmg<br/>
                <em>Cost:</em> ${a.cost?.join(', ') || '—'}
                ${a.effects ? `<br/><em>Effects:</em> ${a.effects}` : ''}</li>`
            ).join('') +
            `</ul>`
          : ''
      }
    `;

    // 🔁 === PREV / NEXT NAV LOGIC ===

    // Grab all cards in the same set and sort by their number
    const sortedSetCards = cards
      .filter(c => c.set === card.set)
      .sort((a, b) => {
        const getNum = id => parseInt(id.replace(/^.*[-_]/, ''), 10);
        return getNum(a.id) - getNum(b.id);
      });

    // Find this card's position in the set
    const currentIndex = sortedSetCards.findIndex(c => c.id === card.id);
    const prev = sortedSetCards[currentIndex - 1];
    const next = sortedSetCards[currentIndex + 1];

    // 🔧 Helper to build a clickable thumb
	const buildThumb = (imgEl, data, linkId, nameId, numId) => {
	  if (!data) {
		imgEl.style.display = "none";
		if (nameId) document.getElementById(nameId).textContent = '';
		if (numId) document.getElementById(numId).textContent = '';
		return;
	  }

	  const folder = data.id.toLowerCase().replace(/_/g, "-").split("-")[0];
	  const normalizedId = data.id.toLowerCase().replace(/_/g, "-");

	  imgEl.src = `images/${folder}/${normalizedId}.webp`;
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
    // const buildThumb = (el, data) => {
      // if (!data) return el.innerHTML = '';
      // const folder = data.id.toLowerCase().replace(/_/g, "-").split("-")[0];
      // const img = document.createElement("img");
      // img.src = `images/${folder}/${data.id.toLowerCase().replace(/_/g, "-")}.webp`;
      // img.alt = data.name;
      // img.title = `${data.name} (#${data.id.replace(/^.*[-_]/, '')})`;
      // el.innerHTML = '';
      // el.appendChild(img);
      // el.onclick = () => {
        // window.location.href = `card.html?id=${data.id.toLowerCase().replace(/_/g, "-")}`;
      // };
    // };

    // Inject thumb previews
	// Inject thumb previews and label text
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

	// buildThumb(document.getElementById('prev-thumb-img'), prev, 'prev-link');
	// buildThumb(document.getElementById('next-thumb-img'), next, 'next-link');

    // buildThumb(document.getElementById('prev-thumb'), prev);
    // buildThumb(document.getElementById('next-thumb'), next);

    // Wire up buttons (arrows)
    const prevBtn = document.getElementById('prev-card');
    const nextBtn = document.getElementById('next-card');

    if (!prev) prevBtn.disabled = true;
    else prevBtn.onclick = () => {
      window.location.href = `card.html?id=${prev.id.toLowerCase().replace(/_/g, "-")}`;
    };

    if (!next) nextBtn.disabled = true;
    else nextBtn.onclick = () => {
      window.location.href = `card.html?id=${next.id.toLowerCase().replace(/_/g, "-")}`;
    };
  });

