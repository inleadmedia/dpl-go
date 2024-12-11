import { connection } from "next/server"

import { fetcher } from "@/lib/graphql/fetchers/dpl-cms.fetcher"
import {
  GetDplCmsConfigurationDocument,
  GetDplCmsConfigurationQuery,
} from "@/lib/graphql/generated/dpl-cms/graphql"

// import {
//   GetDplCmsConfigurationQuery,
//   useGetDplCmsConfigurationQuery,
// } from "@/lib/graphql/generated/dpl-cms/graphql"

// eslint-disable-next-line
// const queryDplCmsConfig = async (queryClient: QueryClient) => {
//   const { dplConfiguration } = await queryClient.fetchQuery<GetDplCmsConfigurationQuery>({
//     queryKey: useGetDplCmsConfigurationQuery.getKey(),
//     queryFn: useGetDplCmsConfigurationQuery.fetcher(),
//     // Cache 5 minutes unless invalidated
//     staleTime: 5 * 60 * 1000, // 5 mins
//   })

//   return dplConfiguration ?? null
// }

// eslint-disable-next-line
// const queryDplCmsConfig = async (queryClient: QueryClient) => {
//   return null
// }

// eslint-disable-next-line prefer-const
// let dplCmsConfigClient = new QueryClient({})

const getDplCmsConfig = async () => {
  // const result = await queryDplCmsConfig(dplCmsConfigClient)
  await connection()
  const result = await fetcher<GetDplCmsConfigurationQuery, undefined>(
    GetDplCmsConfigurationDocument
  )()
  const data: GetDplCmsConfigurationQuery = result.data

  return data
}

export const getDplCmsUniloginConfig = async () => {
  const config = await getDplCmsConfig()

  // @ts-ignore
  return config?.unilogin ?? null
}
