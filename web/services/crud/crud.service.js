const dbClient = require('../../dbconnection/postgress.dbconnection');
const cacheClient = require("../../dbconnection/redis.dbconnection")

const getDataFromDb = async (query)=>{
        const values = await dbClient.pgClient.query(query);
        return values;
}

const updateData = async(que_id , value)=>{
    const val =  await dbClient.pgClient.query(`
        delete from so_questions where que_id = ${que_id}
    `)

    await dbClient.pgClient.query(
        `INSERT INTO 
        so_questions(que_id , que_url, upvotes, ref_count, total_ans , timestamp)
        VALUES(${value?.question_id}, '${value?.question_url}', ${value?.total_upvotes},
                ${value?.reference_count+1}, ${value?.total_answers}, to_timestamp(${Date.now()} / 1000.0) )`    
        , (err, res)=>{
        if(err) console.log(err);
    })
    return true;
}

// ********* NOTE :- Not using below funciton for updation using above one because 
//  pg library is giving some unidentifyable error *********

// const updateData =  async(que_id , value)={
    // await dbClient.pgClient.query(
    //     `UPDATE so_questions SET ref_count = ${newReferenceCount} WHERE que_id = ${value?.que_id};`    
    //     , (err, res)=>{
    //     if(err) console.log(err);
    // }); 
// }

const postDataToDb = async (value)=>{

    cacheClient.redisClient.get(`${value?.question_id}`, async function(err, ref_count) {

        console.log("Redis Key value : ", value?.question_id , ref_count)

        if(ref_count == null || ref_count == undefined){

            cacheClient.redisClient.set(`${value?.question_id}` , `${value?.reference_count}`);

            // Insert into DB
            try{
                await dbClient.pgClient.query(
                    `INSERT INTO 
                    so_questions(que_id , que_url, upvotes, ref_count, total_ans , timestamp)
                    VALUES(${value?.question_id}, '${value?.question_url}', ${value?.total_upvotes},
                            ${value?.reference_count}, ${value?.total_answers} , to_timestamp(${Date.now()} / 1000.0))`    
                    , async (err, res)=>{
                    if(err) {
                        // Basically if the primary already exists then just update the existing record
                        const temp = await updateData(value?.question_id, value)
                    };
                }); 
            
            }
            catch {
                console.log("There was some error inserting the data")
            }
            return true;
        } 
        else {

            return true
        }
    });
}

module.exports = {
    getDataFromDb,
    postDataToDb,
    updateData
}
