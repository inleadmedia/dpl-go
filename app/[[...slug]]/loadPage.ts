import { unstable_cacheTag as cacheTag } from "next/cache"

import getQueryClient from "@/lib/getQueryClient"
import { GetPageByPathQuery, useGetPageByPathQuery } from "@/lib/graphql/generated/dpl-cms/graphql"
import { getContentQueryPath } from "@/lib/helpers/dpl-cms-content"

const loadPage = async (contentPath: string) => {
  "use cache"
  const queryClient = getQueryClient()
  const path = getContentQueryPath(contentPath, "page")

  const {
    go: { cacheTags },
    ...data
  } = await queryClient.fetchQuery<GetPageByPathQuery>({
    queryKey: useGetPageByPathQuery.getKey({ path }),
    queryFn: useGetPageByPathQuery.fetcher({ path }),
  })

  if (cacheTags) {
    console.log("Storing cacheTags:", cacheTags)
    cacheTag(...cacheTags)
  }

  return data
}

export default loadPage
