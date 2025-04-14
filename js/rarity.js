window.getRarityImages = function(rarity) {
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
  const normalized = rarity.trim().toLowerCase();
  const mapping = rarityMapping[rarity] || rarityMapping[normalized];
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

