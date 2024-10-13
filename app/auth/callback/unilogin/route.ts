import {
  uniloginClientConfig,
  getUniloginClient
} from "@/lib/session/oauth/uniloginClient";
import { getSession } from "@/lib/session/session";
import { IncomingMessage } from "http";
import { IntrospectionResponse } from "openid-client";

export interface TIntrospectionResponse extends IntrospectionResponse {
  uniid: string;
  institutionIds: string;
}

export async function GET(request: IncomingMessage) {
  const session = await getSession();
  const client = await getUniloginClient();
  const params = client.callbackParams(request);

  try {
    const tokenSet = await client.callback(
      uniloginClientConfig.redirect_uri,
      params,
      {
        code_verifier: session.code_verifier
      }
    );
    session.isLoggedIn = true;
    session.access_token = tokenSet.access_token;
    session.refresh_token = tokenSet.refresh_token;

    const introspect = (await client.introspect(
      tokenSet.access_token!
    )) as TIntrospectionResponse;
    const userinfo = await client.userinfo(tokenSet);

    session.userInfo = {
      sub: userinfo.sub,
      uniid: introspect.uniid,
      institutionIds: introspect.institutionIds
    };

    await session.save();

    return Response.redirect(uniloginClientConfig.post_login_route);
  } catch (error) {
    console.error(error);
    // TODO: Error page or redirect to login page.
    return Response.redirect("/");
  }
}
