import React, { useState } from "react";
import CompetitionService from "../../services/CompetitionService";
import { updatedCompetitionSuccessfullyPopUp, errorOccurredPopUp } from '../../popups/SwalPopUp';

export default function EditCompetitionForm(props) {
  const cities = props.cities;
  const competition = props.competition;
  const[name, setName] = useState(competition.name);
  const[competitionHall, setCompetitionHall] = useState(competition.competitionHall);
  const[date, setDate] = useState(competition.date);
  const[selectedCity, setSelectedCity] = useState(competition.cityDefinition);

  const handleCityChange = (e) => {
    const selectedCityId = parseInt(e.target.value);
    const city = cities.find((city) => city.id === selectedCityId);
    console.log(city);
    setSelectedCity(city);
  };
  const handleSave = () => {
    
    const updatedCompetition = {
      ...competition,
      name: name,
      competitionHall: competitionHall,
      date: date,
      cityDefinition: selectedCity
    };
    console.log(updatedCompetition);
    updateCompetition(updatedCompetition);
  };
  const updateCompetition = async (updatedCompetition) => {

    try{
    const response = await CompetitionService.updateCompetitionAsync(
        updatedCompetition
    );
    props.setCompetitionEdited(updatedCompetition);
    props.setCompetitionEditFormOpened(false);
    updatedCompetitionSuccessfullyPopUp();
    }catch(error){
      errorOccurredPopUp("Can't update competition informations!");
    }
  };

  return (
    <form  className='form-member'>
      <label className="form-label">
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-input"
        />
      </label>
      <label className="form-label">
        Competition hall:
        <input
          type="text"
          value={competitionHall}
          onChange={(e) => setCompetitionHall(e.target.value)}
          className="form-input"
        />
      </label>
      <label className="form-label">
        Date:
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="form-input"
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
      <button type="button"  className="form-button" onClick={handleSave}>Update competition</button>
    </form>
  );
}
