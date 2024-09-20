(() => {
  // src/main.js
  function loop() {
    console.log("tick");
  }

  // src/index.js
  "Flag:".concat(loop.name);
})();
