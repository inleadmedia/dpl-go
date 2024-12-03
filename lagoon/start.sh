#!/bin/sh

# if [ $LAGOON_ENVIRONMENT_TYPE == "production" ]; then
# 	cd /app
# 	npm run start
# else
# 	cd /app
# 	npm run dev
# fi

source /app/lagoon/set-env-variables.sh

echo "07:06"

cd /app
# TODO: Remember to adjust the following line before deploying to production.
# Using `yarn start:with-server-source-maps` is probably adding a performance overhead.
yarn build && yarn start:with-server-source-maps
exit 0;
