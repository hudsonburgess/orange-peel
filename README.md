# orange-peel

UNIFNISHED -- this package and the following instructions are still WIP.

An end-to-end testing framework utilizing Selenium Webdriver

A demo of this package can be found [here](https://github.com/hudsonburgess/orange-peel-demo)

## Setup

`npm run setup` will generate a minimal default config file (does nothing at the moment...)

### Running locally

For each browser you intend to test with, be sure to download the appropriate webdriver.
- [Chrome](https://sites.google.com/a/chromium.org/chromedriver/downloads)
- [Firefox](https://github.com/mozilla/geckodriver/releases)

If testing with IE, follow the instructions listed [here](https://github.com/SeleniumHQ/selenium/wiki/InternetExplorerDriver).

Make sure each webdriver is in your `PATH`.

### Running remotely

Make sure the remote server running your tests has the appropriate webdrivers on its `PATH` per the instructions above.

Download the Selenium Standalone Server [here](https://www.seleniumhq.org/download/) and run the jar:
`java -jar selenium-server-standalone-x.x.x.jar`

Other 3rd party browser drivers can be found [here](https://www.seleniumhq.org/download/#third-party-browser-drivers) under the heading "Third Party Drivers, Bindings, and Plugins."

### Installing orange-peel

In your project, simply `npm i orange-peel --save-dev`

## Usage

Simple test in [Jasmine](https://www.npmjs.com/package/jasmine) to ensure the app is running:

```ts
import { Browser, BrowserType } from 'orange-peel';

describe('Orange Peel demo', () => {

    let driver: Browser;

    beforeAll(() => {
        driver = new Browser(BrowserType.CHROME);               // create a browser instance for the given type
    });

    afterAll(() => {
        driver.quit();                                          // close the browser once tests are finished
    });


    it('should get the title from the home page', done => {
        driver.get('http://localhost:4200')                     // navigate to the given URL
            .then(() => {
                expect(true).toBeTruthy()
                done();
            });
    }, 60000);                                                  // ensure long timeout since tests might
                                                                // give up before the browser loads

});
```

### Configuration

TBD...
