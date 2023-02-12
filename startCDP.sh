/usr/lib/chromium/chromium ----remote-debugging-address=localhost/cdp --remote-debugging-port=3333 --headless


#export CDP_URL=$(curl --silent localhost:3333/json/version | jq -r .webSocketDebuggerUrl) &

#npm start &

#npm run generateImage
