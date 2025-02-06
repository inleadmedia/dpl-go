"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { MouseEvent } from "react"

import { resolveUrl } from "@/lib/helpers/helper.routes"
import useSearchMachineActor from "@/lib/machines/search/useSearchMachineActor"

const InfoBoxSearchLink = ({
  q,
  title,
  className,
}: {
  q: string
  title: string
  className?: string
}) => {
  const router = useRouter()
  const actor = useSearchMachineActor()

  const searchAndNavigate = (query: string) => {
    const url = resolveUrl({
      routeParams: { search: "search" },
      queryParams: { q: query },
    })

    actor.send({ type: "TYPING", q: query })
    actor.send({ type: "SEARCH" })
    router.push(url)
  }

  const searchOnClick = (query: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    searchAndNavigate(query)
  }

  return (
    <Link
      className={className}
      onClick={searchOnClick(title)}
      href={resolveUrl({
        routeParams: { search: "search" },
        queryParams: { q },
      })}>
      {title}
    </Link>
  )
}

export default InfoBoxSearchLink
