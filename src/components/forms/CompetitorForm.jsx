

export default function Competitor(props){
    const member = props.member;
    const closePopUp = () => {
        props.setSelectedMember(null);
    };

    return (
        <>
        <h2>{member.firstname} {member.lastname}</h2>
        <p>Date of membership: {member.dateOfMembership}</p>
        
        <table style={{width:"300px"}}>
        <tbody>
            <tr>
            <td>Discipline</td>
            <td>{member.competitorDefinition.discipline}</td>
            </tr>
            <tr>
            <td>Category</td>
            <td>{member.competitorDefinition.category}</td>
            </tr>
            <tr>
            <td>Class category</td>
            <td>{member.competitorDefinition.classCategory}</td>
            </tr>
            <tr>
            <td>Medals</td>
            <td>{member.competitorDefinition.medals}</td>
            </tr>
            <tr>
            <td>Gold medals</td>
            <td>{member.competitorDefinition.goldMedals}</td>
            </tr>
            <tr>
            <td>Silver medals</td>
            <td>{member.competitorDefinition.silverMedals}</td>
            </tr>
            <tr>
            <td>Bronze medals</td>
            <td>{member.competitorDefinition.bronzeMedals}</td>
            </tr>
           
        </tbody>
        </table>

        
        <button onClick={closePopUp} className="close-button-member" style={{width:"100px"}}>X</button>

        </>
    );
}