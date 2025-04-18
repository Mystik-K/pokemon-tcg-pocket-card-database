window.getRarityImages = function(rarity, extraClass = '') {
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

  const wrapper = document.createElement('span'); // was: document.createElement('div')
  wrapper.className = `rarity-wrapper ${extraClass}`.trim();

  for (let i = 0; i < mapping.count; i++) {
    const iconImg = document.createElement('img');
    iconImg.src = `images/ui/rarity/${mapping.icon}`;
    iconImg.alt = rarity;
    iconImg.className = `rarity-icon ${extraClass}`.trim();
    wrapper.appendChild(iconImg);
  }

  return wrapper;
};


window.getTypeIcon = function(type) {
  if (!type) return '';
  const typeLower = type.trim().toLowerCase();
  const knownTypes = [
    "colorless", "darkness", "dragon", "fighting", "fire", "grass",
    "lightning", "metal", "psychic", "water"
  ];

  if (!knownTypes.includes(typeLower)) return ''; // fallback safety

  const img = document.createElement('img');
  img.src = `images/ui/type/${typeLower}.png`;
  img.alt = type;
  img.className = 'type-icon';
  return img;
};
