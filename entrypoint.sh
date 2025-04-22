#!/bin/sh

envsubst < /usr/share/nginx/html/config.template.js > /usr/share/nginx/html/config.js

exec "$@"
