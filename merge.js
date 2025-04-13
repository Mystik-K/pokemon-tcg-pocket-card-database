const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'cards', 'en');
const outputFile = path.join(__dirname, 'data', 'all_cards.json');

let allCards = [];

// Merge all set files except promo.json
fs.readdirSync(sourceDir).forEach(file => {
  if (file === 'promo.json') return;

  if (file.endsWith('.json')) {
    const filePath = path.join(sourceDir, file);
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    try {
      const cards = JSON.parse(fileContents);
      allCards = allCards.concat(cards);
      console.log(`✅ Merged: ${file}`);
    } catch (err) {
      console.error(`❌ Failed to parse ${file}:`, err.message);
    }
  }
});

// Now merge promo.json if it exists
const promoPath = path.join(sourceDir, 'promo.json');
if (fs.existsSync(promoPath)) {
  const promoContents = fs.readFileSync(promoPath, 'utf-8');
  try {
    const promoCards = JSON.parse(promoContents);
    allCards = allCards.concat(promoCards);
    console.log(`✅ Added Promo Cards`);
  } catch (err) {
    console.error(`❌ Failed to parse promo.json:`, err.message);
  }
}

// 💾 Write everything after all merging is done
fs.writeFileSync(outputFile, JSON.stringify(allCards, null, 2));
console.log(`📝 Combined ${allCards.length} cards into all_cards.json`);

