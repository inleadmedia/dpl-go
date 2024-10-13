import { defaultSession, getClient, getSession, clientConfig } from "@/lib";
import { generators } from "openid-client";

// TODO: This is a code block copy/pasted from an online article. Make it real yo.
export async function GET() {
  const session = await getSession();
  const client = await getClient();
  const endSession = client.endSessionUrl({
    post_logout_redirect_uri: clientConfig.post_logout_redirect_uri,
    id_token_hint: session.access_token,
    state: generators.state()
  });
  session.isLoggedIn = defaultSession.isLoggedIn;
  session.access_token = defaultSession.access_token;
  session.userInfo = defaultSession.userInfo;
  await session.save();
  return Response.redirect(endSession);
}
