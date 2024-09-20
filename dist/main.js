(() => {
    // src/main.js
    function loop() {
        console.log("tick");
    }

    // src/index.js
    module.exports.loop = loop;
})();
