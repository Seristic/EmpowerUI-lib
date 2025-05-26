// EmpowerUI.js - Your comprehensive accessibility library

// --- Core Color Transformation Functions (Internal to EmpowerUI) ---

// So, this little helper takes a CSS RGB string (like "rgb(255, 0, 128)")
// and turns it into a simple [r, g, b] array, numbers from 0-255.
// It can even handle hex colors, just in case! So clever!
function _parseRgbString(rgbString) {
    const match = rgbString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
        return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
    }
    if (rgbString.startsWith('#')) {
        const hex = rgbString.slice(1);
        if (hex.length === 3) {
            return [parseInt(hex[0] + hex[0], 16), parseInt(hex[1] + hex[1], 16), parseInt(hex[2] + hex[2], 16)];
        } else if (hex.length === 6) {
            return [parseInt(hex.substring(0, 2), 16), parseInt(hex.substring(2, 4), 16), parseInt(hex.substring(4, 6), 16)];
        }
    }
    return null; // Unable to parse the color string.
}

// Converts an [r, g, b] array (0-255) back into a CSS "rgb(r, g, b)" string.
function _toRgbString(rgbArray) {
    const r = Math.min(255, Math.max(0, Math.round(rgbArray[0])));
    const g = Math.min(255, Math.max(0, Math.round(rgbArray[1])));
    const b = Math.min(255, Math.max(0, Math.round(rgbArray[2])));
    return `rgb(${r}, ${g}, ${b})`;
}

// Applies a Deuteranopia (red-green colorblindness) transformation matrix to an RGB color.
// This adjusts colors to improve visibility for affected users.
function _transformDeuteranopia(r, g, b) {
    // Normalize RGB to 0-1 range for matrix operations.
    const R = r / 255;
    const G = g / 255;
    const B = b / 255;

    // Deuteranopia transformation matrix coefficients.
    const newR = (0.625 * R) + (0.375 * G) + (0.000 * B);
    const newG = (0.700 * R) + (0.300 * G) + (0.000 * B);
    const newB = (0.000 * R) + (0.300 * G) + (0.700 * B);

    // Convert back to 0-255 range.
    return [
        newR * 255,
        newG * 255,
        newB * 255
    ];
}

// --- EmpowerUI Library Core Logic ---

// Stores original CSS variable values to allow reverting changes.
const _originalColors = {};
let _isColorblindModeActive = false; // Tracks the current state of colorblind mode.
const _root = document.documentElement; // Refers to the <html> element for CSS variable manipulation.

// Default CSS variables that EmpowerUI's color module will attempt to transform.
// Users of this library can provide their own custom list.
const _defaultColorVariablesToTransform = [
    '--ui-color-primary',
    '--ui-color-secondary',
    '--ui-color-accent',
    '--ui-color-text',
    '--ui-color-background'
];
let _activeColorVariables = []; // Holds the specific variables for the current instance.

/**
 * Applies the Deuteranopia color transformation to the specified CSS variables.
 * Enables the colorblind accessibility mode.
 */
function _applyColorblindMode() {
    if (_isColorblindModeActive) return; // Prevent re-applying if already active.
    _isColorblindModeActive = true;

    // Add a class to the HTML element for potential global CSS effects or targeting.
    _root.classList.add('empowerui-active');

    // Iterate through specified color variables and apply the transformation.
    _activeColorVariables.forEach(varName => {
        const originalValue = getComputedStyle(_root).getPropertyValue(varName).trim();
        _originalColors[varName] = originalValue; // Store the original value.

        const rgb = _parseRgbString(originalValue);
        if (rgb) {
            const transformedRgb = _transformDeuteranopia(rgb[0], rgb[1], rgb[2]);
            _root.style.setProperty(varName, _toRgbString(transformedRgb)); // Apply the new color.
        }
    });

    // Apply a subtle global filter for enhanced visual effect.
    _root.style.filter = 'saturate(0.9) contrast(1.1)';
}

/**
 * Reverts the color transformation, restoring original CSS variable values.
 * Disables the colorblind accessibility mode.
 */
function _removeColorblindMode() {
    if (!_isColorblindModeActive) return; // Only remove if currently active.
    _isColorblindModeActive = false;

    _root.classList.remove('empowerui-active'); // Remove the global class.
    // Restore original CSS variable values.
    _activeColorVariables.forEach(varName => {
        if (_originalColors[varName]) {
            _root.style.setProperty(varName, _originalColors[varName]);
        }
    });
    _root.style.filter = ''; // Remove the global filter.
}

/**
 * Initializes the colorblind accessibility toggle.
 * This is the primary public method for integrating the colorblind feature.
 * @param {string} toggleButtonId The DOM ID of the button element that will toggle the mode.
 * @param {string[]} [customColorVars] Optional array of CSS variable names to transform.
 * If not provided, the library's default set is used.
 */
function initColorblindToggle(toggleButtonId, customColorVars) {
    const toggleButton = document.getElementById(toggleButtonId);
    // Use custom variables if provided, otherwise use the default set.
    _activeColorVariables = customColorVars || _defaultColorVariablesToTransform;

    // Check localStorage to recall the user's preferred mode from a previous visit.
    const isEnabledOnLoad = localStorage.getItem('colorblindMode') === 'enabled';

    if (isEnabledOnLoad) {
        // A slight delay ensures all page CSS is fully loaded before color values are read and transformed.
        setTimeout(_applyColorblindMode, 50);
    }

    if (toggleButton) {
        // Add event listener to the toggle button.
        toggleButton.addEventListener('click', () => {
            if (_isColorblindModeActive) {
                _removeColorblindMode();
                localStorage.setItem('colorblindMode', 'disabled'); // Save preference to localStorage.
            } else {
                _applyColorblindMode();
                localStorage.setItem('colorblindMode', 'enabled'); // Save preference to localStorage.
            }
        });
    } else {
        // Log an error if the specified toggle button isn't found, for debugging.
        console.error(`EmpowerUI Error: Toggle button with ID "${toggleButtonId}" not found. Colorblind mode cannot be initialized.`);
    }
}

// --- Make EmpowerUI Globally Accessible ---
// This exposes EmpowerUI methods on the window object, allowing developers to use them.
window.EmpowerUI = {
    initColorblindToggle: initColorblindToggle
    // Future accessibility features will be added here (e.g., initContrastToggle, initFontAdjustments).
};

// --- Auto-initialization for the Demo Page ---
// For a standalone library, this block would typically be removed,
// allowing developers to explicitly call `EmpowerUI.initColorblindToggle()`.
document.addEventListener('DOMContentLoaded', () => {
    EmpowerUI.initColorblindToggle('colorblindToggle');
});