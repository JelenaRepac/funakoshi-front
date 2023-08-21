import React, { useEffect, useState } from "react";
import { errorOccurredPopUp, addedComeptitionEntriesSuccessfullyPopUp } from "../popups/SwalPopUp";
import Members from "../../src/components/Members";
import MemberService from "../services/MemberService";
import Competitor from "./forms/CompetitorForm";
import CompetitionEntryService from "../services/CompetitionEntryService";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function CompetitionEntries(props) {
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedMembersForCompetition, setSelectedMembersForCompetition] =
      useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const location = useLocation();
    const competition = location.state?.competition;
    const getAllMembers = async () => {
      const dbMembers = await MemberService.getMembersAsync();
  
      if (dbMembers !== null) {
        setMembers(dbMembers);
      }
      console.log(members);
    };
  
    const navigate = useNavigate();
    useEffect(() => {
      const fetchData = async () => {
        try {
          await getAllMembers();
        } catch (error) {
          errorOccurredPopUp(
            "Error while trying to fetch members from the database!"
          );
          console.error("Error fetching data:", error);
        }
      };
  
      fetchData();
    }, []);
  
    const handleMemberCheckboxChange = (memberId) => {
      setSelectedMembersForCompetition((prevSelected) => {
        const isMemberSelected = prevSelected.includes(memberId);
  
        if (isMemberSelected) {
          return prevSelected.filter((id) => id !== memberId);
        } else {
          return [...prevSelected, memberId];
        }
      });
    };
  
    const handleMultipleMemberCheckboxChange = (
      selectedMembersForCompetition
    ) => {
      setSelectedMembers((prevSelectedMembers) => {
        const selectedMemberIds = new Set(
          prevSelectedMembers.map((member) => member.id)
        );
        const selectedMembers = selectedMembersForCompetition.map((memberId) => {
          if (!selectedMemberIds.has(memberId)) {
            const selectedMember = members.find(
              (member) => member.id === memberId
            );
            return selectedMember;
          }
          return null;
        });
  
        const filteredSelectedMembers = selectedMembers.filter(
          (member) => member !== null
        );
  
        return [...prevSelectedMembers, ...filteredSelectedMembers];
      });
    };
  
    useEffect(() => {
      handleMultipleMemberCheckboxChange(selectedMembersForCompetition);
    }, [selectedMembersForCompetition]);
  
    const getMembersForCompetitors = async (competitorIds) => {
      const members = [];
      for (const id of competitorIds) {
        try {
          const member = await MemberService.fetchMemberDataForCompetitorId(id);
          members.push(member);
         
        } catch (error) {
          console.error(`Error fetching member data for competitor with ID ${id}:`, error);
        }
      }
      return members;
    };
    const handleOpenCompetitionEntries = async (competition) => {
      try {
        const response =
          await CompetitionEntryService.getAllResultsMemberForCompetitionAsync(
            competition.id
          );

        if (response.length !== 0) {
          // Process the response
        } else {
          console.log("Empty response received");
        }

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
        }
      } catch (error) {
        console.error("Error fetching competition results:", error);
      }
    };
   const handleSaveCompetitionEntries = async () => {
    console.log(competition);
    console.log(selectedMember);
      for (const selectedMember of selectedMembers) {
        if (selectedMember.competitorDefinition == null) {
          errorOccurredPopUp(
            "Check if the selected member has defined category, discipline and class category!"
          );
        } else {
          try {
            const response =
              await CompetitionEntryService.saveCompetitionEntryAsync(
                competition,
                selectedMember
              );
             console.log(response);
             addedComeptitionEntriesSuccessfullyPopUp(competition);
             handleOpenCompetitionEntries(competition);
             setSelectedMembers([]);
          } catch (error) {
            errorOccurredPopUp("Error while trying to save competition entries!");
          }
        }
      }
     
    };
    const handleTriger = () =>{
      getAllMembers();
    }
    const handleMemberClick = (member) => {
      setSelectedMember(member);
      };
    return (
        <div>
        <table className="table-container">
          <thead>
            <tr>
              <th></th>
              <th>Firstname</th>
              <th>Lastname</th>
              <th>Date of birth</th>
              <th>Mothers name</th>
              <th>Fathers name</th>
              <th>City</th>
              <th>Adress</th>
              <th>Date of membership</th>
              <th>Check</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr
                key={index}
              >
                <td>{index+1}</td>
                <td style={{ cursor: "pointer" }} onClick={() => handleMemberClick(member)}><b>{member.firstname}</b></td>
                <td><b>{member.lastname}</b></td>
                <td>{member.birthday}</td>
                <td>{member.mothersName}</td>
                <td>{member.fathersName}</td>
                <td>{member.cityDefinition.name}</td>
                <td>{member.adress}</td>
                <td>{member.dateOfMembership}</td>
                <td>
                    <input
                      type="checkbox"
                      value={member.id}
                      checked={selectedMembersForCompetition.includes(member.id)}
                      onChange={() => handleMemberCheckboxChange(member.id)}
                    />
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
        {selectedMember && (
            <div className="popup-container-competitor">
              <div className="popup-content-competitor">
                <Competitor
                  setSelectedMember={setSelectedMember}
                  member={selectedMember}
                  handleTriger={handleTriger}
                />
              </div>
            </div>
          )}
        <button onClick={handleSaveCompetitionEntries} className="button" style={{width:"30vh", marginLeft:"33vh"}}> 
        Save members - competition entry
        </button>
        </div>
    )
}