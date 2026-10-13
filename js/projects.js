(function () {
  var search = document.getElementById('project-search');
  var filters = document.querySelectorAll('[data-filter]');
  var cards = document.querySelectorAll('[data-category]');
  var count = document.getElementById('project-count');
  var empty = document.getElementById('project-empty');
  var category = 'all';

  function filter() {
    var query = search.value.trim().toLowerCase();
    var visible = 0;
    cards.forEach(function (card) {
      var match = (category === 'all' || card.dataset.category === category) && card.textContent.toLowerCase().includes(query);
      card.hidden = !match;
      if (match) visible++;
    });
    count.textContent = visible + (visible === 1 ? ' project' : ' projects');
    empty.hidden = visible !== 0;
  }

  search.addEventListener('input', filter);
  filters.forEach(function (button) {
    button.addEventListener('click', function () {
      category = button.dataset.filter;
      filters.forEach(function (item) { item.setAttribute('aria-pressed', item === button ? 'true' : 'false'); });
      filter();
    });
  });
})();
