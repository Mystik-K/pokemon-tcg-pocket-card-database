const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'cards', 'en');
const outputFile = path.join(__dirname, 'data', 'all_cards.json');

let allCards = [];

fs.readdirSync(sourceDir).forEach(file => {
  if (file.endsWith('.json')) {
    const filePath = path.join(sourceDir, file);
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    try {
      const cards = JSON.parse(fileContents).map(card => {
        // ✅ Normalize ID format (lowercase, hyphens)
        if (card.id) {
          card.id = card.id.toLowerCase().replace(/_/g, '-');
        }
        return card;
      });

      allCards = allCards.concat(cards);
      console.log(`✅ Merged: ${file}`);
    } catch (err) {
      console.error(`❌ Failed to parse ${file}:`, err.message);
    }
  }
});

fs.writeFileSync(outputFile, JSON.stringify(allCards, null, 2));
console.log(`📝 Combined ${allCards.length} cards into all_cards.json`);

