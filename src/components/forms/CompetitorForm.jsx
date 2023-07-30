import React, { useEffect, useState } from "react";
import "../../css/Competitor.css";
import "../../services/CompetitorService";
import CompetitorService from "../../services/CompetitorService";
import CompetitorDefinition from "../../model/CompetitorDefinition";
import MemberService from "../../services/MemberService";

export default function Competitor(props) {
  const [isEditable, setIsEditable] = useState(false); // State to track the editable state
  const [isEdited, setEdited] = useState(false);
  const member = props.member;
  const [competitor, setCompetitor] = useState();

  const closePopUp = () => {
    props.setSelectedMember(null);
  };

  const handleEditClick = () => {
    setIsEditable(!isEditable);
    setEdited(true);

    const birthYear = new Date(member.birthday).getFullYear();
    let category = "";
    let classCategory = "";

    if (birthYear >= 2013) {
      category = "POLETARAC";
    } else if (birthYear >= 2011) {
      category = "PIONIR";
    } else if (birthYear >= 2009) {
      category = "NADE";
    } else if (birthYear >= 2007) {
      category = "KADET";
    } else if (birthYear >= 2005) {
      category = "JUNIOR";
    } else if (birthYear >= 2002) {
      category = "MLADJI_SENIOR";
    } else {
      category = "SENIOR";
    }

    if (
      category === "JUNIOR" ||
      category === "MLADJI_SENIOR" ||
      category === "SENIOR"
    ) {
      classCategory = "ABSOLUTE";
    } else {
      classCategory = "E";
    }

    setCompetitor((prevCompetitor) => ({
      ...prevCompetitor,
      category: category,
      classCategory: classCategory,
      discipline: "KATE",
    }));
  };

  useEffect(() => {
    if (member.competitorDefinition != null) {
      setCompetitor(
        new CompetitorDefinition(
          member.competitorDefinition.id,
          member.competitorDefinition.category,
          member.competitorDefinition.discipline,
          member.competitorDefinition.medals,
          member.competitorDefinition.goldMedals,
          member.competitorDefinition.silverMedals,
          member.competitorDefinition.bronzeMedals,
          member.competitorDefinition.classCategory,
          member.competitorDefinition.team
        )
      );
    } else {
      setCompetitor({
        id: null,
        category: "", 
        discipline: "", 
        medals: 0,
        goldMedals: 0, 
        silverMedals: 0, 
        bronzeMedals: 0, 
        classCategory: "", 
        team: "", 
      });
    }
    console.log(competitor);
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setCompetitor((prevCompetitor) => ({
      ...prevCompetitor,
      [name]: value,
    }));
  };
  const handleUpdateCompetitor = async () => {
    console.log(competitor);
    if (competitor.id != null) {
      const response = await CompetitorService.updateCompetitorAsync(
        competitor
      );
      props.handleTriger();
      console.log(response);
      
    } else {
      // const response = await CompetitorService.saveCompetitorAsync(competitor);
      //  console.log(response);
      const responseMember = await MemberService.updateMemberForCompetitor(
        member,
        competitor
      );
      console.log(responseMember);
      
    }
    
  };

  return (
    <div>
      <button onClick={closePopUp} className="close-button-competitor">
        X
      </button>
      <h2>
        {member.firstname} {member.lastname}
      </h2>
      <p>Date of birth: {member.birthday}</p>

      <table>
        <tbody>
          <tr>
            <td>Discipline</td>
            {isEditable ? (
              <td>
                <select
                  name="discipline"
                  value={competitor.discipline}
                  onChange={handleInputChange}
                >
                  <option value="KATE">KATE</option>
                  <option value="BORBE">BORBE</option>
                </select>
              </td>
            ) : (
              <td></td>
            )}
          </tr>
          <tr>
            <td>Category</td>
            {isEditable ? (
              <td>
                <select
                  name="category"
                  value={competitor.category}
                  onChange={handleInputChange}
                >
                  <option value="POLETARAC">POLETARAC</option>
                  <option value="PIONIR">PIONIR</option>
                  <option value="NADE">NADE</option>
                  <option value="KADET">KADET</option>
                  <option value="JUNIOR">JUNIOR</option>
                  <option value="MLADJI_SENIOR">MLADJI SENIOR</option>
                  <option value="SENIOR">SENIOR</option>
                </select>
              </td>
            ) : (
              <td></td>
            )}
          </tr>
          <tr>
            <td>Class category</td>
            {isEditable ? (
              <td>
                <select
                  name="classCategory"
                  value={competitor.classCategory}
                  onChange={handleInputChange}
                >
                  <option value="E">E</option>
                  <option value="D">D</option>
                  <option value="C">C</option>
                  <option value="B">B</option>
                  <option value="A">A</option>
                  <option value="ABSOLUTE">ABSOLUTE</option>
                </select>
              </td>
            ) : (
              <td></td>
            )}
          </tr>
        </tbody>
      </table>

      <button className="button-edit" onClick={handleEditClick}>
        Edit
      </button>
      {isEdited && (
        <button className="button-save" onClick={handleUpdateCompetitor}>
          Save
        </button>
      )}
    </div>
  );
}
