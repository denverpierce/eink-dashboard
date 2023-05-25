# eink-dashboard

## Requires

- node 18/npm w/e

sudo npx playwright install-deps
npx playwright install chrome

### Assorted Setup

bash

```
npx playwright install
npx playwright install-deps
curl 'https://master.dl.sourceforge.net/project/libjpeg-turbo/2.1.5.1/libjpeg-turbo-official_2.1.5.1_arm64.deb?viasf=1' > libjpg.deb
sudo dpkg -i libjpg.deb
curl 'https://launchpadlibrarian.net/469395255/libicu66_66.1-2ubuntu2_arm64.deb' > icu.deb
sudo dpkg -i icu.deb
sudo apt install chromium
npm install pm2 -g
pm2 startup
```
