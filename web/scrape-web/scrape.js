const initiateBrowser = require("./initiate-browser")
const cheerio = require("cheerio");

async function scrapeData(url){
  const browser = await initiateBrowser.initiateHeadlessBrowser();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle0" });
  await page.waitForSelector("#questions");
  const content = await page.content();
  const links = await getJobData(content);
  console.log("This is the link :- ", links)

  // Go to each specific question 
  // for(let link of links[0]) {
    // await page.goto(`https://stackoverflow.com${link}`);
    await page.goto(`https://stackoverflow.com${links[0]}`);
    await page.waitForSelector('#content');
    const pageContent = await page.content();
    await getCurrentPageJobData(pageContent);
//   }
  await browser.close();
}

async function getJobData(html) {
  const links = [];
  const $ = cheerio.load(html);
  $('.s-link').each((i, element) => {
    link = $(element, '.s-link').attr('href');
    if(link.substring(0,11) == '/questions/'){
        links.push(link);   
    } 
  });
  return links;
}

async function getCurrentPageJobData(html) {
  const $ = cheerio.load(html);

  // Get the total upvotes 
  $('.js-vote-count').each((i,ele)=>{
    console.log("Total number of upvotes : ", $(ele).attr('data-value'));
  })

  // Find total answers 
  total_answers = 0
  $('.js-answer').each((i,ele)=>{
    total_answers += 1;
  })

  // Find the related questions
  $('.spacer').each((i,ele)=>{
    console.log("entered inside ....", i, $(ele).find('a').attr('href'))
    total_answers += 1;
  })


  console.log("Total number of answers : ", total_answers)

}

// scrapeData("https://stackoverflow.com/questions");
// scrapeData("https://stackoverflow.com/questions?tab=newest&page=9999")

module.exports = {
  scrapeData
}