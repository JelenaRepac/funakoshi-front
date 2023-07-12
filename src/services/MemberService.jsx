import CityDefinition from "../model/CityDefinition";
import CompetitorDefinition from "../model/CompetitorDefinition";
import MemberDefinition from "../model/MemberDefinition";
import MembershipFeesDefinition from "../model/MembershipFeesDefinition";

const MEMBER_GET_ALL_API="http://localhost:5165/api/member";
const MEMBER_API ="http://localhost:5165/api/member/";
const MEMBER_GET_ALL_BY_COMPETITOR_API="http://localhost:5165/api/member/competitor/id/";
export default class MemberService {
  
    static async getMembersAsync(){
        const token = localStorage.getItem("token");
        const requestOptions = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        };
        const response = await fetch(MEMBER_GET_ALL_API, requestOptions);
        const responseJson = await response.json();
        const members = responseJson.responseData.map((responseData) => {
          const competitor = responseData.competitor ? new CompetitorDefinition(
            responseData.competitor.id,
            responseData.competitor.category,
            responseData.competitor.discipline,
            responseData.competitor.medals,
            responseData.competitor.goldMedals,
            responseData.competitor.silverMedals,
            responseData.competitor.bronzeMedals,
            responseData.competitor.classCategory
          ) : null;
        
          const membershipFees = responseData.membershipFees ? responseData.membershipFees.map((fee) => {
            return new MembershipFeesDefinition(
              fee.id,
              fee.amount,
              fee.date,
              fee.member
            );
          }) : null;
          
          const city = responseData.city ? new CityDefinition(
              responseData.city.id,
              responseData.city.name,
              responseData.city.ptt
          ) : null;
          return new MemberDefinition(
            responseData.id,
            responseData.name,
            responseData.lastname,
            responseData.birthday,
            responseData.mothersName,
            responseData.fathersName,
            responseData.gender,
            responseData.adress,
            city,
            responseData.belt,
            responseData.dateOfMembership,
            responseData.totalDebt,
            competitor,
            membershipFees
          );
        });
          return members;
    }

    static async deleteMemberAsync(memberId){
      const token = localStorage.getItem("token");
      const requestOptions = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      };
      const response = await fetch(MEMBER_API+memberId, requestOptions);
      const responseJson = await response.json();
      console.log(responseJson);
    }

    static async saveMemberAsync(member){
      console.log(member);
      const token = localStorage.getItem("token");
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type":"application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          "name":member.name,
          "lastname": member.lastname,
          "mothersName": member.mothersName,
          "fathersName": member.fathersName,
          "gender":member.gender,
          "adress": member.adress,
          "birthday":member.birthday,
          "dateOfMembership": member.dateOfMembership,
          "city":member.city,
          "totalDebt":member.totalDebt,
          "belt": member.belt
      })
      };
      const response = await fetch(MEMBER_API, requestOptions);
      const responseJson = await response.json();
      return responseJson;
    }

    static async updateMemberAsync(member){
      const token = localStorage.getItem("token");
      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type":"application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          "id":member.id,
          "name":member.firstname,
          "lastname": member.lastname,
          "birthday":member.birthday,
          "mothersName": member.mothersName,
          "fathersName": member.fathersName,
          "adress": member.adress,
          "city":member.cityDefinition,
          "belt": member.belt,
          "dateOfMembership": member.dateOfMembership,
          "gender": member.gender,
          "totalDebt":member.totalDebt,
          "membershipFees":member.membershipFeesDefinition,
          "competitor": member.competitorDefinition
      })
      }
      const response = await fetch(MEMBER_API, requestOptions);
      const responseJson = await response.json();
      return responseJson;
    }

    static async fetchMemberDataForCompetitorId(competitorId) {
      const token = localStorage.getItem("token");
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      };
      const response = await fetch(MEMBER_GET_ALL_BY_COMPETITOR_API + competitorId, requestOptions);
      const responseJson = await response.json();
      console.log(responseJson);
    
      const responseData = responseJson.responseData;
      if (!responseData) {
        throw new Error("Member data not found");
      }
    
      const competitor = responseData.competitor ? new CompetitorDefinition(
        responseData.competitor.id,
        responseData.competitor.category,
        responseData.competitor.discipline,
        responseData.competitor.medals,
        responseData.competitor.goldMedals,
        responseData.competitor.silverMedals,
        responseData.competitor.bronzeMedals,
        responseData.competitor.classCategory
      ) : null;
    
      const membershipFees = responseData.membershipFees ? responseData.membershipFees.map((fee) => {
        return new MembershipFeesDefinition(
          fee.id,
          fee.amount,
          fee.date,
          fee.member
        );
      }) : null;
    
      const city = responseData.city ? new CityDefinition(
        responseData.city.id,
        responseData.city.name,
        responseData.city.ptt
      ) : null;
    
      return new MemberDefinition(
        responseData.id,
        responseData.name,
        responseData.lastname,
        responseData.birthday,
        responseData.mothersName,
        responseData.fathersName,
        responseData.gender,
        responseData.adress,
        city,
        responseData.belt,
        responseData.dateOfMembership,
        responseData.totalDebt,
        competitor,
        membershipFees
      );
    }
}
