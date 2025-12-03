#!/bin/sh

docker run --rm \
  -v "$(pwd)/certbot:/etc/letsencrypt" \
  -v "$(pwd)/certbot:/var/lib/letsencrypt" \
  -v "$(pwd)/certbot/cloudflare.ini:/cloudflare.ini:ro" \
  certbot/dns-cloudflare \
  renew \
  --dns-cloudflare-credentials /cloudflare.ini \
  --quiet