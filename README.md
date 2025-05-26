# ✨ EmpowerUI ✨

### Your All-in-One Web Accessibility Toolkit! 💖

---

Hello there, fabulous developer! 👋 Welcome to **EmpowerUI** – my very own creation designed to make web accessibility as easy and delightful as possible for *everyone*. This library is a growing collection of JavaScript tools that help you sprinkle accessibility magic onto your websites with minimal fuss!

We're starting our journey with **dynamic color vision adjustments** for folks with colorblindness, but stay tuned because EmpowerUI is dreaming bigger! This will eventually cover *anything* accessibility, making your UIs truly empowering.

---

## 🌟 Why EmpowerUI?

- **Effortless Integration:** Designed to be super simple to add to any web project.
- **Dynamic & Responsive:** Adapts on the fly, making your site more inclusive.
- **User-Centric:** Built with the goal of giving users more control over their Browse experience.
- **Open-Source Love:** Crafted with care and open for everyone to use and contribute to!

---

## 🎀 Features (So Far!)

### Colorblindness Transformation (Deuteranopia)

- **Dynamic Color Adjustment:** Automatically transforms your site's CSS colors to improve visibility for users with Deuteranopia (red-green colorblindness).
- **CSS Variable Friendly:** Works beautifully by manipulating your custom CSS variables (like `--ui-color-primary`).
- **User Preference Saved:** Remembers if a user prefers colorblind mode even after they leave and come back to your site. How thoughtful!

---

## 🚀 Getting Started (It's Easy, Sweetie!)

### 1. Grab the Library

Just download the `EmpowerUI.js` file from this repository and pop it into your project (a `js/` folder is a great place!).

### 2. Link it Up!

Add a `<script>` tag to the very end of your `<body>` in your `index.html` (or whichever HTML page you're using):

```html
<!DOCTYPE html>
<html lang="en">
<head>
</head>
<body>
    <script src="path/to/your/EmpowerUI.js"></script>
</body>
</html>
```

### 3. Initialize the Magic!

Make sure you have a button or element that you want to use to toggle the colorblind mode. Give it a unique id (e.g., `id="colorblindToggle"`).

Then, in your own script (or within a `<script>` block in your HTML after EmpowerUI.js is loaded), simply call:

```js
document.addEventListener('DOMContentLoaded', () => {
    // Tell EmpowerUI which button to use and which CSS variables to transform!
    // If you're using the demo's `--ui-` prefixed variables, you don't need the second argument.
    // Otherwise, list your own CSS variable names here!
    EmpowerUI.initColorblindToggle('colorblindToggle', [
        '--my-custom-primary-color',
        '--my-custom-secondary-color',
        // ... and so on!
    ]);
});
```

---

## 💖 See it in Action!

Want to see EmpowerUI doing its thing live? Check out the index.html file in this repository. Just open it in your browser (you might need a simple local server like http-server for the JavaScript to work properly) and click the "Toggle Colorblind Mode" button!

---

## 🗺️ Roadmap

- **More Colorblindness Types:** Adding Protanopia, Tritanopia, and Monochromacy transformations.
- **Contrast Adjustments:** Easy toggles for high-contrast modes.
- **Font Readability Enhancements:** Options for dyslexia-friendly fonts, text spacing, and size.
- **Reduced Motion Options:** Giving users control over animations.
- **And so much more!** The sky's the limit for making the web truly accessible!

---

## 💌 Connect with Me!

Got questions, ideas, or just want to spread some love? Feel free to open an issue or connect with me!


---