import { cacheTag } from "next/dist/server/use-cache/cache-tag"

import { fetcher } from "@/lib/graphql/fetchers/dpl-cms.fetcher"
import {
  GetArticleByRouteDocument,
  GetArticleByRouteQuery,
} from "@/lib/graphql/generated/dpl-cms/graphql"

// import { unstable_cache } from "next/cache";

const loadArticle = async (path: string) => {
  // "use cache"
  // const queryClient = getQueryClient()
  // Make sure that we do not use stale data
  // since we are using cacheTags for invalidation.
  // queryClient.setDefaultOptions({ queries: { staleTime: 0 } })
  // const result = await queryClient.fetchQuery({
  //   queryKey: useGetArticleByRouteQuery.getKey({ path }),
  //   queryFn: useGetArticleByRouteQuery.fetcher({ path }),
  // })
  // const data: GetArticleByRouteQuery = result.data
  // const getArticle = unstable_cache(
  //   async (path: string) =>fetcher<GetArticleByRouteQuery, { path: string }>(
  //     GetArticleByRouteDocument,
  //     { path }
  //   )(),
  //   ['my-app-user']
  // );

  const result = await fetcher<GetArticleByRouteQuery, { path: string }>(
    GetArticleByRouteDocument,
    { path }
  )()

  const data: GetArticleByRouteQuery = result.data

  cacheTag("abe")
  return data
}

export default loadArticle
