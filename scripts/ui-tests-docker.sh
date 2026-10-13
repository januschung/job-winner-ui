#!/bin/sh
# Runs the UI tests inside the Playwright Linux image that CI uses, so
# screenshots match the committed baselines. Arguments go to `playwright test`,
# e.g. `npm run test:ui:visual -- --update-snapshots`.
#
# Linux node_modules live in a Docker volume, apart from the host's, and are
# reinstalled only when package-lock.json changes.
set -e

VERSION=$(node -p "require('@playwright/test/package.json').version")
IMAGE="mcr.microsoft.com/playwright:v${VERSION}-noble"

docker run --rm --ipc=host \
  -v "$PWD":/work \
  -v job-winner-ui-linux-node-modules:/work/node_modules \
  -w /work \
  "$IMAGE" \
  sh -c '
    lock=$(sha1sum package-lock.json | cut -d" " -f1)
    if [ "$(cat node_modules/.lock-sha 2>/dev/null)" != "$lock" ]; then
      npm ci --ignore-scripts --no-audit --no-fund
      echo "$lock" > node_modules/.lock-sha
    fi
    npx playwright test "$@"
  ' -- "$@"
