import { getLagoonUrl } from "@/lib/helpers/lagoon"

const app = {
  "app.url": () => {
    if (process.env.NEXT_PUBLIC_APP_URL) {
      return process.env.NEXT_PUBLIC_APP_URL
    }
    if (process.env.NEXT_PUBLIC_LAGOON_ROUTES) {
      return getLagoonUrl("node")
    }
  },
}

export default app
