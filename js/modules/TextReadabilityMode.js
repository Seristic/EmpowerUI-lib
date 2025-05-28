// --- Module: Text Readability Mode Management (includes size, font, line height, letter spacing) ---
const TextReadabilityMode = (function () {
    // --- Text Size Settings ---
    const _defaultSizePx = 16; // Default font size in pixels (matches CSS :root)
    const _sizeStepPx = 2; // How many pixels to increase/decrease by
    const _minSizePx = 12; // Minimum font size
    const _maxSizePx = 24; // Maximum font size
    let _currentSizePx = _defaultSizePx;

    // --- Dyslexia Font Settings ---
    let _isDyslexiaFontEnabled = false;

    // --- Line Height Settings ---
    const _defaultLineHeight = 1.6;
    const _lineHeightStep = 0.1;
    const _minLineHeight = 1.2;
    const _maxLineHeight = 2.5;
    let _currentLineHeight = _defaultLineHeight;

    // --- Letter Spacing Settings ---
    const _defaultLetterSpacing = 0; // in em
    const _letterSpacingStep = 0.05; // in em
    const _minLetterSpacing = 0; // in em
    const _maxLetterSpacing = 0.2; // in em
    let _currentLetterSpacing = _defaultLetterSpacing;

    let _baseFontSizeVarName = null; // To be set during initialization
    let _lineHeightVarName = null; // To be set during initialization
    let _letterSpacingVarName = null; // To be set during initialization

    // --- Core Application Functions ---

    /**
     * Applies the current font size to the CSS variable.
     */
    function _applyFontSize() {
        if (_baseFontSizeVarName) {
            window._root.style.setProperty(_baseFontSizeVarName, `${_currentSizePx}px`);
            localStorage.setItem('empowerUiTextSizePx', _currentSizePx.toString());
        }
    }

    /**
     * Applies the current line height to the CSS variable.
     */
    function _applyLineHeight() {
        if (_lineHeightVarName) {
            window._root.style.setProperty(_lineHeightVarName, _currentLineHeight.toFixed(1)); // Use toFixed for consistent decimals
            localStorage.setItem('empowerUiLineHeight', _currentLineHeight.toFixed(1));
        }
    }

    /**
     * Applies the current letter spacing to the CSS variable.
     */
    function _applyLetterSpacing() {
        if (_letterSpacingVarName) {
            window._root.style.setProperty(_letterSpacingVarName, `${_currentLetterSpacing.toFixed(2)}em`); // Use toFixed for consistent decimals
            localStorage.setItem('empowerUiLetterSpacing', _currentLetterSpacing.toFixed(2));
        }
    }

    /**
     * Applies the dyslexia-friendly font.
     * @param {HTMLElement} toggleButton The button element to update its visual state.
     */
    function _applyDyslexicFont(toggleButton) {
        if (_isDyslexiaFontEnabled) return; // Already enabled
        _isDyslexiaFontEnabled = true;
        window._root.classList.add('empowerui-dyslexia-font-active'); // Add a class for CSS to pick up
        localStorage.setItem('empowerUiDyslexicFontEnabled', 'true');

        // Update button visual state
        if (toggleButton) {
            toggleButton.textContent = 'Disable Dyslexia Font';
            toggleButton.classList.add('toggle-btn-active');
        }
    }

    /**
     * Removes the dyslexia-friendly font.
     * @param {HTMLElement} toggleButton The button element to update its visual state.
     */
    function _removeDyslexicFont(toggleButton) {
        if (!_isDyslexiaFontEnabled) return; // Already disabled
        _isDyslexiaFontEnabled = false;
        window._root.classList.remove('empowerui-dyslexia-font-active');
        localStorage.setItem('empowerUiDyslexicFontEnabled', 'false');

        // Update button visual state
        if (toggleButton) {
            toggleButton.textContent = 'Enable Dyslexia Font';
            toggleButton.classList.remove('toggle-btn-active');
        }
    }

    // --- Text Size Controls ---
    function increaseTextSize() {
        if (_currentSizePx < _maxSizePx) {
            _currentSizePx = Math.min(_maxSizePx, _currentSizePx + _sizeStepPx);
            _applyFontSize();
        }
    }

    function decreaseTextSize() {
        if (_currentSizePx > _minSizePx) {
            _currentSizePx = Math.max(_minSizePx, _currentSizePx - _sizeStepPx);
            _applyFontSize();
        }
    }

    function resetTextSize() {
        if (_currentSizePx !== _defaultSizePx) {
            _currentSizePx = _defaultSizePx;
            _applyFontSize();
        }
    }

    // --- Line Height Controls ---
    function increaseLineHeight() {
        if (_currentLineHeight < _maxLineHeight) {
            _currentLineHeight = Math.min(_maxLineHeight, _currentLineHeight + _lineHeightStep);
            _applyLineHeight();
        }
    }

    function decreaseLineHeight() {
        if (_currentLineHeight > _minLineHeight) {
            _currentLineHeight = Math.max(_minLineHeight, _currentLineHeight - _lineHeightStep);
            _applyLineHeight();
        }
    }

    function resetLineHeight() {
        if (_currentLineHeight !== _defaultLineHeight) {
            _currentLineHeight = _defaultLineHeight;
            _applyLineHeight();
        }
    }

    // --- Letter Spacing Controls ---
    function increaseLetterSpacing() {
        if (_currentLetterSpacing < _maxLetterSpacing) {
            _currentLetterSpacing = Math.min(_maxLetterSpacing, _currentLetterSpacing + _letterSpacingStep);
            _applyLetterSpacing();
        }
    }

    function decreaseLetterSpacing() {
        if (_currentLetterSpacing > _minLetterSpacing) {
            _currentLetterSpacing = Math.max(_minLetterSpacing, _currentLetterSpacing - _letterSpacingStep);
            _applyLetterSpacing();
        }
    }

    function resetLetterSpacing() {
        if (_currentLetterSpacing !== _defaultLetterSpacing) {
            _currentLetterSpacing = _defaultLetterSpacing;
            _applyLetterSpacing();
        }
    }


    /**
     * Public initialization for the text readability module.
     * @param {string} increaseTextBtnId ID for the increase text size button.
     * @param {string} decreaseTextBtnId ID for the decrease text size button.
     * @param {string} resetTextBtnId ID for the reset text size button.
     * @param {string} baseFontSizeVar The CSS variable name for the base font size (e.g., '--ui-base-font-size').
     * @param {string} dyslexiaFontToggleId ID for the dyslexia font toggle button.
     * @param {string} increaseLineHeightBtnId ID for the increase line height button.
     * @param {string} decreaseLineHeightBtnId ID for the decrease line height button.
     * @param {string} resetLineHeightBtnId ID for the reset line height button.
     * @param {string} lineHeightVar The CSS variable name for line height (e.g., '--ui-line-height').
     * @param {string} increaseLetterSpacingBtnId ID for the increase letter spacing button.
     * @param {string} decreaseLetterSpacingBtnId ID for the decrease letter spacing button.
     * @param {string} resetLetterSpacingBtnId ID for the reset letter spacing button.
     * @param {string} letterSpacingVar The CSS variable name for letter spacing (e.g., '--ui-letter-spacing').
     */
    function init(
        increaseTextBtnId, decreaseTextBtnId, resetTextBtnId, baseFontSizeVar,
        dyslexiaFontToggleId,
        increaseLineHeightBtnId, decreaseLineHeightBtnId, resetLineHeightBtnId, lineHeightVar,
        increaseLetterSpacingBtnId, decreaseLetterSpacingBtnId, resetLetterSpacingBtnId, letterSpacingVar
    ) {
        // Text Size elements
        const increaseTextBtn = document.getElementById(increaseTextBtnId);
        const decreaseTextBtn = document.getElementById(decreaseTextBtnId);
        const resetTextBtn = document.getElementById(resetTextBtnId);
        _baseFontSizeVarName = baseFontSizeVar; // Store the CSS variable name

        // Dyslexia Font element
        const dyslexiaFontToggle = document.getElementById(dyslexiaFontToggleId);

        // Line Height elements
        const increaseLineHeightBtn = document.getElementById(increaseLineHeightBtnId);
        const decreaseLineHeightBtn = document.getElementById(decreaseLineHeightBtnId);
        const resetLineHeightBtn = document.getElementById(resetLineHeightBtnId);
        _lineHeightVarName = lineHeightVar;

        // Letter Spacing elements
        const increaseLetterSpacingBtn = document.getElementById(increaseLetterSpacingBtnId);
        const decreaseLetterSpacingBtn = document.getElementById(decreaseLetterSpacingBtnId);
        const resetLetterSpacingBtn = document.getElementById(resetLetterSpacingBtnId);
        _letterSpacingVarName = letterSpacingVar;

        // Basic error checking for elements
        if (!increaseTextBtn || !decreaseTextBtn || !resetTextBtn || !dyslexiaFontToggle ||
            !increaseLineHeightBtn || !decreaseLineHeightBtn || !resetLineHeightBtn ||
            !increaseLetterSpacingBtn || !decreaseLetterSpacingBtn || !resetLetterSpacingBtn) {
            console.error('EmpowerUI Error: One or more text readability control buttons not found. Check IDs.');
            return;
        }

        // --- Load State from localStorage & Apply on Load ---

        // Load font size
        const savedSize = localStorage.getItem('empowerUiTextSizePx');
        _currentSizePx = savedSize ? parseInt(savedSize) : _defaultSizePx;
        setTimeout(() => _applyFontSize(), 50);

        // Load dyslexia font state
        _isDyslexiaFontEnabled = localStorage.getItem('empowerUiDyslexicFontEnabled') === 'true';
        if (_isDyslexiaFontEnabled) {
            setTimeout(() => _applyDyslexicFont(dyslexiaFontToggle), 50);
        } else {
            // Ensure button is in correct initial state if not enabled
            dyslexiaFontToggle.textContent = 'Enable Dyslexia Font';
            dyslexiaFontToggle.classList.remove('toggle-btn-active');
        }

        // Load line height
        const savedLineHeight = localStorage.getItem('empowerUiLineHeight');
        _currentLineHeight = savedLineHeight ? parseFloat(savedLineHeight) : _defaultLineHeight;
        setTimeout(() => _applyLineHeight(), 50);

        // Load letter spacing
        const savedLetterSpacing = localStorage.getItem('empowerUiLetterSpacing');
        _currentLetterSpacing = savedLetterSpacing ? parseFloat(savedLetterSpacing) : _defaultLetterSpacing;
        setTimeout(() => _applyLetterSpacing(), 50);


        // --- Event Listeners ---

        // Text Size
        increaseTextBtn.addEventListener('click', increaseTextSize);
        decreaseTextBtn.addEventListener('click', decreaseTextSize);
        resetTextBtn.addEventListener('click', resetTextSize);

        // Dyslexia Font
        dyslexiaFontToggle.addEventListener('click', () => {
            if (_isDyslexiaFontEnabled) {
                _removeDyslexicFont(dyslexiaFontToggle);
            } else {
                _applyDyslexicFont(dyslexiaFontToggle);
            }
        });

        // Line Height
        increaseLineHeightBtn.addEventListener('click', increaseLineHeight);
        decreaseLineHeightBtn.addEventListener('click', decreaseLineHeight);
        resetLineHeightBtn.addEventListener('click', resetLineHeight);

        // Letter Spacing
        increaseLetterSpacingBtn.addEventListener('click', increaseLetterSpacing);
        decreaseLetterSpacingBtn.addEventListener('click', decreaseLetterSpacing);
        resetLetterSpacingBtn.addEventListener('click', resetLetterSpacing);
    }

    return { init };
})();

// Expose TextReadabilityMode to the global window object
window.TextReadabilityMode = TextReadabilityMode;