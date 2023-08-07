
import UserService from "../services/UserService";
import "../css/Trainers.css";
import React, {useEffect, useState} from "react";
import { useLocation } from "react-router-dom";
import ResultMemberDefinition from "../model/ResultMemberDefinition";
import ResultMemberService from "../services/ResultMemberService";
import { errorOccurredPopUp, addedResultSuccessfullyPopUp } from "../popups/SwalPopUp";
import { useNavigate } from "react-router-dom";
export default function CompetitionEntryByCompetition(){
    const location = useLocation();
    const competitionEntries = location.state?.competitionEntries;
    const members = location.state?.members;
    const competition= location.state?.competition;
    const [medals, setMedals] = useState({});
    const navigate = useNavigate();
    const handleMedalChange = (memberId, medalValue) => {
      setMedals((prevMedals) => ({
        ...prevMedals,
        [memberId]: medalValue,
      }));
    };

    const handleSaveButton = async () => {
      const resultMemberDefinitions = members.map((member) => {
        console.log(competition);
        const medal = medals[member.id] || ""; 
        return new ResultMemberDefinition(
          member.id,
          member.competitorDefinition.category,
          medal,
          competition,
          member.competitorDefinition
        );
       
      });
  
      for (const result of resultMemberDefinitions) {
        try {
          console.log(result);
          await ResultMemberService.saveResultMember(result);
        } catch (error) {
          console.error(
            `Error adding member result`,
            error
          );
        }
      }
      navigate("/competitions");
      addedResultSuccessfullyPopUp();
    };
  
    return(
        <div>
        {competitionEntries && competitionEntries.length > 0 ? (
          <div>
          <table className="table-container">
            <thead>
              <tr>
                <th>Id</th>
                <th>Firstname</th>
                <th>Lastname</th>
                <th>Date of birth</th>
                <th>Discipline</th>
                <th>Category</th>
                <th>Class category</th>
                <th>Medal</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => (
                <tr key={index}>
                  <td>{member.id}</td>
                  <td>{member.firstname}</td>
                  <td>{member.lastname}</td>
                  <td>{member.birthday}</td>
                  <td>{member.competitorDefinition.discipline}</td>
                  <td>{member.competitorDefinition.category}</td>
                  <td>{member.competitorDefinition.classCategory}</td>
                  <td>
                  <select
                  name="medal"
                  value={medals[member.id] || ""}
                  onChange={(e) => handleMedalChange(member.id, e.target.value)}
                
                >
                  <option value="">Select a medal</option>
                  <option value="GOLD">GOLD</option>
                  <option value="SILVER">SILVER</option>
                  <option value="BRONZE">BRONZE</option>
                </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleSaveButton} className="button" style={{marginLeft:"35vh", width:"10vh"}}>Save results</button>
          </div>
        ) : (
          <p>No competition entries available.</p>
        )}
      </div>
    )
}