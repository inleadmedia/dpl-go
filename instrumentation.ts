import { QueryClient } from "@tanstack/react-query"

import { ensureDplCmsConfig } from "./lib/config/dpl-cms/dplCmsConfig"

export async function register() {
  const queryClient = new QueryClient({})
  ensureDplCmsConfig(queryClient)
}
