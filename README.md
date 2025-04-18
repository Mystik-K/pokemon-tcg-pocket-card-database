# Pokémon TCG Pocket Card Browser

A personal fan project for browsing, viewing, and analyzing cards from the Pokémon TCG Pocket mobile game.  
This site is powered by custom JSON data, modular JavaScript, and modern CSS layout. It supports a searchable card viewer, individual card pages with rarity icons, and plans for future battle simulation.

---

## 🚀 Current Features

- ✅ Responsive homepage with set selection
- ✅ Individual card pages with zoomed background + details
- ✅ Rarity icon rendering (Common, Rare EX, etc.)
- ✅ Type icons for Energy and Pokémon element
- ✅ Search overlay with fuzzy matching
- ✅ Navigation between cards
- ✅ Modular JS and CSS architecture


📁 Project Structure (Simplified)
.
├── index.html                 # Homepage with set list
├── card.html                  # Single card detail view
├── data/                      # all_cards.json and other dataset files
├── images/                    # Card art, icons, logos
├── js/                        # App logic (modular, per-view)
│   └── singlecardpage/        # Logic for card.html (rendering, navigation)
├── styles/                    # CSS (modular, per-view)
│   ├── base.css
│   ├── cards.css
│   ├── battle.css
│   ├── header.css
│   ├── rarity.css
│   ├── search.css
│   └── singlecardpage/        # Card view-specific layout
│       ├── layout.css
│       ├── cardInfo.css
│       ├── navigation.css
│       ├── similarCards.css
│       └── shared.css
└── README.md

---

🛣️ Future Roadmap

    🧩 Deck builder view (custom hands & drag-and-drop)

    🥊 Battle simulator with turn-based interactions

    🗂 JSON-driven card management for new releases

    🧠 Advanced filtering & tagging (rarity, type, HP, etc.)

    ☁️ Deploy via S3 + CloudFront with DNS + CI/CD pipeline

    🔒 IAM-secured editing tools for card metadata


## Credits & Fork Notice

JSON data was originally forked from [hugoburguete's Pokémon TCG Pocket Database](https://github.com/hugoburguete/pokemon-tcg-pocket-card-database).  
While the base structure inspired this site, nearly every component - including card layout, JSON-consolidation, search overlay, promo support, card data, UI/UX refactors, and styling
has since been rebuilt or heavily modified to better fit the goals of this project.
