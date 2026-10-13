(function () {
  function markCurrent() {
    document.querySelectorAll(".nav-links a").forEach(function (link) {
      var contact = location.pathname === "/" && location.hash === "#contact";
      var current = contact ? link.hash === "#contact" : !link.hash && link.pathname === location.pathname;
      if (current) link.setAttribute("aria-current", contact ? "location" : "page");
      else link.removeAttribute("aria-current");
    });
  }
  markCurrent();
  window.addEventListener("hashchange", markCurrent);
})();
