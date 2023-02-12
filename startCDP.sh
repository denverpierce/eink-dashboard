#!/usr/bin/env bash

set -xeu
set -o pipefail

/usr/lib/chromium/chromium ----remote-debugging-address=localhost/cdp --remote-debugging-port=3333 --headless
