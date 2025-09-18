import { loadEnvConfig } from "@next/env"
import { defineConfig } from "cypress"

import { ViewportType, viewports } from "./cypress/support/constants"
import { e2eNodeEvents } from "./cypress/support/setupNodeEvents/index"

// Load environment variables from .env.test
const { combinedEnv } = loadEnvConfig(process.cwd(), true)

export default defineConfig({
  e2e: {
    baseUrl: combinedEnv.NEXT_PUBLIC_APP_URL,
    // Increase timeouts for better test resilience
    defaultCommandTimeout: 15000, // Default: 4000ms
    requestTimeout: 10000, // Default: 5000ms
    pageLoadTimeout: 90000, // Default: 60000ms
    setupNodeEvents(on, config) {
      config.env = {
        ...combinedEnv,
        ...config.env,
      }

      // Get the viewport from the command line or default to mobile
      const viewport = (config.env.viewport as ViewportType) || "desktop"
      const viewportConfig = viewports[viewport]

      // Set the viewport for this run
      config.viewportWidth = viewportConfig.width
      config.viewportHeight = viewportConfig.height

      return e2eNodeEvents?.(on, config) ?? config
    },
    experimentalInteractiveRunEvents: true,
  },
})
