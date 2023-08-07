import React, { useEffect, useState } from "react";
import { errorOccurredPopUp, addedComeptitionEntriesSuccessfullyPopUp } from "../popups/SwalPopUp";
import Members from "../../src/components/Members";
import MemberService from "../services/MemberService";
import Competitor from "./forms/CompetitorForm";
import "../../src/css/CompetitionEntry.css";
import CompetitionEntryService from "../services/CompetitionEntryService";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function CompetitionEntry(props) {

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
    const response = await CompetitionEntryService.getAllResultsMemberForCompetitionAsync(
   competition.id
 );

 const competitorIds = response.map((entry) => entry.competitorDefinition.id);
 const members = await getMembersForCompetitors(competitorIds);

  if (response.length !== 0) {
    navigate("/competitionEntries/competition", {
      state: { competitionEntries: response, members:members , competition:competition},
    });
    }
  }
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
          console.error("Error saving competition entry:", error);
        }
      }
    }
   
  };
  const handleTriger = () =>{
    getAllMembers();
  }
  return ( 
   
      <div>
      <div className="tables-container">
        <div className="members-table-container">
          <Members
            members={members}
            setSelectedMember={setSelectedMember}
            isFees={true}
          />
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
        </div>

        <div className="competitors-container">
          <table className="selection-of-competitors">
            <thead>
              <tr>
                <th>Name</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr>
                  <td>
                    <input
                      type="checkbox"
                      value={member.id}
                      checked={selectedMembersForCompetition.includes(member.id)}
                      onChange={() => handleMemberCheckboxChange(member.id)}
                    />
                  </td>
                  <td>{`${member.firstname} ${member.lastname}`}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="selected-members-list">
            {/* <h3>Selected members for the competition:</h3> */}
            <ul>
              {selectedMembersForCompetition.map((memberId) => {
                const selectedMember = members.find(
                  (member) => member.id === memberId
                );
                // return (
                //   <>
                //     <li key={selectedMember.id}>
                //       {`${selectedMember.firstname} ${selectedMember.lastname}`}
                //     </li>
                //   </>
                // );
              })}
            </ul>
          </div>
          <button onClick={handleSaveCompetitionEntries} className="button" style={{width:"30vh"}}> 
            Save members - competition entry
          </button>
        </div>
    </div>
    </div>
    
  )
  
}
