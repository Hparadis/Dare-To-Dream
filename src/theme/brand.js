// src/theme/brand.js
//
// One color, one place. Every component in the chat feature imports these
// instead of hardcoding a hex value — change BRAND_COLOR here and the
// whole flow updates (buttons, borders, active states, etc).

export const BRAND_COLOR = "#92b6f0";

// A dark, same-hue-family shade for text/icons that sit ON TOP of a solid
// BRAND_COLOR fill (e.g. button labels) — #92b6f0 is too light for white
// text to read well against it.
export const BRAND_COLOR_TEXT_ON = "#12233d";

// Soft tints for backgrounds/chips/borders where you want a hint of the
// brand color without a solid fill.
export const BRAND_COLOR_SOFT = "rgba(146, 182, 240, 0.14)";
export const BRAND_COLOR_GLOW = "rgba(146, 182, 240, 0.35)";
