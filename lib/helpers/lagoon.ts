export const getLagoonUrl = (type: "nginx" | "varnish" | "node") => {
  const routes = process.env.NEXT_PUBLIC_LAGOON_ROUTES?.split(",") ?? []
  for (const route of routes) {
    if (route.includes(type)) {
      return route
    }
  }
}
