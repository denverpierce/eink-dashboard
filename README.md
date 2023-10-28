# YAED eink-dashboard

## Desciption

Yet another e-ink dashboard, this time made to run on a entirely on a raspberry pi, rendering to a Waveshare 12.48 inch e-ink display.

## Setup

Initial setup of this display is reasonably complicated, as everything is intended to run directly on the raspberry pi, and not rely on any remote cloud services, other than the [https://app.tomorrow.io/](tomorrow.io) api. However, most of the major dependecies only need to be installed once, and updates to the display the comparitevly simple updates of the frontend application.

The high level requirements are:

- The Waveshare libraries for this specific monitor [https://github.com/waveshare/12.48inch-e-paper.git](https://github.com/waveshare/12.48inch-e-paper.git)
  - This is needed to render images to the monitor. There are other libraries for this, but it does the job. This libary itself has some other system dependcies that it requires, along with python 3.x
- lourentius's wave image renderer [https://github.com/louwrentius/waveshare-12.48inch-3-color-e-ink](https://github.com/louwrentius/waveshare-12.48inch-3-color-e-ink)
  - Used along with the waveshare libs to render images to the display
- Playwright [https://github.com/microsoft/playwright](https://github.com/microsoft/playwright)
  - Probably overkill, but this is used to render the generated webpage to an image
- Frontend dependencies
  - htmx, highcharts, and other libs to fetch the api and render it to html
- pm2
  - Used to keep the local webserver running through restarts
- cron
  - Used to call `generateAndLoadImage.sh` daily to refresh the page

More complete shell installation commands can be found below.

## Development

1. Install node 18 or with `nvm` run `nvm install` followed by `nvm use`
2. Install dependencies with `npm clean-install`
3. In your termnial envionrment, export your [https://app.tomorrow.io/](tomorrow.io) token to the `TOM_TOKEN` via `export TOM_TOKEN='blah'`
4. Run `npm start`, which should serve the application on [http://localhost:3000](http://localhost:3000)

## Configuration

Application configuration is currently only provided via the `/` root route's `dataFetchConfig` object in `src/render/main.ts`. I consider this sufficent as I am the only application user.

## Detailed Setup

These docs presume you already have node 18 and git installed, as well as a rpi connected to a waveshare device. The renderer for this project presumes the waveshare is a 12.48 inche size, but it could be easily modified to fit another size.

```bash
# Enable the rpi SPI interface (used to connect to the waveshare display)
sudo raspi-config
# In the rpi config menu, choose Interfacing Options -> SPI -> Yes.
sudo reboot

# Install BCM2835 (required for the SPI connection)
wget http://www.airspayce.com/mikem/bcm2835/bcm2835-1.71.tar.gz
tar zxvf bcm2835-1.71.tar.gz
cd bcm2835-1.71/
sudo ./configure && sudo make && sudo make check && sudo make install

# Install WiringPi
git clone https://github.com/WiringPi/WiringPi
cd WiringPi
./build
# Run gpio -v and version 2.60 will appear. If it does not appear, it means that there is an installation error
gpio -v

# Get the Waveshare display libaries
git clone https://github.com/waveshare/12.48inch-e-paper.git

# Get lowrentis waveshare imager
git clone git@github.com:louwrentius/waveshare-12.48inch-3-color-e-ink.git

# playwright installs it's own copy of chromium for rendering
npx playwright install
npx playwright install-deps

# Install image magic (used by lowrentis to convert images)
sudo apt install imagemagick

# lourentius or imagemagick relies on libjpeg turbo and libicu
curl 'https://master.dl.sourceforge.net/project/libjpeg-turbo/2.1.5.1/libjpeg-turbo-official_2.1.5.1_arm64.deb?viasf=1' > libjpg.deb
sudo dpkg -i libjpg.deb
curl 'https://launchpadlibrarian.net/469395255/libicu66_66.1-2ubuntu2_arm64.deb' > icu.deb
sudo dpkg -i icu.deb

# pm2 to keep the webserver up hosting the images
npm install pm2 -g
pm2 start npm run start
pm2 save
pm2 startup

# crontab the image generator and image loading to the display
# I prefer updating every 6 hours, as the display updates can be fairly slow
# 0 */6 * * * /home/dash/eink-dashboard/generateAndLoadImage.sh >/dev/null 2>&1
```
