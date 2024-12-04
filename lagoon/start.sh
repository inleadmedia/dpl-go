#!/bin/sh

# if [ $LAGOON_ENVIRONMENT_TYPE == "production" ]; then
# 	cd /app
# 	npm run start
# else
# 	cd /app
# 	npm run dev
# fi

# source /app/lagoon/set-env-variables.sh



getLagoonUrl() {
    local type=$1
    IFS=',' read -r -a routes <<< "$LAGOON_ROUTES"
    for route in "${routes[@]}"; do
      if [[ $route == *"$type"* ]]; then
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
if [ -z "$cms_url" ]; then
  echo "Error: Unable to determine CMS URL"
  exit 1
fi


export NEXT_PUBLIC_APP_URL="$app_url"
export NEXT_PUBLIC_GRAPHQL_SCHEMA_ENDPOINT_DPL_CMS="$cms_url/graphql"


echo "09:14"

cd /app
# TODO: Remember to adjust the following line before deploying to production.
# Using `yarn start:with-server-source-maps` is probably adding a performance overhead.
yarn build && yarn start:with-server-source-maps
exit 0;
