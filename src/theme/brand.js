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

// The full stage-1 palette: white, black, gray, blue — nothing else.
// Every new component should pull from here instead of a fresh hex value.
export const BRAND_WHITE = "#ffffff";
export const BRAND_BLACK = "#0b0b0c";
export const BRAND_GRAY_900 = "#1a1a1a"; // page background
export const BRAND_GRAY_800 = "#232323"; // panel background (matches existing ChatOnboarding bg)
export const BRAND_GRAY_700 = "#2c2c2c"; // card / surface background
export const BRAND_GRAY_500 = "#888888"; // secondary text
export const BRAND_GRAY_300 = "#cccccc"; // primary text on dark surfaces
export const BRAND_GRAY_BORDER = "rgba(255, 255, 255, 0.12)"; // hairline borders

// Two accents, used sparingly — never as a base color, only to give specific
// moments (a word, a hover state) their own personality.
export const BRAND_PINK = "#f2a9c0"; // warmth, comfort
export const BRAND_YELLOW = "#f2c94c"; // hope, energy
