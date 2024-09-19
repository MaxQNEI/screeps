module.exports.rand = function rand(a, b) {
    return Math.round(Math.random() * (b - a) + a);
};

module.exports.randOf = function randOf(array) {
    return array[rand(0, array.length)];
};
