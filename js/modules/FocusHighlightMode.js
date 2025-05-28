// --- Module: Focus Highlight Mode Management ---
const FocusHighlightMode = (function () {
  let _isEnabled = false;
  const _cssClass = "empowerui-focus-highlight-active";

  /**
   * Applies focus highlighting by adding a CSS class.
   * @param {HTMLElement} toggleButton The button element to update its visual state.
   */
  function apply(toggleButton) {
    if (_isEnabled) {
      return;
    }
    _isEnabled = true;
    window._root.classList.add(_cssClass);
    localStorage.setItem("empowerUiFocusHighlightEnabled", "true");

    if (toggleButton) {
      // WRAP BUTTON VISUAL UPDATES IN setTimeout
      setTimeout(() => {
        toggleButton.textContent = "Disable Focus Highlight";
        toggleButton.classList.add("toggle-btn-active");
      }, 0); // 0ms timeout
    }
  }

  /**
   * Removes focus highlighting by removing the CSS class.
   * @param {HTMLElement} toggleButton The button element to update its visual state.
   */
  function remove(toggleButton) {
    if (!_isEnabled) {
      return;
    }
    _isEnabled = false;
    window._root.classList.remove(_cssClass);
    localStorage.setItem("empowerUiFocusHighlightEnabled", "false");

    if (toggleButton) {
      // WRAP BUTTON VISUAL UPDATES IN setTimeout
      setTimeout(() => {
        toggleButton.textContent = "Highlight Focus";
        toggleButton.classList.remove("toggle-btn-active");
      }, 0); // 0ms timeout
    }
  }

  // ... (rest of your init function remains the same, including the event listener) ...
  function init(toggleButtonId) {
    const toggleButton = document.getElementById(toggleButtonId);

    if (!toggleButton) {
      return;
    }

    _isEnabled =
      localStorage.getItem("empowerUiFocusHighlightEnabled") === "true";

    if (_isEnabled) {
      // If mode is enabled from localStorage, ensure HTML class is set and button state is correct
      window._root.classList.add(_cssClass); // Add the highlight class to <html>
      // Use a setTimeout here for the button's visual updates, consistent with apply/remove
      setTimeout(() => {
        toggleButton.textContent = "Disable Focus Highlight";
        toggleButton.classList.add("toggle-btn-active");
      }, 0); // 0ms timeout to ensure repaint
    } else {
      // Ensure button is in correct initial state if not enabled
      toggleButton.textContent = "Highlight Focus";
      toggleButton.classList.remove("toggle-btn-active");
    }

    // Event Listener
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
// Expose FocusHighlightMode to the global window object
window.FocusHighlightMode = FocusHighlightMode;
