import React, { useState } from 'react';
import "../../css/MemberForm.css";
import MemberService from '../../services/MemberService';

export default function AddMemberForm(props){
    const cities= props.cities;

    const [member, setMember] = useState({
      name: '',
      lastname: '',
      birthday: '',
      mothersName: '',
      fathersName: '',
      adress: '',
      city: {},
      dateOfMembership: '',
      belt: '',
      gender: '',
      totalDebt: 3000.00,
    });
  
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'city') {
            const selectedCity = cities.find((city) => city.id === parseInt(value));
            setMember((prevMember) => ({
              ...prevMember,
              city: selectedCity,
            }));
          } else {
            setMember((prevMember) => ({
              ...prevMember,
              [name]: value,
            }));
          }
       
      };
      
      
  
    const handleSave = async (e) => {
        e.preventDefault(); 
        const response = await MemberService.saveMemberAsync(member);
        props.setSavedMember(member);
        console.log(response);
    };
  
    return (
      <form onSubmit={handleSave} className='form-member'>
         <label className="form-label">
          Name:
          <input type="text" name="name" value={member.name} onChange={handleInputChange} className="form-input" />
        </label>
        <label className="form-label">
          Last Name:
          <input type="text" name="lastname" value={member.lastname} onChange={handleInputChange} className="form-input" />
        </label>
        <label className="form-label">
          Birthday:
          <input type="date" name="birthday" value={member.birthday} onChange={handleInputChange} className="form-input" />
        </label>
        <label className="form-label">
          Mother's Name:
          <input type="text" name="mothersName" value={member.mothersName} onChange={handleInputChange} className="form-input" />
        </label>
        <label className="form-label">
          Father's Name:
          <input type="text" name="fathersName" value={member.fathersName} onChange={handleInputChange} className="form-input" />
        </label>
        <label className="form-label">
          Address:
          <input type="text" name="adress" value={member.adress} onChange={handleInputChange} className="form-input" />
        </label>
        <select name="city" value={member.city.id || ''} onChange={handleInputChange} className="form-select">
            <option value="">Select a city</option>
            {cities.map((city) => (
                <option key={city.id} value={city.id}>
                {city.name}
                </option>
            ))}
        </select>

        <label className="form-label">
          Date of Membership:
          <input type="date" name="dateOfMembership" value={member.dateOfMembership} onChange={handleInputChange} className="form-input" />
        </label>
        <label className="form-label">
          Belt:
          <input type="text" name="belt" value={member.belt} onChange={handleInputChange} className="form-input" />
        </label>
        <label className="form-label">
          Gender:
          <input type="text" name="gender" value={member.gender} onChange={handleInputChange} className="form-input" />
        </label>
        <label className="form-label">
          Total Debt:
          <input type="number" name="totalDebt" value={member.totalDebt} onChange={handleInputChange} className="form-input" />
        </label>
        <button type="submit" className="form-button">Save member</button>
      </form>
    );
  
}