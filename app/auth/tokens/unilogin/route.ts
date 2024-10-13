import {
  GetUniloginTokensQuery,
  useGetUniloginTokensQuery
} from "@/lib/generated/graphql/dpl-cms/graphql";
import getQueryClient from "@/lib/getQueryClient";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const queryClient = getQueryClient();
  const query = useGetUniloginTokensQuery;

  try {
    const {
      dplTokens: { unilogin: tokens }
    } = await queryClient.fetchQuery<GetUniloginTokensQuery>({
      queryKey: query.getKey(),
      queryFn: query.fetcher()
    });
    if (!tokens) {
      return NextResponse.json(
        { error: "No unilogin tokens found" },
        { status: 404 }
      );
    }
    return NextResponse.json(tokens);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
