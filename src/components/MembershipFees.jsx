import React, { useState, useEffect } from "react";
import MemberService from "../services/MemberService";
import "../css/MembershipFee.css";
import Members from "./Members";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import MembershipFeesDefinition from "../model/MembershipFeesDefinition";
import MemberDefinition from "../model/MemberDefinition";

const MembershipFees = () => {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [membershipFeesDefinition, setMembershipFees] = useState([]);
  const [isOpened, setIsOpened] = useState(false);
  const [amount, setAmount]= useState(3000);
  const [selectedFeeDate, setSelectedFeeDate] = useState(new Date().toISOString().split("T")[0]);
  const [totalDebt, setTotalDebt] = useState();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const members = await MemberService.getMembersAsync();
      setMembers(members);
    } catch (error) {
      console.log("Error occurred while fetching members:", error);
    }
  };

  const closeFees = () => {
    setSelectedMember(null);
    setMembershipFees([]);
  };

  const closeFee = () =>{
    setIsOpened(false);
  }
  const getMonths = () => {
    return [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
  };

  const getCurrentMonth = () => {
    return new Date().toLocaleString("default", { month: "long" });
  };

  const getStartMonth = (startDate) => {
    return new Date(startDate).toLocaleString("default", { month: "long" });
  };

  const isMembershipFeePaid = (month) => {
    const membershipFees = selectedMember.membershipFeesDefinition;
    return membershipFees.some((fee) => {
      const feeMonth = new Date(fee.date).toLocaleString("default", { month: "long" });
      return feeMonth === month;
    });
  };


  const getCellStyle = (month) => {
  if (month === getCurrentMonth()) {
    return { backgroundColor: "#C0B7B1" };
  } else if (
    selectedMember &&
    month === getStartMonth(selectedMember.dateOfMembership)
  ) {
    // return { backgroundColor: "lightgreen" };
  }if (
    selectedMember &&
    !isMembershipFeePaid(month) &&
    isMonthBetweenMembership(month)
  ) {
    return { color: "red" };
  }
  return null;
};

const isMonthBetweenMembership = (month) => {
  const startMonth = getStartMonth(selectedMember.dateOfMembership);
  const currentMonth = getCurrentMonth();
  const months = getMonths();

  const startIndex = months.indexOf(startMonth);
  const currentIndex = months.indexOf(currentMonth);
  const monthIndex = months.indexOf(month);

  return monthIndex >= startIndex && monthIndex <= currentIndex;
};
  const months = getMonths();
  const handlePopUp =() =>{
    setIsOpened(true);
  }

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleFeeDateChange = (date) => {
    setSelectedFeeDate(date);
  };

  const saveMembershipFee = async () => {
    const clonedMember = { ...selectedMember };

    const membershipFees = clonedMember.membershipFeesDefinition;

    delete clonedMember.membershipFeesDefinition;
    const membershipFee = new MembershipFeesDefinition(
      null,
      amount,
      selectedFeeDate,
      { ...clonedMember } 
    );
  
    clonedMember.membershipFeesDefinition = membershipFees;
    clonedMember.membershipFeesDefinition.push(membershipFee);
  
    const response = await MemberService.updateMemberAsync(clonedMember);
    console.log(response);
    setIsOpened(false);
  };

  const calculateTotalDebt = (member) => {
    if (!member) return 0;

    const startMonth = getStartMonth(member.dateOfMembership);
    const currentMonth = getCurrentMonth();
    const months = getMonths();

    const unpaidMonths = months.slice(months.indexOf(startMonth), months.indexOf(currentMonth) + 1)
      .filter((month) => !isMembershipFeePaid(month));

    return unpaidMonths.length * 3000
  };
  return (
    <div className="members-wrapper">
      <Members
        members={members}
        setSelectedMember={setSelectedMember}
        setMembershipFees={setMembershipFees}
        isFees={true}
      />
   {selectedMember && (
  <div className="popup-container-membershipFee">
    <div className="popup-content-membershipFee">
      <button className="close-button-container" onClick={closeFees}>
        X
      </button>
      <h2>
        {selectedMember?.firstname} {selectedMember?.lastname}
      </h2>
      <p>Date of membership: {selectedMember.dateOfMembership}</p>
      <p>Debt: {calculateTotalDebt(selectedMember)}</p>
      <table className="fees-table">
        <thead>
          <tr>
            <th >Month</th>
            {months.map((month) => (
              <th key={month}>{month}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Amount</td>
            {months.map((month) => (
              <td key={month}>
                <input
                  type="text"
                  readOnly
                  value={isMembershipFeePaid(month) ? "3000 rsd" : "/"}
                />
              </td>
            ))}
          </tr>
          <tr>
            <td>Paid?</td>
            {months.map((month) => (
              <td key={month}>
                <input
                  type="checkbox"
                  color="black"
                  readOnly
                  checked={isMembershipFeePaid(month)}
                  onClick={handlePopUp}
                />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  </div>
)}

    {isOpened && (
        <div className="popup-container-newFee">
          <div className="popup-content-newFee" style={{height:"250px"}}>
            <button className="close-button-newFee" onClick={closeFee}>
              X
            </button>
            <form>
              <label>Amount</label>
              <input
                type="text"
                value={amount}
                onChange={handleAmountChange}
              />
              <label>Date</label>
              <input
                type="date"
                value={selectedFeeDate} 
                onChange={(e) => handleFeeDateChange(e.target.value)}
             />
              <button type="button" className="button-add-membershipFee"
              onClick ={saveMembershipFee} >
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipFees;
