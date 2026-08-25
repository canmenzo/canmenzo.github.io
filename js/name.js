(function () {
  var el = document.getElementById("name");
  if (!el) return;

  var real = el.dataset.text;
  var glyphs = "!<>-_\/[]{}=+*^?#01__%&$";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var busy = false;

  function set(text) {
    el.textContent = text;
    el.dataset.text = text;
  }

  // resolves the name one character at a time, random glyphs ahead of the cursor
  function decrypt() {
    if (busy || reduce) return;
    busy = true;
    el.classList.add("scrambling");

    var frame = 0;
    var timer = setInterval(function () {
      var settled = Math.floor(frame / 3);
      var out = "";
      for (var i = 0; i < real.length; i++) {
        if (i < settled || real[i] === " ") out += real[i];
        else out += glyphs[Math.floor(Math.random() * glyphs.length)];
      }
      set(out);
      frame++;
      if (settled >= real.length) {
        clearInterval(timer);
        set(real);
        el.classList.remove("scrambling");
        busy = false;
      }
    }, 40);
  }

  decrypt();
  el.addEventListener("mouseenter", decrypt);
  el.addEventListener("click", decrypt);

  if (!reduce) {
    setInterval(function () {
      if (busy) return;
      el.classList.add("glitch");
      setTimeout(function () { el.classList.remove("glitch"); }, 700);
    }, 7000);
  }
})();
