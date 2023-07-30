import React, { useState, useEffect } from "react";
import MemberService from "../services/MemberService";
import "../css/MembershipFee.css";
import Members from "./Members";
import "react-calendar/dist/Calendar.css";
import MembershipFeesDefinition from "../model/MembershipFeesDefinition";

const MembershipFees = () => {

  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [membershipFeesDefinition, setMembershipFees] = useState([]);
  const [feesForPopup, setFees] = useState([]);
  const [isOpened, setIsOpened] = useState(false);
  const [amount, setAmount] = useState(3000);
  const [selectedFeeDate, setSelectedFeeDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [searchValue, setSearchValue] = useState(""); 
  const [month, setMonth] = useState("");
  
  
  useEffect(() => {
    fetchMembers();
  }, [searchValue, selectedMember]);

  const fetchMembers = async () => {
    try {
      const members = await MemberService.getMembersAsync();
      setMembers(members);
      if (members !== null) {
        const filteredMembers = members.filter((member) => {
          const firstname = member.firstname;
          const lastname = member.lastname;
          return (
            firstname.toLowerCase().includes(searchValue.toLowerCase()) ||
            lastname.toLowerCase().includes(searchValue.toLowerCase())
          );
        });
        setMembers(filteredMembers);
      }
    } catch (error) {
      console.log("Error occurred while fetching members:", error);
    }
  };

  const closeFee = () => {
    setIsOpened(false);
  };

  
  function getMonths(year) {
    const months = [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ];
  
    if (year) {
      return months;
    } else {
      const currentYear = new Date().getFullYear();
      if (year < currentYear) {
        return [];
      } else if (year === currentYear) {
        const currentMonth = new Date().getMonth();
        return months.slice(currentMonth);
      } else {
        return months;
      }
    }
  }
  
  const getCurrentMonth = () => {
    return new Date().toLocaleString("default", { month: "long" });
  };

  const getStartMonth = (startDate) => {
    return new Date(startDate).toLocaleString("default", { month: "long" });
  };

  const isMembershipFeePaid = (month) => {
    return membershipFeesDefinition.some((fee) => fee.month === month);
  };
  

  const handlePopUp = () => {
    setIsOpened(!isOpened);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleFeeDateChange = (date) => {
    setSelectedFeeDate(date);
  };

  const handleMonthChange = (month) => {
    const selectedMonth = month;
    setMonth(selectedMonth);
  };
  
  const saveMembershipFee = async () => {
    try {
      const membershipFee = new MembershipFeesDefinition(
        null,
        amount,
        selectedFeeDate,
        month,
        { ...selectedMember }
      );
      
      const updatedMembershipFees = [...membershipFeesDefinition, membershipFee];
      const updatedMember = {
        ...selectedMember,
        membershipFeesDefinition: updatedMembershipFees,
      };
       const response = await MemberService.updateMemberAsync(updatedMember);
       const dbMember = await MemberService.getMembershipFeesForMember(updatedMember.id);
       setSelectedMember(dbMember);
       setMembershipFees(dbMember.membershipFeesDefinition);
       setAmount(3000);
       setSelectedFeeDate(new Date().toISOString().split("T")[0]);
       setMonth("");
   
       setIsOpened(false);
  
    } catch (error) {
      console.log("Error occurred while saving membership fee:", error);
    }
  };

  const calculateTotalDebt = (member) => {
    if (!member) return 0;

    const startMonth = getStartMonth(member.dateOfMembership);
    const currentMonth = getCurrentMonth();
    const months = getMonths();

    const unpaidMonths = months
      .slice(months.indexOf(startMonth), months.indexOf(currentMonth) + 1)
      .filter((month) => !isMembershipFeePaid(month));

    return unpaidMonths.length * 3000;
  };


  const isUnpaidMonthStartingFromMembership = (month) => {
    const startMonth = getStartMonth(selectedMember.dateOfMembership);
    const months = getMonths();
    const startIndex = months.indexOf(startMonth);
    const monthIndex = months.indexOf(month);

    return monthIndex >= startIndex && !isMembershipFeePaid(month);
  };

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
      setSelectedMember={setSelectedMember}
      setMembershipFees={setMembershipFees}
      isFees={true}
    />
    {selectedMember && (
      <div className="membership-details">
        <div className="membership-card">
          <div className="membership-header">
            <h2>
              {selectedMember?.firstname} {selectedMember?.lastname}
            </h2>
           
          </div>
          <div className="membership-body">
            <p>Date of membership: {selectedMember.dateOfMembership}</p>
            <p>Debt: {calculateTotalDebt(selectedMember)}</p>
          </div>
          <div className="membership-table">
            <table className="fees-table">
              <thead>
                <tr>
                  <th>Month</th>
                  {getMonths().map((month) => (
                    <th
                    >
                      {month}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Amount</td>
                  {getMonths().map((month) => (
                    <td
                      key={month}
                      className={
                        isUnpaidMonthStartingFromMembership(month)
                          ? "unpaid-month"
                          : ""
                      }
                    >
                      {isMembershipFeePaid(month) ? "3000 rsd" : "/"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>Paid?</td>
                  {getMonths().map((month) => (
                    <td key={month}>
                      <input
                        type="checkbox"
                        checked={isMembershipFeePaid(month)}
                        onChange={handlePopUp}
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )}
      {isOpened && (
        <div className="popup-container-newFee">
          <div className="popup-content-newFee" style={{ height: "250px" }}>
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
              <label>For month:</label>
              <select
                className="form-select"
                  name="month"
                  value={month}
                  onChange={(e) => handleMonthChange(e.target.value)}
                >
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </select>
              <button
                type="button"
                className="button-add-membershipFee"
                onClick={saveMembershipFee}
              >
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