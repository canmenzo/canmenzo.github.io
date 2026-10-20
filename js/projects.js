(function () {
  var search = document.getElementById('project-search');
  var filters = document.querySelectorAll('[data-filter]');
  var cards = document.querySelectorAll('[data-category]');
  var empty = document.getElementById('project-empty');
  var count = document.getElementById('project-count');
  var resets = document.querySelectorAll('[data-reset]');
  var category = 'all';

  document.querySelector('.project-tools').hidden = false;
  resets[0].hidden = false;

  function filter() {
    var query = search.value.trim().toLowerCase();
    var visible = 0;
    cards.forEach(function (card) {
      var match = (category === 'all' || card.dataset.category === category) && card.textContent.toLowerCase().includes(query);
      card.hidden = !match;
      if (match) visible++;
    });
    empty.hidden = visible !== 0;
    count.textContent = visible + ' of ' + cards.length + ' projects';
    if (category !== 'all') count.textContent += ' · ' + document.querySelector('[data-filter="' + category + '"]').textContent;
    if (query) count.textContent += ' · “' + search.value.trim() + '”';
    resets[0].disabled = !query && category === 'all';
  }

  search.addEventListener('input', filter);
  filters.forEach(function (button) {
    button.addEventListener('click', function () {
      category = button.dataset.filter;
      filters.forEach(function (item) { item.setAttribute('aria-pressed', item === button ? 'true' : 'false'); });
      filter();
    });
  });
  resets.forEach(function (button) {
    button.addEventListener('click', function () {
      search.value = '';
      category = 'all';
      filters.forEach(function (item) { item.setAttribute('aria-pressed', item.dataset.filter === 'all' ? 'true' : 'false'); });
      filter();
      search.focus();
    });
  });
  filter();
})();
