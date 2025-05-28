// EmpowerUI.js - The main entry point for the accessibility library.
// It orchestrates the loading and initialization of individual modules.

// Get the root HTML element, which is used by many modules to apply classes or styles.
const _root = document.documentElement; // Refers to the <html> element.
// Expose it globally so modules can access it easily without redeclaring.
window._root = _root;

// Wait for the DOM to be fully loaded before initializing modules.
document.addEventListener("DOMContentLoaded", () => {
  // Dynamically load module scripts.
  // For simplicity, we'll assume they are loaded via <script> tags in index.html
  // and expose their `init` functions globally (e.g., window.ColorMode.init).

  // --- Initialize Modules ---
  // Note: _defaultColorVariablesToTransform is now exposed by ColorMode.js
  if (
    window.ColorMode &&
    window.ColorMode.init &&
    window._defaultColorVariablesToTransform
  ) {
    window.EmpowerUI.initColorMode(
      "colorModeToggle",
      "colorModeType",
      window._defaultColorVariablesToTransform
    );
  } else {
    console.error(
      "EmpowerUI: ColorMode module or its dependencies not loaded correctly."
    );
  }

  // Removed _defaultColorVariablesToTransform check as HighContrastMode no longer uses it directly
  if (window.HighContrastMode && window.HighContrastMode.init) {
    window.EmpowerUI.initHighContrastMode("highContrastToggle");
  } else {
    console.error(
      "EmpowerUI: HighContrastMode module or its dependencies not loaded correctly."
    );
  }

  if (window.TextReadabilityMode && window.TextReadabilityMode.init) {
    window.EmpowerUI.initTextReadability(
      "increaseText",
      "decreaseText",
      "resetText",
      "--ui-base-font-size", // Text Size
      "dyslexiaFontToggle", // Dyslexia Font
      "increaseLineHeight",
      "decreaseLineHeight",
      "resetLineHeight",
      "--ui-line-height", // Line Height
      "increaseLetterSpacing",
      "decreaseLetterSpacing",
      "resetLetterSpacing",
      "--ui-letter-spacing" // Letter Spacing
    );
  } else {
    console.error(
      "EmpowerUI: TextReadabilityMode module not loaded correctly."
    );
  }

  if (window.MotionMode && window.MotionMode.init) {
    window.EmpowerUI.initMotionMode("reduceMotionToggle");
  } else {
    console.error("EmpowerUI: MotionMode module not loaded correctly.");
  }

  // THIS IS THE CRUCIAL PART! The FocusHighlightMode initialization call
  if (window.FocusHighlightMode && window.FocusHighlightMode.init) {
    window.EmpowerUI.initFocusHighlight("focusHighlightToggle"); // <<< THIS LINE WAS MISSING/COMMENTED OUT!
  } else {
    console.error("EmpowerUI: FocusHighlightMode module not loaded correctly.");
  }
});

// Make EmpowerUI's initialization functions globally accessible (for index.html script tags).
// These simply delegate to the init functions of the individual modules.
window.EmpowerUI = {
  initColorMode: (toggleId, typeSelectorId, colorVars) => {
    if (window.ColorMode)
      window.ColorMode.init(toggleId, typeSelectorId, colorVars);
  },
  initHighContrastMode: (toggleId) => {
    // Removed colorVars parameter here
    if (window.HighContrastMode) window.HighContrastMode.init(toggleId);
  },
  initTextReadability: (
    incText,
    decText,
    resetText,
    fontSizeVar,
    dyslexiaToggle,
    incLine,
    decLine,
    resetLine,
    lineHeightVar,
    incLetter,
    decLetter,
    resetLetter,
    letterSpacingVar
  ) => {
    if (window.TextReadabilityMode)
      window.TextReadabilityMode.init(
        incText,
        decText,
        resetText,
        fontSizeVar,
        dyslexiaToggle,
        incLine,
        decLine,
        resetLine,
        lineHeightVar,
        incLetter,
        decLetter,
        resetLetter,
        letterSpacingVar
      );
  },
  initMotionMode: (toggleId) => {
    if (window.MotionMode) window.MotionMode.init(toggleId);
  },
  // This function was correctly added to EmpowerUI object, but wasn't being called!
  initFocusHighlight: (toggleId) => {
    if (window.FocusHighlightMode) window.FocusHighlightMode.init(toggleId);
  },
};
