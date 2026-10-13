(function () {
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    document.querySelectorAll('[data-preview-path]').forEach(function (link) {
      link.href = link.dataset.previewPath;
    });
  }
  var search = document.getElementById('project-search');
  var filters = document.querySelectorAll('[data-filter]');
  var cards = document.querySelectorAll('[data-category]');
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
