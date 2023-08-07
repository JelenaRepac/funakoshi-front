import React, { useState } from 'react';
import CompetitionService from '../../services/CompetitionService';
import { addedComeptitionSuccessfullyPopUp } from '../../popups/SwalPopUp';

export default function AddCompetitionForm(props){
    const cities= props.cities;

    const [competition, setCompetition] = useState({
      competitionHall: '',
      date: '',
      name: '',
      city: {},
    });
  
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'city') {
            const selectedCity = cities.find((city) => city.id === parseInt(value));
            setCompetition((prevCompetition) => ({
              ...prevCompetition,
              city: selectedCity,
            }));
          } else {
            setCompetition((prevCompetition) => ({
              ...prevCompetition,
              [name]: value,
            }));
          }
       
      };
      
      
  
    const handleSave = async (e) => {
        e.preventDefault(); 
        await CompetitionService.saveCompetitionAsync(competition);
        props.setSavedCompetition(competition);
        props.setCompetitionFormOpened(false);
        addedComeptitionSuccessfullyPopUp();
    };
  
      
    return (
      <form onSubmit={handleSave} className='form-member'>
         <label className="form-label">
           Name:
          <input type="text" name="name" value={competition.name} onChange={handleInputChange} className="form-input" />
        </label>
        <label className="form-label">
          Competition hall:
          <input type="text" name="competitionHall" value={competition.competitionHall} onChange={handleInputChange} className="form-input" />
        </label>
        <label className="form-label">
          Date:
          <input type="date" name="date" value={competition.date} onChange={handleInputChange} className="form-input" />
        </label>
        <label>City:</label>
        <select name="city" value={competition.city.id} onChange={handleInputChange} className="form-select">
            <option value="">Select a city</option>
            {cities.map((city) => (
                <option key={city.id} value={city.id}>
                {city.name}
                </option>
            ))}
        </select>
        <button type="submit" className="form-button">Save competition</button>
      </form>
    );
  
}