const arrayQuadrantIndexToOffset = [
    { x: 1, y: -1 },
    { x: 1, y: 1 },
    { x: -1, y: 1 },
    { x: -1, y: -1 },
];

/** @enum {string} */
const colorToHex = {
    r: "#ff666a",
    g: "#78ff66",
    b: "#66a7ff",
    y: "#fcf52a",
    p: "#dd66ff",
    c: "#87fff5",
    w: "#ffffff",
    u: "#aaaaaa",
};

function fromShortKey(key) {
    return key.split(":").map((text) => {
        const quads = [null, null, null, null];
        for (let quad = 0; quad < 4; quad++) {
            const subShape = text[quad * 2 + 0];
            const color = text[quad * 2 + 1];
            if (subShape) {
                quads[quad] = {
                    subShape,
                    color,
                };
            }
        }
        return quads;
    });
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {string} key
 * @param {boolean} withShadow
 */
export function renderShape(canvas, key, withShadow = true) {
    const layers = fromShortKey(key);
    const context = canvas.getContext("2d");
    context.save();

    const w = canvas.width;
    const h = canvas.height;
    context.clearRect(0, 0, w, h);

    context.lineWidth = 1;
    context.strokeStyle = "#555";
    context.translate(w / 2, h / 2);
    context.scale(w / 28, h / 28);

    const quadrantSize = 10;
    const quadrantHalfSize = quadrantSize / 2;

    if (withShadow) {
        context.fillStyle = "rgba(40, 50, 65, 0.1)";
        context.beginPath();
        context.arc(0, 0, quadrantSize * 1.15, 0, 2.0 * Math.PI);
        context.fill();
    }

    for (const [layerIndex, quadrants] of Object.entries(layers)) {
        const layerScale = 0.9 - layerIndex * 0.22;

        for (let quadrantIndex = 0; quadrantIndex < 4; quadrantIndex++) {
            if (quadrants[quadrantIndex] === null) {
                continue;
            }

            const { subShape, color } = quadrants[quadrantIndex];

            const quadrantPos = arrayQuadrantIndexToOffset[quadrantIndex];
            const centerQuadrantX = quadrantPos.x * quadrantHalfSize;
            const centerQuadrantY = quadrantPos.y * quadrantHalfSize;

            const rotation = (quadrantIndex * Math.PI) / 2;

            context.translate(centerQuadrantX, centerQuadrantY);
            context.rotate(rotation);

            context.fillStyle = colorToHex[color];
            context.beginPath();

            const dims = quadrantSize * layerScale;

            switch (subShape) {
                case "R": {
                    context.rect(-quadrantHalfSize, quadrantHalfSize - dims, dims, dims);
                    break;
                }
                case "S": {
                    const originX = -quadrantHalfSize;
                    const originY = quadrantHalfSize - dims;
                    const moveInwards = dims * 0.4;

                    context.moveTo(originX, originY + moveInwards);
                    context.lineTo(originX + dims, originY);
                    context.lineTo(originX + dims - moveInwards, originY + dims);
                    context.lineTo(originX, originY + dims);
                    break;
                }

                case "W": {
                    const originX = -quadrantHalfSize;
                    const originY = quadrantHalfSize - dims;
                    const moveInwards = dims * 0.4;

                    context.moveTo(originX, originY + moveInwards);
                    context.lineTo(originX + dims, originY);
                    context.lineTo(originX + dims, originY + dims);
                    context.lineTo(originX, originY + dims);
                    break;
                }

                case "C": {
                    context.moveTo(-quadrantHalfSize, quadrantHalfSize);
                    context.arc(
                        -quadrantHalfSize,
                        quadrantHalfSize,
                        quadrantSize * layerScale,
                        -Math.PI * 0.5,
                        0
                    );
                    break;
                }
            }

            context.closePath();
            context.fill();
            context.stroke();

            context.rotate(-rotation);
            context.translate(-centerQuadrantX, -centerQuadrantY);
        }
    }

    context.restore();
}
