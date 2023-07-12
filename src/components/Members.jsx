
export default function Members(props) {
 const members = props.members;

 const handleMemberClick = (member) => {
    if(props.isFees){
      props.setSelectedMember(member);
      props.setMembershipFees(member.membershipFeesDefinition);
    }
    else{
    props.setSelectedMember(member);
    }
  };
    return (
        
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
              
              {!props.isFees &&
                <>
                <th></th>
                <th></th>
                </>
              }
              
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr
                key={index}
                
              >
                <td>{index+1}</td>
                <td  style={{ cursor: "pointer" }} onClick={() => handleMemberClick(member)}>{member.firstname}</td>
                <td>{member.lastname}</td>
                <td>{member.birthday}</td>
                <td>{member.mothersName}</td>
                <td>{member.fathersName}</td>
                <td>{member.cityDefinition.name}</td>
                <td>{member.adress}</td>
                <td>{member.dateOfMembership}</td>
               
               {!props.isFees && 
               <>
               <td><button onClick={() =>props.openEditMemberForm(member)} className="button"> Edit</button></td>
               <td><button onClick={()=>props.deleteMember(member)} style={{width:"100px"}} className="button">Delete member</button></td>
               </>
               }
                </tr>
            ))}
          </tbody>
        </table>
 
    )
}