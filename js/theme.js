// theme: loaded synchronously as the first thing in <body>, so the right class
// is on before anything paints (no dark->light flash for light-mode visitors).
// An explicit choice is kept in localStorage under the old "dark-mode" key
// ("enabled"/"disabled"), so returning visitors keep what they picked. With no
// choice saved, the OS setting wins, and dark is the fallback.
(function () {
  var KEY = "dark-mode";
  var body = document.body;
  var lightQuery = window.matchMedia ? window.matchMedia("(prefers-color-scheme: light)") : null;

  function saved() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function preferDark() {
    var s = saved();
    if (s === "enabled") return true;
    if (s === "disabled") return false;
    return !(lightQuery && lightQuery.matches);
  }

  function apply(dark) {
    body.classList.toggle("dark-mode", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    var btn = document.getElementById("theme-toggle");
    if (btn) btn.setAttribute("aria-label", dark ? "switch to light mode" : "switch to dark mode");
  }

  apply(preferDark());

  // phosphor icons (regular weight, MIT): sun shows in dark mode, moon in light
  var SUN = '<path d="M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-16-16A8,8,0,0,0,42.34,53.66Zm0,116.68-16,16a8,8,0,0,0,11.32,11.32l16-16a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l16-16a8,8,0,0,0-11.32-11.32l-16,16A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32-11.32ZM48,128a8,8,0,0,0-8-8H16a8,8,0,0,0,0,16H40A8,8,0,0,0,48,128Zm80,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V216A8,8,0,0,0,128,208Zm112-88H216a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Z"/>';
  var MOON = '<path d="M233.54,142.23a8,8,0,0,0-8-2,88.08,88.08,0,0,1-109.8-109.8,8,8,0,0,0-10-10,104.84,104.84,0,0,0-52.91,37A104,104,0,0,0,136,224a103.09,103.09,0,0,0,62.52-20.88,104.84,104.84,0,0,0,37-52.91A8,8,0,0,0,233.54,142.23ZM188.9,190.34A88,88,0,0,1,65.66,67.11a89,89,0,0,1,31.4-26A106,106,0,0,0,96,56,104.11,104.11,0,0,0,200,160a106,106,0,0,0,14.92-1.06A89,89,0,0,1,188.9,190.34Z"/>';

  function icon(cls, path) {
    return '<svg class="' + cls + '" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" focusable="false">' + path + "</svg>";
  }

  function mount() {
    var btn = document.getElementById("theme-toggle");
    if (!btn) {
      btn = document.createElement("button");
      btn.id = "theme-toggle";
      btn.type = "button";
      body.appendChild(btn);
    }
    btn.innerHTML = icon("icon-sun", SUN) + icon("icon-moon", MOON);
    btn.title = "toggle theme";
    apply(body.classList.contains("dark-mode"));

    btn.addEventListener("click", function () {
      var dark = !body.classList.contains("dark-mode");
      try { localStorage.setItem(KEY, dark ? "enabled" : "disabled"); } catch (e) {}
      // crossfade the whole page in one step where supported; otherwise switch instantly
      var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (document.startViewTransition && !reduce) {
        document.startViewTransition(function () { apply(dark); });
      } else {
        apply(dark);
      }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();

  // another tab switched, or the OS flipped while no explicit choice is saved
  window.addEventListener("storage", function (e) {
    if (e.key === KEY) apply(preferDark());
  });
  if (lightQuery) {
    var onOsChange = function () { if (!saved()) apply(preferDark()); };
    if (lightQuery.addEventListener) lightQuery.addEventListener("change", onOsChange);
    else if (lightQuery.addListener) lightQuery.addListener(onOsChange);
  }
})();
