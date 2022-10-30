import {
    canvasToClipboard,
    generateRandomKey,
    saveCanvas,
    validateKey,
} from "./helpers.js";
import { renderShape } from "./viewer.js";

/** @type {HTMLInputElement} */
const darkThemeCheckbox = document.getElementById("page-theme");
/** @type {HTMLInputElement} */
const displayShadowCheckbox = document.getElementById("display-shadow");

darkThemeCheckbox.checked = currentTheme === "dark";
darkThemeCheckbox.addEventListener("change", () => {
    updateThemePreference(darkThemeCheckbox.checked ? "dark" : "light");
});

displayShadowCheckbox.addEventListener("change", () => {
    renderShape(shapeCanvas, lastGoodKey, displayShadowCheckbox.checked);
});

/** @type {HTMLCanvasElement} */
const shapeCanvas = document.getElementById("shape-canvas");
let lastGoodKey = generateRandomKey();

const dpi = window.devicePixelRatio;
shapeCanvas.style.width = `${shapeCanvas.clientWidth}px`;
shapeCanvas.style.height = `${shapeCanvas.clientHeight}px`;
shapeCanvas.width = shapeCanvas.clientWidth * dpi;
shapeCanvas.height = shapeCanvas.clientHeight * dpi;

/** @type {HTMLInputElement} */
const shapeKeyInput = document.getElementById("shape-key");
const shapeKeyError = document.getElementById("shape-key-error");

function updateUrl(key) {
    const newUrl = new URL(location.href);
    newUrl.search = key;
    document.title = key;
    history.replaceState(null, key, newUrl);
}

shapeKeyInput.addEventListener("input", () => {
    const key = shapeKeyInput.value.trim();
    const error = validateKey(key);

    shapeKeyInput.classList.toggle("error", error);
    shapeKeyError.innerText = error || "\u00a0";
    if (error) {
        return;
    }

    lastGoodKey = key;
    updateUrl(key);
    renderShape(shapeCanvas, key, displayShadowCheckbox.checked);
});

const copyKeyButton = document.getElementById("copy-key");
const copyUrlButton = document.getElementById("copy-url");
const randomButton = document.getElementById("random");

copyKeyButton.addEventListener("click", () => {
    navigator.clipboard.writeText(lastGoodKey);
});

copyUrlButton.addEventListener("click", () => {
    navigator.clipboard.writeText(location.href);
});

randomButton.addEventListener("click", () => {
    lastGoodKey = generateRandomKey();
    shapeKeyInput.value = lastGoodKey;
    updateUrl(lastGoodKey);
    renderShape(shapeCanvas, lastGoodKey, displayShadowCheckbox.checked);
});

const resButtons = document.querySelectorAll("#action-table button");

function handleResButton(action, resolution) {
    const newCanvas = document.createElement("canvas");
    newCanvas.width = resolution;
    newCanvas.height = resolution;

    renderShape(newCanvas, lastGoodKey, displayShadowCheckbox.checked);
    action(newCanvas);
}

resButtons.forEach((button) => {
    const action = button.classList.contains("save") ? saveCanvas : canvasToClipboard;
    const resolution = parseInt(button.getAttribute("data-resolution"));

    button.addEventListener("click", handleResButton.bind(null, action, resolution));
});

// Initial page load: read the key from URL
const initialKey = location.search.slice(1).trim();
if (validateKey(initialKey) === false) {
    lastGoodKey = initialKey;
}

shapeKeyInput.value = initialKey;
updateUrl(lastGoodKey);
renderShape(shapeCanvas, lastGoodKey, displayShadowCheckbox.checked);
