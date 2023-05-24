#!/usr/bin/env bash

set -xeu
set -o pipefail

cd /home/dash/eink-dashboard

npm run generateImage
cd /home/dash/waveshare-12.48inch-3-color-e-ink/
/usr/bin/python3 display.py -i /home/dash/eink-dashboard/output/generated_image.png
