import React, { useEffect, useState } from "react";
import "../css/Home.css";
import MemberService from "../../src/services/MemberService";
import AddMemberForm from "./forms/AddMemberForm";
import CityService from "../services/CityService";
import EditMemberForm from "./forms/EditMemberForm";
import Members from "./Members";
import "react-calendar/dist/Calendar.css";
import {
  deleteMemberQuestionPopUpAsync,
  errorOccurredPopUp,
  deletedMemberSuccessfullyPopUp,
  successPopUp
} from "../popups/SwalPopUp";
import UserService from "../services/UserService";

export default function Home(loggedUser) {

  const [members, setMembers] = useState([]);
  const [userDeleted, setUserDeleted] = useState();
  const [editedMember, setMemberEdited] = useState();
  const [cities, setCities] = useState([]);
  const [memberToEdit, setMemberToEdit] = useState();
  const [savedMamber, setSavedMember] = useState();
  const [isMemberFormOpened, setMemberFormOpen] = useState(false);
  const [isEditMemberFormOpened, setEditMemberFormOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedMember, setSelectedMember] = useState();

  const openMemberForm = () => {
    setMemberFormOpen(true);
  };

  const closeMemberForm = () => {
    setMemberFormOpen(false);
  };

  const closeEditMemberForm = () => {
    setEditMemberFormOpen(false);
  };

  const openEditMemberForm = (member) => {
    try{
    setMemberToEdit(member);
    setEditMemberFormOpen(true);
    }catch(error){
      errorOccurredPopUp("Cant load information about specific member!");
    }
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
      if (filteredMembers.length > 0) {
        setTimeout(() => {
          successPopUp();
        }, 5000); 
      } else {
        errorOccurredPopUp("No search results found.");
      }
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
      try{
      const response = await MemberService.deleteMemberAsync(member.id);
      
      
      setUserDeleted(member);
      deletedMemberSuccessfullyPopUp(member);
      }catch(error){
        errorOccurredPopUp("Error while trying to delete member!");
      }
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
        // deleteMember={deleteMember}
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
            <AddMemberForm
              cities={cities}
              setSavedMember={setSavedMember}
              setMemberFormOpen={setMemberFormOpen}
            />
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
              setEditMemberFormOpen={setEditMemberFormOpen}
              cities={cities}
              deleteMember={deleteMember}
            />
          </div>
        </div>
      )}

    
    </div>
  );
}
