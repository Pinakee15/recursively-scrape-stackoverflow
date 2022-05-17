import { useCallback, useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

const MainComponent = () => {
  const [quesions, setQuestions] = useState([]);
  const [showError , setShowError] = useState(false);
  const [value, setValue] = useState("");
  console.log("entered")
  const getAllNumbers = useCallback(async () => {
    // we will use nginx to redirect it to the proper URL
    // const quesions = await axios.get("http://localhost:4000/get_scraped_data"); get_last_question
    const quesions = await axios.get("http://localhost:4000/get_scraped_data");
    setQuestions(quesions.data)
    console.log(quesions.data)
  }, []);
  
  const startScraping = useCallback(
    async event => {
      event.preventDefault();
      console.log("DEPTH : ", value)
      if(value <100){
        setShowError(true);
        return;
      }
      await axios.post("http://localhost:4000/start_scraping", {
        value
      });

      setValue("");
      // getAllNumbers();
    },
    [value, getAllNumbers]
  );

  const resumeScraping = useCallback(
    async event => {
      event.preventDefault();
      console.log("DEPTH : ", value)
      if(value <100){
        setShowError(true);
        return;
      }
      await axios.post("http://localhost:4000/resume_scraping", {
        value
      });

      setValue("");
      // getAllNumbers();
    },
    [value, getAllNumbers]
  );

  useEffect(() => {
    getAllNumbers();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-container__left">
        <br />

        <form className="form" onSubmit={startScraping}>
          <div className="form-container">
            <h1>Enter Recursion depth: </h1>
            <input
              placeholder="Enter depth of 100 or more"
              value={value}
              onChange={event => {
                setValue(event.target.value);
              }}
            />
              {showError ? (
                  <code style={{color:'red'}}>Enter depth of more than or equal to 100</code>
                ) : (
                  true
              )}
            <div className="button-container">
              <button onClick={startScraping}>Start scraping from start</button>
              <button onClick={resumeScraping} >Resume scraping</button>
            </div>
            <code><b>NOTE :</b>Scrape for period of 1 min or less and with a gap of 15-20 sec in btw to avoid possibility of IP blocking </code>
          </div>
        </form>
      </div>

      <div className="dashboard-container__right">    
        <div className="questions-container">
          <div className="questions">
            <tbody>
              {quesions.map((question,i)=>{
                return <div key={i} className="question">
                      <div><b>Question Url : </b>{question?.que_url}</div> 
                      <div><span><b>Upvotes : </b>{question?.upvotes}</span>  <span><b>Total answers :</b>{question?.total_ans}</span>  <span><b>Ref count : </b>{question?.ref_count}</span></div>
                  </div>
              })}
            </tbody>
          </div>
          <button onClick={getAllNumbers}>Get scraped ques</button>
        </div>
      </div>


    </div>
  );
};

export default MainComponent;
