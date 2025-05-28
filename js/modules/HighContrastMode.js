// --- Module: High Contrast Mode Management ---
const HighContrastMode = (function () {
  let _isEnabled = false;
  const _cssClass = "empowerui-high-contrast-active"; // The class added to <html>

  /**
   * Applies high contrast mode by adding a CSS class.
   * @param {HTMLElement} toggleButton The button element to update its visual state.
   */
  function apply(toggleButton) {
    if (_isEnabled) return;
    _isEnabled = true;

    window._root.classList.add(_cssClass); // Add the class for CSS to handle styling
    localStorage.setItem("empowerUiHighContrastEnabled", "true");

    // Update button visual state
    if (toggleButton) {
      toggleButton.textContent = "Disable High Contrast";
      toggleButton.classList.add("toggle-btn-active");
    }
  }

  /**
   * Reverts high contrast mode by removing the CSS class.
   * @param {HTMLElement} toggleButton The button element to update its visual state.
   */
  function remove(toggleButton) {
    if (!_isEnabled) return;
    _isEnabled = false;

    window._root.classList.remove(_cssClass); // Remove the class
    localStorage.setItem("empowerUiHighContrastEnabled", "false");

    // Update button visual state
    if (toggleButton) {
      toggleButton.textContent = "Enable High Contrast";
      toggleButton.classList.remove("toggle-btn-active");
    }
  }

  /**
   * Public initialization for the high contrast mode module.
   * @param {string} toggleButtonId The ID of the button to enable/disable high contrast.
   * @param {string[]} _colorVars (This parameter is now unused but kept for compatibility if needed elsewhere)
   */
  function init(toggleButtonId, _colorVars) {
    // _colorVars parameter is now unused here
    const toggleButton = document.getElementById(toggleButtonId);

    if (!toggleButton) {
      console.error(
        `EmpowerUI Error: High contrast toggle button with ID "${toggleButtonId}" not found.`
      );
      return;
    }

    // --- Load state from localStorage ---
    _isEnabled =
      localStorage.getItem("empowerUiHighContrastEnabled") === "true";

    // Apply mode if it was enabled on load
    if (_isEnabled) {
      setTimeout(() => apply(toggleButton), 50);
    } else {
      // Ensure button is in correct initial state if not enabled
      toggleButton.textContent = "Enable High Contrast";
      toggleButton.classList.remove("toggle-btn-active");
    }

    // --- Event Listener ---
    toggleButton.addEventListener("click", () => {
      if (_isEnabled) {
        remove(toggleButton);
      } else {
        apply(toggleButton);
      }
    });
  }

  return { init };
})();

// Expose HighContrastMode to the global window object
window.HighContrastMode = HighContrastMode;
