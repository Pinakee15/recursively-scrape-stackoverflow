const puppeteer = require('puppeteer');

async function initiateHeadlessBrowser(){
    let browser;
    try{
        console.log("Browser opened ...");
        browser = await puppeteer.launch({ 
          executablePath: '/usr/bin/chromium-browser', 
          args: [ '--disable-gpu', '--disable-setuid-sandbox', '--no-sandbox', '--no-zygote' ] })
    }

    catch(err){
        console.log("Error setting up chrome : ",err);
    }
    return browser;
} 

module.exports = {
    initiateHeadlessBrowser
}