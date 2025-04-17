document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("search-bar");
  const resultsContainer = document.getElementById("search-results-container");
  const resultsGrid = document.getElementById("search-results-grid");
  const resultsTitle = document.getElementById("search-results-title");
  const closeBtn = document.getElementById("close-search-results");
  
  function getFolderFromId(id) {
	  const normalizedId = id.toLowerCase().replace(/_/g, "-");
	  if (normalizedId.startsWith("a1a-")) return "a1a";
	  if (normalizedId.startsWith("a1-"))  return "a1";
	  if (normalizedId.startsWith("a2a-")) return "a2a";
	  if (normalizedId.startsWith("a2b-")) return "a2b";
	  if (normalizedId.startsWith("a2-"))  return "a2";
	  if (normalizedId.startsWith("p-a-")) return "pa";
	  return "unknown";
  }
  
  function getCardNumber(id) {
  const match = id.match(/(?:-|_)?(\d{1,4})$/); // captures last numeric chunk
  return match ? match[1] : "??";
}
  
  function getImagePath(card) {
	  const folder = getFolderFromId(card.id);
	  const normalizedId = card.id.replace(/_/g, "-");
	  return `images/${folder}/${normalizedId}.webp`;
  }


  if (!input || !resultsContainer) return;

  let allCards = [];

  fetch("data/all_cards.json")
    .then((res) => res.json())
    .then((data) => {
      allCards = data;
      input.disabled = false;
    });

  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    if (query.length < 2) {
      resultsContainer.classList.add("hidden");
      return;
    }

    const filtered = allCards.filter((card) =>
      card.name.toLowerCase().includes(query)
    );

    resultsTitle.textContent = `Search results for "${query}"`;
    resultsGrid.innerHTML = "";

    if (filtered.length === 0) {
      resultsGrid.innerHTML = "<p>No cards found.</p>";
    } else {
      filtered.forEach((card) => {
        const cardEl = document.createElement("div");
		cardEl.className = "search-result-card";
		cardEl.innerHTML = `
		  <div class="thumb-preview">
			<img src="${getImagePath(card)}" alt="${card.name}" onerror="this.src='images/ui/fallback.webp'" />
			<div class="related-meta">
			  <div>${card.name}</div>
			  <div class="id-and-rarity">
				<span>#${getCardNumber(card.id)}</span>
			  </div>
			</div>
		  </div>
		`;

		// Append rarity icons
		const rarityIcons = window.getRarityImages(card.rarity);
		if (rarityIcons) {
		  const rarityContainer = cardEl.querySelector('.id-and-rarity');
		  rarityContainer.appendChild(rarityIcons);
		}
		
        cardEl.onclick = () => {
          window.location.href = `card.html?id=${card.id}`;
        };
        resultsGrid.appendChild(cardEl);
      });
    }

    resultsContainer.classList.remove("hidden");
  });

	closeBtn.onclick = () => {
	  resultsContainer.classList.add("hidden");
	  input.value = "";
	  resultsGrid.innerHTML = "";
	  resultsTitle.textContent = "";
	};
});
