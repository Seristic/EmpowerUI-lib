// --- Module: Motion Mode Management ---
const MotionMode = (function () {
    let _isEnabled = false;
    const _cssClass = 'empowerui-reduced-motion-active'; // The class added to <html>

    /**
     * Applies motion reduction by adding a CSS class.
     * @param {HTMLElement} toggleButton The button element to update its visual state.
     */
    function apply(toggleButton) {
        if (_isEnabled) return; // Already enabled
        _isEnabled = true;
        window._root.classList.add(_cssClass);
        localStorage.setItem('empowerUiReducedMotionEnabled', 'true');

        // Update button visual state
        if (toggleButton) {
            toggleButton.textContent = 'Disable Motion';
            toggleButton.classList.add('toggle-btn-active');
        }
    }

    /**
     * Removes motion reduction by removing the CSS class.
     * @param {HTMLElement} toggleButton The button element to update its visual state.
     */
    function remove(toggleButton) {
        if (!_isEnabled) return; // Already disabled
        _isEnabled = false;
        window._root.classList.remove(_cssClass);
        localStorage.setItem('empowerUiReducedMotionEnabled', 'false');

        // Update button visual state
        if (toggleButton) {
            toggleButton.textContent = 'Reduce Motion';
            toggleButton.classList.remove('toggle-btn-active');
        }
    }

    /**
     * Public initialization for the MotionMode module.
     * @param {string} toggleButtonId The ID of the button to enable/disable motion reduction.
     */
    function init(toggleButtonId) {
        const toggleButton = document.getElementById(toggleButtonId);

        if (!toggleButton) {
            console.error(`EmpowerUI Error: Motion reduction toggle button with ID "${toggleButtonId}" not found.`);
            return;
        }

        // --- Load state from localStorage ---
        _isEnabled = localStorage.getItem('empowerUiReducedMotionEnabled') === 'true';

        // Apply mode if it was enabled on load
        if (_isEnabled) {
            setTimeout(() => apply(toggleButton), 50);
        } else {
            // Ensure button is in correct initial state if not enabled
            toggleButton.textContent = 'Reduce Motion';
            toggleButton.classList.remove('toggle-btn-active');
        }

        // --- Event Listener ---
        toggleButton.addEventListener('click', () => {
            if (_isEnabled) {
                remove(toggleButton);
            } else {
                apply(toggleButton);
            }
        });
    }

    return { init };
})();

// Expose MotionMode to the global window object
window.MotionMode = MotionMode;