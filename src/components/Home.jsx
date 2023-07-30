import React, { useEffect, useState } from "react";
import "../css/Home.css";
import MemberService from "../../src/services/MemberService";
import AddMemberForm from "./forms/AddMemberForm";
import CityService from "../services/CityService";
import Competitor from "./forms/CompetitorForm";
import EditMemberForm from "./forms/EditMemberForm";
import Members from "./Members";
import "react-calendar/dist/Calendar.css";
import { deleteMemberQuestionPopUpAsync } from "../popups/SwalPopUp";
export default function Home() {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState();
  const [userDeleted, setUserDeleted] = useState();
  const [editedMember, setMemberEdited] = useState();
  const [cities, setCities] = useState([]);
  const [memberToEdit, setMemberToEdit] = useState();
  const [savedMamber, setSavedMember] = useState();
  const [isMemberFormOpened, setMemberFormOpen] = useState(false);
  const [isEditMemberFormOpened, setEditMemberFormOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const openMemberForm = () => {
    setMemberFormOpen(true);
  };

  const closeMemberForm = () => {
    setMemberFormOpen(false);
  };

  const handleMemberClick = (member) => {
    setSelectedMember(member);
  };
  const closeEditMemberForm = () => {
    setEditMemberFormOpen(false);
  };

  const openEditMemberForm = (member) => {
    setMemberToEdit(member);
    setEditMemberFormOpen(true);
  };

  const getAllMembers = async () => {
    const dbMembers = await MemberService.getMembersAsync();

    if (dbMembers !== null) {
      const filteredMembers = dbMembers.filter((member) => {
        const firstname = member.firstname;
        const lastname = member.lastname;
        return (
          firstname.toLowerCase().includes(searchValue.toLowerCase()) ||
          lastname.toLowerCase().includes(searchValue.toLowerCase())
        );
      });
      setMembers(filteredMembers);
    }
  };

  const getAllCities = async () => {
    const dbCities = await CityService.getAllCitiesAsync();
    if (dbCities !== null) {
      setCities(dbCities);
    }
  };

  const deleteMember = async (member) => {
    const shouldDelete = await deleteMemberQuestionPopUpAsync();
    if (shouldDelete) {
      const response = await MemberService.deleteMemberAsync(member.id);
      setUserDeleted(member);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllCities();
        await getAllMembers();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [searchValue]);

  useEffect(() => {
    if (userDeleted || editedMember || savedMamber) {
      getAllMembers();
    }
  }, [userDeleted, editedMember, savedMamber]);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  return (
    <div className="members-wrapper">
      <input
        type="text"
        value={searchValue}
        onChange={handleSearchChange}
        placeholder="Search by name"
        className="search-input"
      />
      <Members
        members={members}
        openEditMemberForm={openEditMemberForm}
        deleteMember={deleteMember}
        setSelectedMember={setSelectedMember}
      />
      <button onClick={openMemberForm} className="button-add">
        Add member
      </button>
      {/* <PdfViewer /> */}

      {isMemberFormOpened && (
        <div className="popup-container">
          <div className="popup-content">
            <button className="close-button" onClick={closeMemberForm}>
              X
            </button>
            <AddMemberForm cities={cities} setSavedMember={setSavedMember} />
          </div>
        </div>
      )}
      {isEditMemberFormOpened && (
        <div className="popup-container">
          <div className="popup-content">
            <button className="close-button" onClick={closeEditMemberForm}>
              X
            </button>
            <EditMemberForm
              member={memberToEdit}
              setMemberEdited={setMemberEdited}
              cities={cities}
            />
          </div>
        </div>
      )}

      {/* {selectedMember && selectedMember.competitorDefinition && (
        <div className="popup-container">
          <div className="popup-content">
            <Competitor
              setSelectedMember={setSelectedMember}
              setUserDeleted={setUserDeleted}
              member={selectedMember}
            />
          </div>
        </div>
      )} */}
    </div>
  );
}
