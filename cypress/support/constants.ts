export const cyKeys = {
  "go-logo": "go-logo",
  "search-input": "search-input",
  "work-card": "work-card",
  "filters-button": "filters-button",
  "filter-button": "filter-button",
  "profile-button": "profile-button",
  "global-sheet": "global-sheet",
} as const

export type CyKey = keyof typeof cyKeys
