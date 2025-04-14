let allCards = [];

document.addEventListener('DOMContentLoaded', () => {
  DOM.backButton.addEventListener('click', showHomeSections);

  fetch('data/all_cards.json')
    .then(res => res.json())
    .then(data => {
      allCards = data;
      populateSetButtons(data);
    })
    .catch(err => console.error('Error loading cards:', err));
});

