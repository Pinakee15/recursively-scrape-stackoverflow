const dbClient = require('../../dbconnection/postgressconnect');

const getDataFromDb = async (query)=>{
    const values = await dbClient.pgClient.query(query);
    return values;
}

const postDataToDb = async (value)=>{
    
    await dbClient.pgClient.query(
        `INSERT INTO 
         so_questions(que_id , que_url, upvotes, ref_count, total_ans)
         VALUES(${value?.question_id}, '${value?.question_url}', ${value?.total_upvotes},
                  ${value?.reference_count}, ${value?.total_answers})`    
        , (err, res)=>{
        if(err) console.log(err);
    });  
}

module.exports = {
    getDataFromDb,
    postDataToDb
}
