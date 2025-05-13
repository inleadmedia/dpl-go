import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { Metadata } from "next"
import { headers } from "next/headers"
import { Suspense } from "react"

import SearchPageLayout from "@/components/pages/searchPageLayout/SearchPageLayout"
import getQueryClient from "@/lib/getQueryClient"
import { setPageMetadata } from "@/lib/helpers/helper.metadata"

import { prefetchSearchFacets, prefetchSearchResult } from "./fetchSearchResult.server"

export const metadata: Metadata = setPageMetadata("Find materialer")

const SearchPage = async ({ searchParams }: { searchParams: Promise<{ q: string }> }) => {
  const { q } = await searchParams
  const headersList = await headers()

  const queryClient = getQueryClient()
  prefetchSearchResult(q, queryClient, headersList)
  prefetchSearchFacets(q, queryClient, headersList)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SearchPageLayout />
    </HydrationBoundary>
  )
}

const Page = async ({ searchParams }: { searchParams: Promise<{ q: string }> }) => {
  return (
    <Suspense>
      <SearchPage searchParams={searchParams} />
    </Suspense>
  )
}

export default Page
