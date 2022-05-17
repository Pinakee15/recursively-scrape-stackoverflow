const initiateBrowser = require("./initiate-browser.webscrape")
const cheerio = require("cheerio");
const dbOperation = require('../crud/crud.service');


async function scrapeOuestions(url , recursionDepth , resumeScaping){

  const browser = await initiateBrowser.initiateHeadlessBrowser();
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);

  if(resumeScaping){
    goToQuestionPage(url , page , recursionDepth);
    return;
  }

  await page.goto(url, { waitUntil: "networkidle0" });
  await page.waitForSelector("#questions");

  const content = await page.content();
  const links = await scrapeFrontPageQuestions(content);

  // ******  CALL 5 TOP QUESTIONS CONCURRENTLY WHICH WILL ACT TOP NODE FOR EACH RECURSION TREE  ******
  
  for(let link of links.slice(0,5)) {
    let url = `https://stackoverflow.com${link}`;
    goToQuestionPage(url , page , recursionDepth)    
  }
}

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

async function goToQuestionPage(url,page , recursionDepth){
  // IF THE RECURSION HEIGHT REACHES 0 , THEN MOVE TO SIBLING QUESTION (NODE) OF THE RECURSION 
  // TREE INSTEAD OF GOING FURTHER DOWN THE RECURSION TREE
  
  console.log("Recursion height : ", recursionDepth);
  if(recursionDepth == 0){
    return
  }

  await page.goto(url, { waitUntil: "networkidle0" });
  await page.waitForSelector('#content');
  const pageContent = await page.content();
  let finalData = await getCurrentPageJobData(pageContent, url, page);
  console.log("This is the scraped data : ", finalData)
  console.log("----------------------")
  await dbOperation.postDataToDb(finalData);

  // After finding current question's scraped data, traverse to the related quesions links associated with this questions
  finalData?.allRelatedQuestionsLinks.forEach(async (url,i)=>{
    goToQuestionPage(url , page , recursionDepth-1);
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
    let related_question_url = $(ele).children('.question-hyperlink').attr('href')
    allRelatedQuestionsLinks.push(related_question_url)
    related_questions += 1;

  })
  scrapedData['allRelatedQuestionsLinks'] = allRelatedQuestionsLinks;
  return scrapedData;
}

module.exports = {
  scrapeOuestions
}