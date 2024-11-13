import { cookies } from "next/headers"
import * as client from "openid-client"

import goConfig from "@/lib/config/config"
import app from "@/lib/config/resolvers/app"
import { getUniloginClientConfig } from "@/lib/session/oauth/uniloginClient"
import { getSession } from "@/lib/session/session"

export async function GET() {
  const session = await getSession()
  const config = await getUniloginClientConfig()
  const appUrl = new URL(goConfig("app.url"))

  session.destroy()

  // TODO: Distinguish between session types here.
  const id_token = cookies().get("go-session:id_token")?.value
  // TODO: Is this where we want to redirect to if id token cannot be resolved?
  if (!id_token) {
    return Response.redirect(goConfig("app.url"))
  }
  const endSessionEndpoint = config.serverMetadata().end_session_endpoint

  if (!endSessionEndpoint) {
    return Response.redirect(appUrl)
  }

  const endSessionUrl = new URL(endSessionEndpoint)
  endSessionUrl.searchParams.append("post_logout_redirect_uri", appUrl.toString())
  endSessionUrl.searchParams.append("id_token_hint", id_token)

  return Response.redirect(endSessionUrl)
}
