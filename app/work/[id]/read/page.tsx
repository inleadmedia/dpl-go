"use client"

import { notFound, useSearchParams } from "next/navigation"
import React, { Suspense } from "react"

import Reader from "@/components/shared/publizonReader/PublizonReader"

function WorkPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const orderId = searchParams.get("orderId")

  const handleBack = () => {
    window.history.back()
  }

  if (!id && !orderId) {
    console.error("No id found in search params")
    return notFound()
  }

  return (
    <div className="absolute inset-0 h-screen w-screen">
      <div className="bg-reader-grey absolute h-full w-full"></div>

      {orderId && <Reader onBackCallback={() => handleBack()} type="loan" orderId={orderId} />}
      {id && <Reader onBackCallback={() => handleBack()} type="preview" identifier={id} />}
    </div>
  )
}

function Page() {
  return (
    <Suspense>
      <WorkPage />
    </Suspense>
  )
}

export default Page
