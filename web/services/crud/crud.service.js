const dbClient = require('../../dbconnection/postgressconnect');

const getDataFromDb = async (query)=>{
    const values = await dbClient.pgClient.query(query);
    return values;
}

const postDataToDb = async (value)=>{
    await dbClient.pgClient.query(`INSERT INTO 
        so_questions(que_id , que_url, upvotes, ref_count, total_ans)
        VALUES(6, 'google.com', 3, 7, 5)`
    , (err, res)=>{
        console.log(err);
    });  
}

module.exports = {
    getDataFromDb,
    postDataToDb
}
