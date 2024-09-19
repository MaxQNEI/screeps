function rand(a, b) {
    return Math.round(Math.random() * (b - a) + a);
}

function randOf(array) {
    return array[rand(0, array.length)];
}

module.exports.rand = rand;
module.exports.randOf = randOf;
