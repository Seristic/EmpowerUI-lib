// --- Core Utility Functions (Internal to EmpowerUI - copy these too) ---
// Parses a CSS RGB string (e.g., "rgb(255, 0, 128)") into a [r, g, b] array (0-255).
// Also handles hex color strings.
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

// --- Specific Colorblindness Transformation Matrices ---

// Deuteranopia (Red-Green) transformation
function _transformDeuteranopia(r, g, b) {
    const R = r / 255; const G = g / 255; const B = b / 255;
    const newR = (0.625 * R) + (0.375 * G) + (0.000 * B);
    const newG = (0.700 * R) + (0.300 * G) + (0.000 * B);
    const newB = (0.000 * R) + (0.300 * G) + (0.700 * B);
    return [newR * 255, newG * 255, newB * 255];
}

// Protanopia (Red-Green, slightly different than Deuteranopia) transformation
function _transformProtanopia(r, g, b) {
    const R = r / 255; const G = g / 255; const B = b / 255;
    const newR = (0.567 * R) + (0.433 * G) + (0.000 * B);
    const newG = (0.558 * R) + (0.442 * G) + (0.000 * B);
    const newB = (0.000 * R) + (0.242 * G) + (0.758 * B);
    return [newR * 255, newG * 255, newB * 255];
}

// Tritanopia (Blue-Yellow) transformation
function _transformTritanopia(r, g, b) {
    const R = r / 255; const G = g / 255; const B = b / 255;
    const newR = (0.950 * R) + (0.050 * G) + (0.000 * B);
    const newG = (0.000 * R) + (0.433 * G) + (0.567 * B);
    const newB = (0.000 * R) + (0.475 * G) + (0.525 * B);
    return [newR * 255, newG * 255, newB * 255];
}

// Monochromacy (Grayscale) transformation - simple luminance
function _transformMonochromacy(r, g, b) {
    const avg = (0.299 * r) + (0.587 * g) + (0.114 * b);
    return [avg, avg, avg];
}

// Map of transformation functions by type for easy lookup
const _colorTransforms = {
    'deuteranopia': _transformDeuteranopia,
    'protanopia': _transformProtanopia,
    'tritanopia': _transformTritanopia,
    'monochromacy': _transformMonochromacy
};

// Default CSS variables that EmpowerUI's color module will attempt to transform.
const _defaultColorVariablesToTransform = [
    '--ui-color-primary',
    '--ui-color-secondary',
    '--ui-color-accent',
    '--ui-color-text',
    '--ui-color-background'
];

