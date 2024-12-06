# source /app/lagoon/set-env-variables.sh

getLagoonUrl() {
  local type=$1

  for route in ${LAGOON_ROUTES//,/ }; do
    if echo "$route" | grep -q "$type"; then
      echo "$route"
      return
    fi
  done
}

# Make sure app.url is set in application
app_url=$(getLagoonUrl node)
if [ -z "$app_url" ]; then
  echo "Error: Unable to determine app URL"
  exit 1
fi

# Make sure the DPL CMS graphql schema endpoint is set in application
cms_url=$(getLagoonUrl nginx)

echo "!! cms url: $cms_url"
if [ -z "$cms_url" ]; then
  echo "Error: Unable to determine CMS URL"
  exit 1
fi

export NEXT_PUBLIC_APP_URL="$app_url"
export NEXT_PUBLIC_GRAPHQL_SCHEMA_ENDPOINT_DPL_CMS="$cms_url/graphql"

printenv

echo "21:09"

cd /app || exit 1
# TODO: Remember to adjust the following line before deploying to production.
# Using `yarn start:with-server-source-maps` is probably adding a performance overhead.
yarn build && yarn start:with-server-source-maps
exit 0
