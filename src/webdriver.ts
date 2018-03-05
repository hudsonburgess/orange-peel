import * as webdriver from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
import * as firefox from 'selenium-webdriver/firefox';
import { Profile, Options, Driver } from 'selenium-webdriver/firefox';
import { Builder, WebDriver, until, WebElement, By } from 'selenium-webdriver';

export enum BrowserType { CHROME = 1, FIREFOX }

export class Browser {

    // should be in config
    private firefoxProfilePath = process.env.FIREFOX_PROFILE_PATH;
    private firefoxBinaryPath = process.env.FIREFOX_BINARY_PATH;
    private seleniumAddress = process.env.SELENIUM_ADDRESS;

    private driver: WebDriver;
    private lastUrl: string;

    constructor(browserType: BrowserType) {
        if (browserType === BrowserType.CHROME) {
            this.buildChromeDriver();
        } else {
            this.buildFirefoxDriver();
        }
    }

    private buildChromeDriver(): void {
        // if (process.env.ERDOS_ENV === 'local') {
            this.buildLocalChromeDriver();
        // } else {
            // this.buildRemoteChromeDriver();
        // }
    }

    private buildLocalChromeDriver(): void {
        // console.log('Building local chrome driver')
        this.driver = new Builder()
            .forBrowser('chrome')
            .build();
    }

    private buildRemoteChromeDriver(): void {
        // console.log('Building remote chrome driver at', this.seleniumAddress)
        this.driver = new Builder()
            .forBrowser('chrome')
            .usingServer(this.seleniumAddress)
            .build();
    }

    private buildFirefoxDriver(): void {
        // if (process.env.ERDOS_ENV === 'local') {
            this.buildLocalFirefoxDriver();
        // } else {
        //     this.buildRemoteFirefoxDriver();
        // }
    }

    private buildLocalFirefoxDriver(): void {
        const profile = this.getFirefoxProfile();
        const options = this.getFirefoxOptions(profile);
        // console.log('Building local firefox driver with profile at', this.firefoxProfilePath)
        this.driver = new Builder()
            .forBrowser('firefox')
            .setFirefoxOptions(options)
            .build();
    }

    private buildRemoteFirefoxDriver(): void {
        // console.log('Building remote firefox driver at', this.seleniumAddress)
        this.driver = new Builder()
            .forBrowser('firefox')
            .usingServer(this.seleniumAddress)
            .build();
    }

    private getFirefoxProfile(): Profile {
        const profile = new firefox.Profile(this.firefoxProfilePath);
        profile.setAcceptUntrustedCerts(true);
        profile.setAssumeUntrustedCertIssuer(true);
        profile.setPreference('security.default_personal_cert', 'Select Automatically');
        return profile;
    }

    private getFirefoxOptions(profile: Profile): Options {
        const options = new firefox.Options();
        options.setBinary(this.firefoxBinaryPath);
        options.setProfile(profile);
        return options;
    }

    public getNativeDriver(): WebDriver {
        return this.driver;
    }

    public quit(): Promise<null> {
        return new Promise((resolve, reject) => {
            this.driver.quit()
                .then(() => resolve())
                .catch((err: any) => reject(err));
        });
    }

    public get(url: string): Promise<null> {
        return new Promise((resolve, reject) => {
            this.lastUrl = url;
            this.driver.get(url)
                .then(() => resolve())
                .catch((err: any) => reject(err));
        });
    }

    public wait(untilCondition: until.Condition<boolean>, timeout: number= 100): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.driver.wait(untilCondition, timeout)
                .then((found: boolean) => {
                    return resolve(true);
                })
                .catch((error: Error) => {
                    console.log(error);
                    if (error.name.includes('TimeoutError')) { resolve(false); }
                    else { reject(error); }
                });
        });
    }

    public getElement(cssSelector: string, timeoutMilliseconds: number= 10000): Promise<WebElement> {
        return new Promise((resolve, reject) => {
            this.driver.wait(until.elementLocated(By.css(cssSelector)), timeoutMilliseconds)
                .then(() => this.driver.findElement(By.css(cssSelector)))
                .then((element: WebElement) => resolve(element))
                .catch((err: any) => reject(err));
        });
    }

    public getElements(cssSelector: string, timeoutMilliseconds: number= 10000): Promise<WebElement[]> {
        return new Promise((resolve, reject) => {
            this.driver.wait(until.elementLocated(By.css(cssSelector)), timeoutMilliseconds)
                .then(() => this.driver.findElements(By.css(cssSelector)))
                .then((elements: WebElement[]) => resolve(elements))
                .catch((err: any) => reject(err));
        });
    }

    public refresh(): Promise<null> {
        return this.get(this.lastUrl);
    }

}

export module ElementTool {

    export function getElement(element: WebElement, cssSelector: string): Promise<WebElement> {
        return new Promise((resolve, reject) => {
            element.findElement(By.css(cssSelector))
                .then((foundElement: WebElement) => resolve(foundElement))
                .catch((err: any) => reject(err));
        });
    }

    export function getElements(element: WebElement, cssSelector: string): Promise<WebElement[]> {
        return new Promise((resolve, reject) => {
            element.findElements(By.css(cssSelector))
                .then((elements: WebElement[]) => resolve(elements))
                .catch((err: any) => reject(err));
        });
    }

    export function getAttribute(element: WebElement, attribute: string): Promise<string> {
        return new Promise((resolve, reject) => {
            element.getAttribute(attribute)
                .then((innerHtml: string) => resolve(innerHtml))
                .catch((err: any) => reject(err));
        });
    }

    export function getAttributeForSelection(element: WebElement, cssSelector: string, attribute: string): Promise<string> {
        return new Promise((resolve, reject) => {
            element.findElement(By.css(cssSelector))
                .then((foundElement: WebElement) => foundElement.getAttribute(attribute))
                .then((innerHtml: string) => resolve(innerHtml))
                .catch((err: any) => reject(err));
        });
    }

    export function getInnerHtml(element: WebElement): Promise<string> {
        return new Promise((resolve, reject) => {
            element.getAttribute('innerHTML')
                .then((innerHtml: string) => resolve(innerHtml))
                .catch((err: any) => reject(err));
        });
    }

    export function getInnerHtmlForSelection(element: WebElement, cssSelector: string): Promise<string> {
        return new Promise((resolve, reject) => {
            element.findElement(By.css(cssSelector))
                .then((foundElement: WebElement) => foundElement.getAttribute('innerHTML'))
                .then((innerHtml: string) => resolve(innerHtml))
                .catch((err: any) => reject(err));
        });
    }

    export function click(element: WebElement): Promise<null> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                element.click()
                    .then(() => resolve())
                    .catch((err: any) => reject(err));
            }, 500);
        });
    }

}
