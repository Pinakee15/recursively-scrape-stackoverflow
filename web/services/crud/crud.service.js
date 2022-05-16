const dbClient = require('../../dbconnection/postgress.dbconnection');
const cacheClient = require("../../dbconnection/redis.dbconnection")

const getDataFromDb = async (query)=>{
        // Our main code 
        const values = await dbClient.pgClient.query(query);
        return values;
        //
}

const postDataToDb = async (value)=>{
    console.log("value 2 : ", value)
    cacheClient.redisClient.get(value?.question_id, async function(err, ref_count) {
        if(typeof value?.question_id == String){
            value['question_id'] = parseInt(value?.question_id)
            console.log("This is the key : ", value['question_id'])
        }
        if(!ref_count){
            //If this que id doesn't exist in cache the first insert into cache
            console.log("Redis and postgres working fine together : ", ref_count)
            cacheClient.redisClient.set(value?.question_id ,value?.reference_count);

            // Insert into DB
            try{
                await dbClient.pgClient.query(
                    `INSERT INTO 
                    so_questions(que_id , que_url, upvotes, ref_count, total_ans)
                    VALUES(${value?.question_id}, '${value?.question_url}', ${value?.total_upvotes},
                            ${value?.reference_count}, ${value?.total_answers})`    
                    , (err, res)=>{
                    if(err) console.log(err);
                }); 
            }
            catch {
                console.log("There was some error inserting the data")
            }
        } 
        else {
            console.log("Value exists , update the DB with increased ref count ",);
            let newReferenceCount = value?.reference_count+1;
            // cacheClient.redisClient.set(value?.question_id ,newReferenceCount);
            // await dbClient.pgClient.query(
            //     `UPDATE so_questions SET ref_count = ${newReferenceCount} WHERE que_id = ${value?.que_id};`    
            //     , (err, res)=>{
            //     if(err) console.log(err);
            // }); 
        }
    });
}

module.exports = {
    getDataFromDb,
    postDataToDb
}
