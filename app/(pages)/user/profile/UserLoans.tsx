"use client"

import React from "react"

import LoanSlider, { LoanSliderSkeleton } from "@/app/(pages)/user/profile/LoanSlider"
import {
  filterManifestationsByEdition,
  filterManifestationsByMaterialType,
  filterMaterialTypes,
} from "@/components/pages/workPageLayout/helper"
import {
  ManifestationSearchPageTeaserFragment,
  WorkTeaserSearchPageFragment,
  useComplexSearchForWorkTeaserQuery,
} from "@/lib/graphql/generated/fbi/graphql"
import { cn } from "@/lib/helpers/helper.cn"
import useGetV1UserLoans from "@/lib/rest/publizon/useGetV1UserLoans"

export type UserLoansProps = {
  className?: string
}

const UserLoans = ({ className }: UserLoansProps) => {
  const { data: dataLoans, isLoading: isLoadingLoans } = useGetV1UserLoans()
  const userIsbns =
    dataLoans?.loans?.map(loan => loan?.libraryBook?.identifier ?? "").filter(Boolean) || []
  const cql = userIsbns.map(isbn => `term.isbn=${isbn}`).join(" OR ") || ""

  const { data: dataComplexSearch, isLoading: isLoadingComplexSearch } =
    useComplexSearchForWorkTeaserQuery(
      {
        cql,
        offset: 0,
        limit: 100,
        filters: {},
      },
      { enabled: userIsbns.length > 0 }
    )

  // Create an array of works with the matching manifestation inside, out of the LOAN ISBNS
  // instead of ComplexSearch data so that we have exactly one manifestation per loan
  const loanWorks: WorkTeaserSearchPageFragment[] = userIsbns.reduce<
    WorkTeaserSearchPageFragment[]
  >((isbnAcc, isbn) => {
    // Find the work that contains the matching ISBN inside one of its manifestations
    const loanWork = dataComplexSearch?.complexSearch.works.find(work => {
      return work.manifestations.all.some(manifestation =>
        manifestation.identifiers.some(identifier => identifier.value === isbn)
      )
    })
    // Skip if no matching work is found
    if (!loanWork) {
      return isbnAcc
    }
    // Filter the all manifestations to only include those allowed
    const filteredManifestations = filterManifestationsByEdition(
      filterManifestationsByMaterialType(filterMaterialTypes(loanWork.manifestations.all))
    )
    // Find the specific manifestation inside the found work
    const loanManifestation: ManifestationSearchPageTeaserFragment | undefined =
      filteredManifestations.find(manifestation =>
        manifestation.identifiers.some(identifier => identifier.value === isbn)
      )
    // Skip if no matching manifestation is found
    if (!loanManifestation) {
      return isbnAcc
    }
    // Create a new work object with only the matching manifestation
    const workWithSingleManifestation: WorkTeaserSearchPageFragment = {
      ...loanWork,
      manifestations: { all: [loanManifestation], bestRepresentation: loanManifestation },
    }
    return [...isbnAcc, workWithSingleManifestation]
  }, [])

  return (
    <div className={cn("col-span-full", className)}>
      {(isLoadingLoans || isLoadingComplexSearch) && <LoanSliderSkeleton />}
      {!isLoadingLoans && !isLoadingComplexSearch && loanWorks && dataLoans && (
        <LoanSlider works={loanWorks} loanData={dataLoans} />
      )}
    </div>
  )
}

export default UserLoans
