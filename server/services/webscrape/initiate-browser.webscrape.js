const puppeteer = require('puppeteer');

async function initiateHeadlessBrowser(){
    let browser;
    try{
        console.log("Browser opened ...");
        browser = await puppeteer.launch({
            headless : true,
            executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
        })
    }

    catch(err){
        console.log("Error setting up chrome : ",err);
    }
    return browser;
} 

module.exports = {
    initiateHeadlessBrowser
}