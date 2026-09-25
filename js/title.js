// scrolls the tab title like a marquee. browsers never tell a page when its tab
// is hovered, so this runs continuously; background tabs throttle it to ~1/s.
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var text = document.title + "   //   ";
  var i = 0;

  setInterval(function () {
    i = (i + 1) % text.length;
    document.title = text.slice(i) + text.slice(0, i);
  }, 250);
})();
