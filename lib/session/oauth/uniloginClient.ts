import * as client from "openid-client"

import { getDplCmsUniloginConfig } from "@/lib/config/dpl-cms/dplCmsConfig"
import goConfig from "@/lib/config/goConfig"

export const uniloginClientSettings = {
  post_login_route: `${goConfig("app.url")}/user/profile`,
}

export async function getUniloginClientConfig() {
  const { wellknownUrl, clientId, clientSecret, apiData } = await getDplCmsUniloginConfig()

  let isMissingConfiguration = false
  // We need all of these to be able to continue.
  if (!wellknownUrl) {
    console.error("Missing wellknownUrl for Unilogin client")
    isMissingConfiguration = true
  }
  if (!clientId) {
    console.error("Missing clientId for Unilogin client")
    isMissingConfiguration = true
  }
  if (!clientSecret) {
    console.error("Missing clientSecret for Unilogin client")
    isMissingConfiguration = true
  }

  if (isMissingConfiguration) {
    return null
  }

  return await client.discovery(
    new URL(String(wellknownUrl)),
    clientId as string,
    clientSecret as string
  )
}
