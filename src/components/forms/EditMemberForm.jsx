import React, { useState } from "react";
import MemberService from "../../services/MemberService";
import { updatedMemberSuccessfullyPopUp ,errorOccurredPopUp} from "../../popups/SwalPopUp";

const EditMemberForm = (props) => {
  const member= props.member;
  const cities = props.cities;

  const [firstname, setFirstname] = useState(member.firstname);
  const [lastname, setLastname] = useState(member.lastname);
  const [birthday, setBirthday] = useState(member.birthday);
  const [mothersName, setMothersName] = useState(member.mothersName);
  const [fathersName, setFathersName] = useState(member.fathersName);
  const [adress, setAddress] = useState(member.adress);
  const [dateOfMembership, setDateOfMembership] = useState(
    member.dateOfMembership
  );
  const [belt, setBelt] = useState(member.belt);
  const [gender, setGender] = useState(member.gender);
  const [selectedCity, setSelectedCity] = useState(member.cityDefinition);

  const handleCityChange = (e) => {
    const selectedCityId = parseInt(e.target.value);
    const city = cities.find((city) => city.id === selectedCityId);
    setSelectedCity(city);
  };
  const updateMember = async(member) =>{
    try{
     await MemberService.updateMemberAsync(member);
    updatedMemberSuccessfullyPopUp();
    props.setMemberEdited(member);
    props.setEditMemberFormOpen(false);
    }catch(error){
      errorOccurredPopUp("Cant update member! "+error);
    }
  }
  const handleSave = () => {
    const updatedMember = {
      ...member,
      firstname: firstname,
      lastname: lastname,
      birthday: birthday,
      mothersName: mothersName,
      fathersName: fathersName,
      adress: adress,
      cityDefinition: selectedCity,
      dateOfMembership: dateOfMembership,
      belt: belt,
      gender: gender,
    };
    updateMember(updatedMember);
      
  };

  return (
    <div className="edit-member-form">
      <h2>{member.firstname} {member.lastname}</h2>
      <label>
        Name:
        <input
          type="text"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
        />
      </label>
      <label>
        Lastname:
        <input
          type="text"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
        />
      </label>
      <label>
        Gender:
        <input
          type="text"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        />
      </label>
      <label>
        Birthday:
        <input
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
        />
      </label>
      <label>
        Mother's Name:
        <input
          type="text"
          value={mothersName}
          onChange={(e) => setMothersName(e.target.value)}
        />
      </label>
      <label>
        Father's Name:
        <input
          type="text"
          value={fathersName}
          onChange={(e) => setFathersName(e.target.value)}
        />
      </label>
      <label>Select a city</label>
      <select
        name="city"
        value={selectedCity ? selectedCity.id : ""}
        onChange={handleCityChange}
        className="form-select"
      >
        {cities.map((city) => (
          <option key={city.id} value={city.id}>
            {city.name}
          </option>
        ))}
      </select>
      <label>
        Address:
        <input
          type="text"
          value={adress}
          onChange={(e) => setAddress(e.target.value)}
        />
      </label>
    
      <label>
        Date of Membership:
        <input
          type="date"
          value={dateOfMembership}
          onChange={(e) => setDateOfMembership(e.target.value)}
        />
      </label>
      <label>
        Belt:
        <input
          type="text"
          value={belt}
          onChange={(e) => setBelt(e.target.value)}
        />
      </label>
      
      <button onClick={handleSave}>Update member</button>
      <p></p>
      <button onClick={()=>props.deleteMember(member)}  >Delete member</button>
      </div>
      );
      }
export default EditMemberForm;