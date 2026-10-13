(function () {
  document.querySelectorAll(".nav-links a").forEach(function (link) {
    if (link.origin === location.origin && link.pathname === location.pathname) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
})();
