import { Metadata } from "next"
import { Suspense } from "react"

import ProfilePageLayout from "@/app/user/profile/ProfilePageLayout"
import { setPageMetadata } from "@/lib/helpers/helper.metadata"

export const metadata: Metadata = setPageMetadata("Din profil")

const ProfilePage = async () => {
  return <ProfilePageLayout />
}

const Page = async () => {
  return (
    <Suspense>
      <ProfilePage />
    </Suspense>
  )
}

export default Page
