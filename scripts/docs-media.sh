#!/bin/sh
# Regenerates the README media in readme-img/ from the demo data, in the
# Playwright Linux image (Docker required):
#   1. ui-tests/docs-media.spec.js takes the screenshots and records the clip
#      into readme-img/src/ (not committed).
#   2. ffmpeg turns them into WebP screenshots and hero.gif for the README,
#      plus readme-img/src/hero.mp4 (not committed) for LinkedIn or a GitHub
#      upload. The clip's typing plays fast (scripts/hero-filter.mjs).
set -e

rm -rf readme-img/src
DOCS_MEDIA=1 sh scripts/ui-tests-docker.sh --project=docs-media

VERSION=$(node -p "require('@playwright/test/package.json').version")
docker run --rm -v "$PWD":/work -w /work/readme-img \
  "mcr.microsoft.com/playwright:v${VERSION}-noble" \
  sh -c '
    apt-get update -qq >/dev/null
    DEBIAN_FRONTEND=noninteractive apt-get install -y -qq ffmpeg >/dev/null
    for png in src/*.png; do
      name=$(basename "$png" .png)
      ffmpeg -y -loglevel error -i "$png" \
        -vf "scale=min(iw\,1600):-2" -c:v libwebp -quality 88 "$name.webp"
    done
    # Trim the blank start and speed up the typing (see hero-timeline.json).
    cut=$(node ../scripts/hero-filter.mjs src/hero-timeline.json)
    ffmpeg -y -loglevel error -i src/hero.webm \
      -filter_complex "$cut;[cut]fps=30,scale=1280:-2[out]" -map "[out]" \
      -c:v libx264 -crf 20 -pix_fmt yuv420p -movflags +faststart src/hero.mp4
    ffmpeg -y -loglevel error -i src/hero.webm \
      -filter_complex "$cut;[cut]fps=10,scale=800:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=64:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle" \
      hero.gif
  '
ls -l readme-img
