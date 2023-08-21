import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CompetitionService from "../services/CompetitionService";
import "../css/Competition.css";
import CityService from "../services/CityService";
import AddCompetitionForm from "./forms/AddCompetitionForm";
import ResultMemberService from "../services/ResultMemberService";
import ResultsForm from "./forms/ResultsForm";
import MemberService from "../services/MemberService";
import EditCompetitionForm from "./forms/EditCompetitionForm";
import {
  deleteCompetitionQuestionPopUpAsync,
  errorOccurredPopUp,
  deletedCompetitionSuccessfullyPopUp,
  successfullyLoadedCompetition
} from "../popups/SwalPopUp";
import CompetitionEntryService from "../services/CompetitionEntryService";

export default function Competitions() {
  const [upcomingCompetitions, setUpcomingCompetitions] = useState([]);
  const [pastCompetitions, setPastCompetitions] = useState([]);
  const [cities, setCities] = useState([]);
  const [isCompetitionFormOpened, setCompetitionFormOpened] = useState(false);
  const [isCompetitionEditFormOpened, setCompetitionEditFormOpened] =useState(false);
  const [savedCompetition, setSavedCompetition] = useState();
  const [isResultFormOpened, setResultFormOpened] = useState(false);
  const [competitionResults, setCompetitionResults] = useState([]);
  const [competitionForEditing, setCompetitionForEditing] = useState();
  const [editedCompetition, setCompetitionEdited] = useState();
  const [deletedCompetition, setCompetitionDeleted] = useState();

  const navigate = useNavigate();

  const handleResultsClick = async (competition) => {
    const results =
    await ResultMemberService.getAllResultsMemberForCompetitionAsync(
      competition.id
    );
    console.log(results);
    if(results.length===0){
      handleOpenCompetitionEntries(competition);
    }
    else{
      console.log(results);
      fetchMemberData(results)
        .then((resultsWithMemberData) => {
          setCompetitionResults(resultsWithMemberData);
        })
        .catch((error) => {
          console.error(error);
        });
      setResultFormOpened(true);
    }
  };

  const fetchMemberData = async (results) => {
    const resultsWithMemberData = [];
    for (const result of results) {
      const memberResponse = await MemberService.fetchMemberDataForCompetitorId(
        result.competitorDefinition.id
      );
      resultsWithMemberData.push({
        ...result,
        member: memberResponse,
      });
    }
    return resultsWithMemberData;
  };
  const closeResultForm = () => {
    setResultFormOpened(false);
  };
  const openCompetitionForm = () => {
    setCompetitionFormOpened(true);
  };
  const openCompetitionEditForm = (competition) => {
    errorOccurredPopUp("Can't load competition!");
    setCompetitionForEditing(competition);
    setCompetitionEditFormOpened(true);
  };

  const closeCompetitionForm = () => {
    setCompetitionFormOpened(false);
  };

  const closeCompetitionEditForm = () => {
    setCompetitionEditFormOpened(false);
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

  const getAllCities = async () => {
    const dbCities = await CityService.getAllCitiesAsync();
    if (dbCities !== null) {
      setCities(dbCities);
    }
  };
  const getMembersForCompetitors = async (competitorIds) => {
    const members = [];
    for (const id of competitorIds) {
      try {
        const member = await MemberService.fetchMemberDataForCompetitorId(id);
        members.push(member);
      } catch (error) {
        console.error(
          `Error fetching member data for competitor with ID ${id}:`,
          error
        );
      }
    }
    return members;
  };
  const handleOpenCompetitionEntries = async (competition) => {
    successfullyLoadedCompetition();
    const results =
      await ResultMemberService.getAllResultsMemberForCompetitionAsync(
        competition.id
      );
    console.log(results);
    if (results.length != 0) {
      fetchMemberData(results)
        .then((resultsWithMemberData) => {
          setCompetitionResults(resultsWithMemberData);
        })
        .catch((error) => {
          console.error(error);
        });
      setResultFormOpened(true);
    } else {
      const response =
        await CompetitionEntryService.getAllResultsMemberForCompetitionAsync(
          competition.id
        );

      const competitorIds = response.map(
        (entry) => entry.competitorDefinition.id
      );
      const members = await getMembersForCompetitors(competitorIds);
      if (response.length !== 0) {
        navigate("/competitionEntries/competition", {
          state: {
            competitionEntries: response,
            members: members,
            competition: competition,
          },
        });
      } else {
        navigate("/competitionEntries", {
          state: { competition: competition },
        });
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllCities();
        await getAllCompetitions();
      } catch (error) {
        errorOccurredPopUp("Error while trying to fetch the competitions from database!");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (editedCompetition || deletedCompetition || savedCompetition) {
      getAllCompetitions();
    }
  }, [editedCompetition, deletedCompetition, savedCompetition]);

  const deleteCompetition = async (competition) => {
    errorOccurredPopUp("Can't delete this competition!");
    // const shouldDelete = await deleteCompetitionQuestionPopUpAsync();
    // if (shouldDelete) {
    //   const response = await CompetitionService.deleteCompetitionAsync(
    //     competition.id
    //   );
    //   if (response.responseData == null) {
    //     errorOccurredPopUp("Can't delete this competition!");
    //   } else {
    //     setCompetitionDeleted(competition);
    //     deletedCompetitionSuccessfullyPopUp(competition);
    //   }
    // }
  };

  return (
    <div className="competition-wrapper">
      {upcomingCompetitions.length > 0 && (
        <div>
          <h2 className="competition-title upcoming-title">
        Upcoming Competitions
      </h2>
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Date</th>
            <th>Competition Hall</th>
            <th>City</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {upcomingCompetitions.map((competition, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td
                className="competition-name"
                onClick={() => handleOpenCompetitionEntries(competition)}
              >
                {competition.name}
              </td>
              <td>{competition.date}</td>
              <td>{competition.competitionHall}</td>
              <td>{competition.cityDefinition.name}</td>
              <td>
                <button
                  onClick={() => openCompetitionEditForm(competition)}
                  className="button"
                >
                  Edit
                </button>
              </td>
              <td>
                <button
                  onClick={() => deleteCompetition(competition)}
                  className="button"
                >
                  Delete competition
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={openCompetitionForm} className="button">
        Add competition
      </button>
        </div>
      )}
      
      
      <h2 className="competition-title past-title">Past Competitions</h2>
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
          {pastCompetitions.map((competition, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td
                className="competition-name"
                onClick={() => handleResultsClick(competition)}
              >
                {competition.name}
              </td>
              <td>{competition.date}</td>
              <td>{competition.competitionHall}</td>
              <td>{competition.cityDefinition.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {upcomingCompetitions.length === 0 && (
      <button onClick={openCompetitionForm} className="button">
        Add competition
      </button>
      )}
      {isCompetitionFormOpened && (
        <div className="popup-container-competition">
          <div className="popup-content-competition">
            <button className="close-button" onClick={closeCompetitionForm}>
              X
            </button>
            <AddCompetitionForm
              cities={cities}
              setSavedCompetition={setSavedCompetition}
              setCompetitionFormOpened={setCompetitionFormOpened}
            />
          </div>
        </div>
      )}
      {isCompetitionEditFormOpened && (
        <div className="popup-container-competition">
          <div className="popup-content-competition">
            <button className="close-button" onClick={closeCompetitionEditForm}>
              X
            </button>
            <EditCompetitionForm
              cities={cities}
              competition={competitionForEditing}
              setCompetitionEdited={setCompetitionEdited}
              setCompetitionEditFormOpened={setCompetitionEditFormOpened}
            />
          </div>
        </div>
      )}

      {isResultFormOpened && (
        <div className="popup-container-results">
          <div className="popup-content-results">
            <button className="close-button" onClick={closeResultForm}>
              X
            </button>
            <ResultsForm results={competitionResults} />
          </div>
        </div>
      )}
    </div>
  );
}
