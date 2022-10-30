const THEME_PREF_KEY = "theme-preference";
let currentTheme = localStorage.getItem(THEME_PREF_KEY);

if (currentTheme === null) {
    detectSystemTheme();
} else {
    updateThemePreference(currentTheme, false);
}

function detectSystemTheme() {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    updateThemePreference(prefersDark ? "dark" : "light");
}

/**
 * @param {"light" | "dark"} preference
 */
function updateThemePreference(preference, write = true) {
    currentTheme = preference;
    if (write) {
        localStorage.setItem(THEME_PREF_KEY, preference);
    }

    document.body.classList.toggle("dark", preference === "dark");
}
