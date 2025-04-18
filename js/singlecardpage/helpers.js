// ======================================================
// 🛠️ helpers.js
// Shared utility functions:
//
// - getFolderFromId(id): returns subfolder based on card ID
// - getBasePokemonName(name): strips prefixes/suffixes
// - renderCostIcons(costArray): returns icon markup for energy costs
//
// Used by:
// - renderCardInfo.js
// - renderNavigation.js
// - renderSimilarCards.js
//
// Note: getTypeIcon and getRarityImages are still global (via window.*)
// ======================================================


/* =====================================================
                      HELPERS JS
   ===================================================== */
export function getFolderFromId(id) {
  const normalizedId = id.toLowerCase().replace(/_/g, "-");
  if (normalizedId.startsWith("a1a-")) return "a1a";
  if (normalizedId.startsWith("a1-"))  return "a1";
  if (normalizedId.startsWith("a2a-")) return "a2a";
  if (normalizedId.startsWith("a2b-")) return "a2b";
  if (normalizedId.startsWith("a2-"))  return "a2";
  if (normalizedId.startsWith("p-a-")) return "pa";
  return "unknown";
}

// 🔁 === RELATED CARD LOGIC ===
// Normalize names to find related cards with the same root name (e.g., Pikachu ex, Pikachu V, etc.)
export function getBasePokemonName(name) {
  const prefixes = [
    "Shiny", "Paldean", "Alolan", "Galarian", "Hisuian", "Dark", "Gigantamax", "Mega", "Shadow"
  ];

  const suffixes = [
    "ex", "gx", "vmax", "v-star", "v", "BREAK", "δ", "☆", "★", "∆", "LV.X", "Prism", "Form", "Forme"
  ];

  let base = name;
  for (const prefix of prefixes) {
    const regex = new RegExp("^" + prefix + "\\s+", "i");
    base = base.replace(regex, "");
  }
  for (const suffix of suffixes) {
    const regex = new RegExp("\\s+" + suffix + "$", "i");
    base = base.replace(regex, "");
  }
  return base.trim();
}

// make sure helpers.js is running after iconHelpers.js in order 
export function renderCostIcons(costArray) {
  if (!Array.isArray(costArray)) return '';
  return costArray.map(type => {
    const icon = getTypeIcon(type); // assumes getTypeIcon is global or imported separately
    return icon ? icon.outerHTML : type;
  }).join(' ');
}