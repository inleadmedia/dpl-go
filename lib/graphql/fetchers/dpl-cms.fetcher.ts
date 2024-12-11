export function fetcher<TData, TVariables>(
  query: string,
  variables?: TVariables,
  options?: RequestInit | RequestInit["headers"]
) {
  const dplCmsGraphqlEndpoint = process.env.NEXT_PUBLIC_GRAPHQL_SCHEMA_ENDPOINT_DPL_CMS
  const dplCmsGraphqlBasicToken = process.env.NEXT_PUBLIC_GRAPHQL_BASIC_TOKEN_DPL_CMS

  if (!dplCmsGraphqlEndpoint || !dplCmsGraphqlBasicToken) {
    throw new Error("Missing DPL CMS GraphQL endpoint or basic token")
  }

  return async (): Promise<{ data: TData; headers: Headers }> => {
    // eslint-disable-next-line no-console
    console.log("I am fetching dpl cms data")
    const res = await fetch(dplCmsGraphqlEndpoint, {
      method: "POST",
      ...{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${dplCmsGraphqlBasicToken}`,
        },
        ...options,
      },
      body: JSON.stringify({ query, variables }),
    })

    const json = await res.json()

    if (json.errors) {
      const { message } = json.errors[0]

      throw new Error(message)
    }

    const responseHeaders = res.headers

    return { data: json.data, headers: responseHeaders }
  }
}
