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
	
	function createCardElement(card) {
	  const cardEl = document.createElement("div");
	  cardEl.className = "search-result-card";
	  cardEl.innerHTML = `
		<img src="${getImagePath(card)}" alt="${card.name}" loading="lazy" onerror="this.src='images/ui/fallback.webp'" />
		<div class="related-meta">
		  <div>${card.name}</div>
		  <div class="id-and-rarity">
			<span>#${getCardNumber(card.id)}</span>
		  </div>
		</div>
	  `;

	  const rarityIcons = window.getRarityImages(card.rarity);
	  if (rarityIcons) {
		const rarityContainer = cardEl.querySelector('.id-and-rarity');
		rarityContainer.appendChild(rarityIcons);
	  }

	  cardEl.onclick = () => {
		window.location.href = `card.html?id=${card.id}`;
	  };

	  return cardEl;
	}


/**
 * Finds the closest matching card name to a user's input,
 * using Levenshtein Distance for fuzzy comparison.
 * Returns the best match if it's within a reasonable threshold (edit distance < 4).
 */
function getClosestMatch(input, cards) {
  const inputName = input.toLowerCase();
  let bestMatch = null;
  let bestScore = Infinity;

  cards.forEach(card => {
    const name = card.name.toLowerCase();
    const distance = levenshteinDistance(inputName, name);

    if (distance < bestScore && distance < 4) { // You can tweak the threshold
      bestScore = distance;
      bestMatch = card.name;
    }
  });

  return bestMatch;
}

/**
 * Calculates the Levenshtein Distance between two strings.
 * This represents the number of single-character edits (insert, delete, substitute)
 * needed to transform one string into another.
 */
function levenshteinDistance(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, (_, i) =>
    Array(a.length + 1).fill(0)
  );

  // Fill in the first row and column
  for (let i = 0; i <= b.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  // Fill in the rest of the matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,       // Deletion
        matrix[i][j - 1] + 1,       // Insertion
        matrix[i - 1][j - 1] + cost // Substitution
      );
    }
  }

  return matrix[b.length][a.length];
}

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
	  const suggestion = getClosestMatch(query, allCards);

	  if (suggestion) {
		// Filter for the actual suggested card(s)
		const suggestionMatches = allCards.filter(card => card.name.toLowerCase() === suggestion.toLowerCase());
		
		resultsTitle.textContent = `No exact matches. Showing results for "${suggestion}"`;
		resultsGrid.innerHTML = "";

		suggestionMatches.forEach((card) => {
		  resultsGrid.appendChild(createCardElement(card));
		});

		resultsContainer.classList.remove("hidden");
		return; // 🔒 prevent running the else block below
	  } else {
		resultsGrid.innerHTML = "<p>No cards found.</p>";
		return;
	  }
	} else {
      filtered.forEach((card) => {
		  resultsGrid.appendChild(createCardElement(card));
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
