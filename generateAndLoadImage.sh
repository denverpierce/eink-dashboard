#!/usr/bin/env bash

set -xeu
set -o pipefail

export PYTHONPATH='/home/dash/.nvm/versions/node/v18.14.0/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/local/games:/usr/games:/home/dash/12.48inch-e-paper/RaspberryPi/python/lib'

npm run generateImage
python3 /home/dash/waveshare-12.48inch-3-color-e-ink/display.py -i /home/dash/eink-dashboard/output/generated_image.png