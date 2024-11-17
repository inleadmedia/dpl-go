import { NextRequest } from "next/server"
import * as client from "openid-client"

import goConfig from "@/lib/config/config"
import { getUniloginClientConfig, uniloginClientSettings } from "@/lib/session/oauth/uniloginClient"
import { getSession, setTokensOnSession } from "@/lib/session/session"
import { TTokenSet } from "@/lib/types/session"

import schemas from "./schemas"

export interface TIntrospectionResponse extends client.IntrospectionResponse {
  uniid: string
  institutionIds: string
}

export async function GET(request: NextRequest) {
  const session = await getSession()
  const config = await getUniloginClientConfig()
  const currentUrl = new URL(request.nextUrl.href)

  // eslint-disable-next-line no-console
  console.log("currentUrl URL: ", currentUrl)
  // Fetch all user/token info.
  try {
    const tokenSetResponse = await client.authorizationCodeGrant(config, currentUrl, {
      pkceCodeVerifier: session.code_verifier,
      idTokenExpected: true,
    })

    const tokenSet = schemas.tokenSet.parse(tokenSetResponse) as TTokenSet

    const introspectResponse = (await client.tokenIntrospection(
      config,
      tokenSet.access_token!
    )) as TIntrospectionResponse
    const introspect = schemas.introspect.parse(introspectResponse)

    const claims = tokenSetResponse.claims()!

    // UserInfo Request
    const userInfoResponse = await client.fetchUserInfo(config, tokenSet.access_token, claims.sub)
    const userinfo = schemas.userInfo.parse(userInfoResponse)

    // Set basic session info.
    session.isLoggedIn = true
    session.type = "unilogin"

    // Set token info.
    setTokensOnSession(session, tokenSet)

    // Set user info.
    session.userInfo = {
      sub: userinfo.sub,
      uniid: introspect.uniid,
      institutionIds: introspect.institutionIds,
    }

    await session.save()

    return Response.redirect(uniloginClientSettings.post_login_route)
  } catch (error) {
    console.error(error)
    // TODO: Error page or redirect to login page.
    return Response.redirect(goConfig("app.url"))
  }
}
