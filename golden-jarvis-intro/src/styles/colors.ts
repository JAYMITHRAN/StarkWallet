/**
 * Centralized theme tokens for the "Retro White + Golden Jarvis" intro sequence.
 * Keep every color used across the flow defined here so the palette stays
 * consistent and easy to re-skin.
 */
export const colors = {
  // Base
  bgDark: "#121212",
  bgDarkElevated: "#1A1A1A",

  // Golden family (Jarvis accent)
  gold: "#FFD700",
  goldDark: "#B8860B",
  goldSoft: "#E6C200",

  // Retro cream / white family
  cream: "#F5F5DC",
  retroWhite: "#FDFDF6",

  // Utility
  shadowDeep: "rgba(0, 0, 0, 0.6)",
  glowGold: "rgba(255, 215, 0, 0.55)",
  glassStroke: "rgba(245, 245, 220, 0.25)",
} as const;

export type ThemeColors = typeof colors;