// --- Module: Color Mode Management ---
const ColorMode = (function () {
    const _originalColors = {}; // Stores original CSS variable values for color mode
    let _isEnabled = false;
    let _activeType = null; // Stores the active colorblind type (e.g., 'deuteranopia')

    /**
     * Applies the selected color transformation to the specified CSS variables.
     * @param {string} type The type of color transformation to apply (e.g., 'deuteranopia').
     * @param {string[]} colorVars Array of CSS variable names to transform.
     * @param {HTMLElement} toggleButton The button element to update its visual state.
     */
    function apply(type, colorVars, toggleButton) {
        if (!type || !_colorTransforms[type]) {
            console.warn(`EmpowerUI Warning: Invalid color mode type '${type}' requested.`);
            return;
        }

        if (_isEnabled && _activeType === type) return; // Already active with this type

        // If switching types while already enabled, revert previous type's class
        if (_isEnabled && _activeType && _activeType !== type) {
            window._root.classList.remove(`empowerui-mode-${_activeType}`);
        }

        _isEnabled = true;
        _activeType = type;
        window._root.classList.add('empowerui-active'); // Global active class
        window._root.classList.add(`empowerui-mode-${type}`); // Specific type class

        const transformFn = _colorTransforms[type];

        colorVars.forEach(varName => {
            const originalValue = getComputedStyle(window._root).getPropertyValue(varName).trim();
            // Store original if not already stored, or if re-applying after a reset/type change
            if (!_originalColors[varName] || !_isEnabled || (_activeType !== type)) {
                _originalColors[varName] = originalValue;
            }

            const rgb = _parseRgbString(originalValue);
            if (rgb) {
                const transformedRgb = transformFn(rgb[0], rgb[1], rgb[2]);
                window._root.style.setProperty(varName, _toRgbString(transformedRgb));
            }
        });

        window._root.style.filter = 'saturate(0.9) contrast(1.1)'; // Apply a subtle global filter

        // Update button visual state
        if (toggleButton) {
            toggleButton.textContent = 'Disable Color Mode';
            toggleButton.classList.add('toggle-btn-active');
        }
    }

    /**
     * Reverts the color transformation, restoring original CSS variable values.
     * @param {string[]} colorVars Array of CSS variable names to transform.
     * @param {HTMLElement} toggleButton The button element to update its visual state.
     */
    function remove(colorVars, toggleButton) {
        if (!_isEnabled) return;
        _isEnabled = false;
        _activeType = null;

        window._root.classList.remove('empowerui-active');
        for (const key in _colorTransforms) { // Remove all specific mode classes
            window._root.classList.remove(`empowerui-mode-${key}`);
        }

        colorVars.forEach(varName => {
            if (_originalColors[varName]) {
                window._root.style.setProperty(varName, _originalColors[varName]);
            }
        });
        window._root.style.filter = ''; // Remove global filter.

        // Update button visual state
        if (toggleButton) {
            toggleButton.textContent = 'Enable Color Mode';
            toggleButton.classList.remove('toggle-btn-active');
        }
    }

    /**
     * Public initialization for the color mode module.
     * @param {string} toggleButtonId The ID of the button to enable/disable.
     * @param {string} typeSelectorId The ID of the select/dropdown for type selection.
     * @param {string[]} colorVars Array of CSS variable names to transform.
     */
    function init(toggleButtonId, typeSelectorId, colorVars) {
        const toggleButton = document.getElementById(toggleButtonId);
        const typeSelector = document.getElementById(typeSelectorId);

        if (!toggleButton || !typeSelector) {
            console.error(`EmpowerUI Error: Color mode controls not found (Toggle: ${toggleButtonId}, Selector: ${typeSelectorId}).`);
            return;
        }

        // --- Load state from localStorage ---
        _isEnabled = localStorage.getItem('empowerUiColorModeEnabled') === 'true';
        _activeType = localStorage.getItem('empowerUiColorModeType');

        // Set initial UI state
        if (_activeType && typeSelector.querySelector(`option[value="${_activeType}"]`)) {
            typeSelector.value = _activeType;
        } else {
            typeSelector.value = 'none'; // Default to placeholder
        }

        // Apply mode if it was enabled on load
        if (_isEnabled && _activeType && _activeType !== 'none') {
            setTimeout(() => apply(_activeType, colorVars, toggleButton), 50);
        } else {
            // Ensure button is in correct initial state if not enabled
            toggleButton.textContent = 'Enable Color Mode';
            toggleButton.classList.remove('toggle-btn-active');
        }

        // --- Event Listeners ---
        toggleButton.addEventListener('click', () => {
            if (_isEnabled) {
                remove(colorVars, toggleButton);
                localStorage.setItem('empowerUiColorModeEnabled', 'false');
                localStorage.removeItem('empowerUiColorModeType');
                typeSelector.value = 'none';
            } else {
                let selectedType = typeSelector.value;
                if (selectedType === 'none' || !_colorTransforms[selectedType]) {
                    selectedType = 'deuteranopia'; // Default
                    typeSelector.value = selectedType;
                }
                apply(selectedType, colorVars, toggleButton);
                localStorage.setItem('empowerUiColorModeEnabled', 'true');
                localStorage.setItem('empowerUiColorModeType', selectedType);
            }
        });

        typeSelector.addEventListener('change', (event) => {
            const newType = event.target.value;
            if (newType === 'none' || !_colorTransforms[newType]) {
                // If they select the placeholder, disable mode if it was active
                if (_isEnabled) {
                    remove(colorVars, toggleButton);
                    localStorage.setItem('empowerUiColorModeEnabled', 'false');
                    localStorage.removeItem('empowerUiColorModeType');
                }
                return;
            }

            if (_isEnabled) {
                // Remove previous mode's class before applying new one
                for (const key in _colorTransforms) {
                    window._root.classList.remove(`empowerui-mode-${key}`);
                }
                apply(newType, colorVars, toggleButton); // Apply the new type
                localStorage.setItem('empowerUiColorModeType', newType); // Save new type
            } else { // If not enabled, just save preference for next time
                localStorage.setItem('empowerUiColorModeType', newType);
            }
        });
    }

    return { init };
})();

// Expose ColorMode to the global window object for EmpowerUI.js to use
window.ColorMode = ColorMode;
window._defaultColorVariablesToTransform = _defaultColorVariablesToTransform; // Also expose this, as it's needed globally