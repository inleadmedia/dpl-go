import { NextRequest } from "next/server"
import * as client from "openid-client"

import goConfig from "@/lib/config/config"
import { getUniloginClientConfig } from "@/lib/session/oauth/uniloginClient"
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
  const currentSearchParams = request.nextUrl.searchParams
  const appUrl = goConfig("app.url")
  const redirectUri = new URL(`${appUrl}/auth/callback/unilogin`)
  currentSearchParams.forEach((value, key) => {
    redirectUri.searchParams.append(key, value)
  })

  // eslint-disable-next-line no-console
  console.log("redirectUri: ", redirectUri)
  // Debugging Oauth requests.
  // TODO: Remove this later.
  // const logRequest = (request: Request) => {
  //   // eslint-disable-next-line no-console
  //   console.log("Request URL: ", request.url.toString())
  //   // eslint-disable-next-line no-console
  //   console.log("Request Method: ", request.method)
  //   // eslint-disable-next-line no-console
  //   console.log("Request Body: ", request)
  //   // eslint-disable-next-line no-console
  //   console.log("-".repeat(100))
  // }

  // onfig[client.customFetch] = (...args) =>
  //   ky(args[0], {
  //     ...args[1],
  //     hooks: {
  //       beforeRequest: [
  //         request => {
  //           logRequest(request)
  //         },
  //       ],
  //     },
  //   })
  config[client.customFetch] = async (url: string, options: RequestInit) => {
    // eslint-disable-next-line no-console
    console.log("Request URL: ", url.toString())
    // eslint-disable-next-line no-console
    console.log("Request Options: ", options)

    const request = new Request(url, options)
    return fetch(request)
  }

  // Fetch all user/token info.
  try {
    const tokenSetResponse = await client.authorizationCodeGrant(config, redirectUri, {
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
    // session.isLoggedIn = true
    // session.type = "unilogin"

    // eslint-disable-next-line no-console
    console.log("Debug line 88")

    // Set token info.
    // setTokensOnSession(session, tokenSet)

    // eslint-disable-next-line no-console
    console.log("Debug line 94")

    // Set user info.
    // session.userInfo = {
    //   sub: userinfo.sub,
    //   uniid: introspect.uniid,
    //   institutionIds: introspect.institutionIds,
    // }

    // eslint-disable-next-line no-console
    console.log("Debug line 104")

    // await session.save()

    // eslint-disable-next-line no-console
    console.log("Debug line 109")

    // return NextResponse.redirect(`${goConfig("app.url")}/user/profile`)
  } catch (error) {
    console.error(error)
    // TODO: Error page or redirect to login page.
    // return NextResponse.redirect(goConfig("app.url"))
  }
  // eslint-disable-next-line no-console
  console.log("Debug line 118")
  return Response.redirect(goConfig("app.url"))
}
