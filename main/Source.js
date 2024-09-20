class XSource {
    offsets = [
        [-1, -1],
        [0, -1],
        [1, -1],
        [-1, 0],
        [1, 0],
        [-1, 1],
        [0, 1],
        [1, 1],
    ];

    source = null;

    constructor(source) {
        this.source = source;

        this.creepLimit();
    }

    creepLimit() {
        const { x, y } = this.source.pos;

        let limit = 0;

        for (const [dx, dy] of this.offsets) {
            const look = this.source.room.lookAt(dx + x, dy + y);

            const ok = look.some((data) => {
                const { type, terrain } = data;

                if (dx + x === 6 && dy + y === 44) {
                    console.log(JSON.stringify(data));
                }

                // When it's plain or swamp terrain
                if (
                    type === "terrain" &&
                    (terrain === "plain" || terrain === "swamp")
                ) {
                    return true;
                }

                // When there's a creep
                if (type === "creep") {
                    return true;
                }

                return false;
            });

            limit += ok ? 1 : 0;
        }

        return limit;
    }
}

module.exports = XSource;
