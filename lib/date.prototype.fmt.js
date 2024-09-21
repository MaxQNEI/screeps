Date.prototype.fmt = function fmt(format = "Y-M-D h:m:s") {
    const [Y, M, D, h, m, s, ms] = [
        this.getFullYear(),
        (this.getMonth() + 1).toString().padStart(2, "0"),
        this.getDate().toString().padStart(2, "0"),
        this.getHours().toString().padStart(2, "0"),
        this.getMinutes().toString().padStart(2, "0"),
        this.getSeconds().toString().padStart(2, "0"),
        this.getMilliseconds().toString().padEnd(3, "0"),
    ];

    return format
        .replace(/ms/g, ms)
        .replace(/Y/g, Y)
        .replace(/M/g, M)
        .replace(/D/g, D)
        .replace(/h/g, h)
        .replace(/m/g, m)
        .replace(/s/g, s);
};
