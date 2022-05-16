const initiateBrowser = require("./initiate-browser.webscrape")
const cheerio = require("cheerio");
const dbOperation = require('../crud/crud.service');

totalQuestionsScaped = 0

async function scrapeFrontPageQuestions(html) {
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

async function scrapeOuestions(url){
  const browser = await initiateBrowser.initiateHeadlessBrowser();
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto(url, { waitUntil: "networkidle0" });
  await page.waitForSelector("#questions");

  const content = await page.content();
  const links = await scrapeFrontPageQuestions(content);
  console.log("THESE ARE LIST OF LINKS :- ", links)
  console.log("================================")
  // Go to each specific question 
  for(let link of links.slice(0,1)) {
    let url = `https://stackoverflow.com${link}`;
    totalQuestionsScaped += 1
    console.log("Total questions scraped : ", totalQuestionsScaped)
    goToQuestionPage(url , page)    
  }
}

async function goToQuestionPage(url,page){
  await page.goto(url);
  await page.waitForSelector('#content');
  const pageContent = await page.content();
  let finalData = await getCurrentPageJobData(pageContent, url, page);
  console.log("This is the scraped data : ", finalData)
  console.log("----------------------")
  await dbOperation.postDataToDb(finalData);
  // After finding current question's scraped data, traverse to the related quesions links associated with this questions
  finalData?.allRelatedQuestionsLinks.forEach(async (url,i)=>{
    goToQuestionPage(url , page);
    // page.goto(url);
  })

  return finalData
}

async function getCurrentPageJobData(html, url, page) {
  let scrapedData = {};
  let allRelatedQuestionsLinks = []
  scrapedData['question_url'] = url;
  // Taking the primary key from the question number in the url of the question
  scrapedData['question_id'] = parseInt(url.split("/")[4]);
  scrapedData['reference_count'] = 0;
  const $ = cheerio.load(html);

  // Get the total upvotes 
  $('.js-vote-count').each((i,ele)=>{
    if(i == 0){
      scrapedData['total_upvotes'] = parseInt($(ele).attr('data-value'));
      return;
    }
  })

  // Find total answers 
  total_answers = 0
  $('.js-answer').each((i,ele)=>{
    total_answers += 1;
  })

  scrapedData['total_answers'] = total_answers;

  // Find the related questions
  related_questions = 0;

  $('.related').children('.spacer').each(async (i,ele)=>{
    // console.log("Related question ....", i, $(ele).find('a').attr('href'))
    let related_question_url = $(ele).children('.question-hyperlink').attr('href')
    // console.log("Related links : ", related_question_url)
    allRelatedQuestionsLinks.push(related_question_url)
    related_questions += 1;

  })
  scrapedData['allRelatedQuestionsLinks'] = allRelatedQuestionsLinks;
  // console.log("Related question links for this question : ", allRelatedQuestionsLinks)
  return scrapedData;
}

// scrapeOuestions("https://stackoverflow.com/questions")

module.exports = {
  scrapeOuestions
}