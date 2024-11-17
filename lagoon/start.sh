#!/bin/sh

# if [ $LAGOON_ENVIRONMENT_TYPE == "production" ]; then
# 	cd /app
# 	npm run start
# else
# 	cd /app
# 	npm run dev
# fi

cd /app
# TODO: Remember to adjust the following line before deploying to production.
# Using `yarn start:with-server-source-maps` is probably adding a performance overhead.
yarn build && yarn start:with-server-source-maps

# Debug
id
ls -lah .next

# Source maps seems to cause permission issues in the Lagoon environment right now.
# Need to investigate further.
# yarn build && yarn start
exit 0;
