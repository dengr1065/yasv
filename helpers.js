const allShapes = ["C", "R", "S", "W"];
const allColors = ["r", "g", "b", "y", "p", "c", "w", "u"];

function randomItem(array) {
    return array[Math.round(Math.random() * (array.length - 1))];
}

export function generateRandomKey() {
    let result = [];
    const layers = Math.round(Math.random() * 3) + 1;

    for (let i = 0; i < layers; i++) {
        let layer = "";
        for (let j = 0; j < 4; j++) {
            layer += randomItem(allShapes);
            layer += randomItem(allColors);
        }

        if (Math.random() < 0.3) {
            // Remove a single quadrant
            const index = Math.round(Math.random() * 3) * 2;
            layer = layer.slice(0, index) + "--" + layer.slice(index + 2);
        }

        result.push(layer);
    }

    return result.join(":");
}

function isColorLetter(letter) {
    return letter.toLowerCase() === letter;
}

function validateLayer(layer) {
    if (layer.length > 8) {
        return "Too many quadrants";
    }

    const fullLength = Math.floor(layer.length / 2) * 2;
    let hasShape = false;
    let previousEmpty = false;
    for (let i = 0; i < fullLength; i++) {
        const letter = layer[i];
        const isColor = isColorLetter(letter);

        if (letter !== "-" && previousEmpty) {
            return "Incomplete empty quadrant";
        }

        if (letter === "-" && !hasShape) {
            previousEmpty = !previousEmpty;
            continue;
        }

        if (isColor && !hasShape) {
            // We found a color, but the previous letter wasn't a shape
            return `Color "${letter}" is missing a shape`;
        }

        if ((!isColor || letter === "-") && hasShape) {
            // We found another shape, but the previous one had no color
            return `Shape "${layer[i - 1]}" is missing a color`;
        }

        if (!isColor) {
            // Good ending: it's a shape, expecting next letter to be a color
            hasShape = true;
            if (!allShapes.includes(letter)) {
                return `Invalid shape "${letter}"`;
            }
        } else {
            // Good ending: it's a color, and previous letter was a shape
            hasShape = false;
            if (!allColors.includes(letter)) {
                return `Invalid color "${letter}"`;
            }
        }
    }

    // Special case: check unfinished quadrant
    if (layer.length % 2 == 1) {
        const lastShape = layer[layer.length - 1];
        if (lastShape === "-") {
            return "Unfinished empty quadrant";
        }

        if (!allShapes.includes(lastShape)) {
            return `Invalid shape "${lastShape}"`;
        }

        return `Shape "${lastShape}" is missing a color`;
    }

    if (layer.length < 8) {
        // Couldn't find the exact reason, display generic error
        return "Incomplete shape";
    }

    if (layer === "--------") {
        return "Empty layer";
    }

    return false;
}

/**
 * @param {string} key
 */
export function validateKey(key) {
    if (key === "") {
        return "Please enter a shape key.";
    }

    const layers = key.split(":");
    if (layers.length > 4) {
        return "Shapes cannot contain more than 4 layers.";
    }

    const layerErrors = layers.map(validateLayer);
    const invalidLayer = layerErrors.findIndex((err) => err);
    if (invalidLayer >= 0) {
        return `${layerErrors[invalidLayer]} on layer ${invalidLayer + 1}`;
    }

    return false;
}

/**
 * @param {HTMLCanvasElement} canvas
 */
export function canvasToClipboard(canvas) {
    canvas.toBlob((blob) => {
        if (blob === null) {
            alert("Failed to generate image data.");
            return;
        }

        const item = new ClipboardItem({ "image/png": blob });
        navigator.clipboard.write([item]);
    }, "image/png");
}

export function saveCanvas(canvas) {
    canvas.toBlob((blob) => {
        if (blob === null) {
            alert("Failed to generate image data.");
            return;
        }

        const anchor = document.createElement("a");
        anchor.href = URL.createObjectURL(blob);
        anchor.download = "shape.png";
        anchor.click();
        URL.revokeObjectURL(anchor.href);
    }, "image/png");
}
