
import { useState, useEffect } from "react";
import CompetitionService from "../services/CompetitionService";
import "../css/Competition.css";
import CityService from "../services/CityService";
import AddCompetitionForm from "./forms/AddCompetitionForm";
import ResultMemberService from "../services/ResultMemberService";
import ResultsForm from "./forms/ResultsForm";
import MemberService from "../services/MemberService";

export default function Competitions() {
  const [upcomingCompetitions, setUpcomingCompetitions] = useState([]);
  const [pastCompetitions, setPastCompetitions] = useState([]);
  const [cities, setCities] = useState([]);
  const [isCompetitionFormOpened, setCompetitionFormOpened] = useState(false);
  const [savedCompetition, setSavedCompetition] = useState();
  const [isResultFormOpened,setResultFormOpened] = useState(false);
  const [competitionResults, setCompetitionResults]=useState([]);

  const handleResultsClick = (competition) => {
    openResultsForm(competition);
  };
  const openResultsForm = async (competition) =>{
    const results = await ResultMemberService.getAllResultsMemberForCompetitionAsync(competition.id);
    console.log(results);
    const memberDataPromises = results.map(async (result) => {
      const memberResponse = await MemberService.fetchMemberDataForCompetitorId(result.competitorDefinition.id);
      return {
        ...result,
        member: memberResponse,
      };
    });
    const resultsWithMemberData = await Promise.all(memberDataPromises);
    console.log(resultsWithMemberData);
    setCompetitionResults(resultsWithMemberData);
    setResultFormOpened(true);
  }
  const closeResultForm =() =>{
    setResultFormOpened(false);
  }
  const openCompetitionForm = () => {
    setCompetitionFormOpened(true);
  };

  const closeCompetitionForm = () => {
    setCompetitionFormOpened(false);
  };
  const getAllCompetitions = async () => {
    const competitions = await CompetitionService.getAllCompetitionAsync();
    const currentDate = new Date();

    const upcoming = competitions.filter(
      (competition) => new Date(competition.date) > currentDate
    );
    const past = competitions.filter(
      (competition) => new Date(competition.date) <= currentDate
    );

    setUpcomingCompetitions(upcoming);
    setPastCompetitions(past);
  };

  const getAllCities = async () =>{
    const dbCities = await CityService.getAllCitiesAsync();
    if(dbCities !== null){
      setCities(dbCities);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllCities();
        await getAllCompetitions();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
      
  },[]);
  useEffect(() => {
    if (savedCompetition )  {
      getAllCompetitions();
    }
  }, [savedCompetition]);

  return (
    <div className="competition-wrapper">
      <h2 className="competition-title upcoming-title">Upcoming Competitions</h2>
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Date</th>
            <th>Competition Hall</th>
            <th>City</th>
          </tr>
        </thead>
        <tbody>
          {upcomingCompetitions.map((competition, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{competition.name}</td>
              <td>{competition.date}</td>
              <td>{competition.competitionHall}</td>
              <td>{competition.cityDefinition.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={openCompetitionForm} className='button'>Add competition</button>
      <h2 className="competition-title past-title">Past Competitions</h2>
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Date</th>
            <th>Competition Hall</th>
            <th>City</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pastCompetitions.map((competition, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td className="competition-name" onClick={() => handleResultsClick(competition)}>
                {competition.name}
              </td>
              <td>{competition.date}</td>
              <td>{competition.competitionHall}</td>
              <td>{competition.cityDefinition.name}</td>
              <td><button className="button-results">Results</button></td>
            </tr>
          ))}
        </tbody>
      </table>

    {isCompetitionFormOpened &&
       <div className="popup-container-competition">
       <div className="popup-content-competition">
         <button className="close-button" onClick={closeCompetitionForm}>
           X
         </button>
         <AddCompetitionForm 
         cities={cities}
         setSavedCompetition= {setSavedCompetition}
         />
       </div>
     </div>
      }

    {isResultFormOpened &&
          <div className="popup-container-results">
          <div className="popup-content-results">
            <button className="close-button" onClick={closeResultForm}>
              X
            </button>
            <ResultsForm 
              results= {competitionResults}
              
            />
          </div>
        </div>
      }
  </div>
);
}
