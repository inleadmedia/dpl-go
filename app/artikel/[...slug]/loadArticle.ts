import { unstable_cacheTag as cacheTag } from "next/cache"

import getQueryClient from "@/lib/getQueryClient"
import {
  GetArticleByPathQuery,
  useGetArticleByPathQuery,
} from "@/lib/graphql/generated/dpl-cms/graphql"
import { getContentQueryPath } from "@/lib/helpers/dpl-cms-content"

const loadArticle = async (contentPath: string) => {
  // "use cache"
  const queryClient = getQueryClient()
  const path = getContentQueryPath(contentPath, "article")

  const data = (await queryClient.fetchQuery<GetArticleByPathQuery>({
    queryKey: useGetArticleByPathQuery.getKey({ path }),
    queryFn: useGetArticleByPathQuery.fetcher({ path }),
  })) as GetArticleByPathQuery & { go: { cacheTags: string } }

  // cacheTag(data.go.cacheTags)
  return data
}

export default loadArticle
