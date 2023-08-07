import CityDefinition from "../model/CityDefinition";
import CompetitionDefinition from "../model/CompetitionDefinition";
import CompetitorDefinition from "../model/CompetitorDefinition";
import ResultMemberDefinition from "../model/ResultMemberDefinition";
const RESULT_MEMBER_GET_ALL = "http://localhost:5165/api/memberResult";
const RESULT_MEMBER="http://localhost:5165/api/memberResult";
const RESULT_MEMBER_GET_ALL_BY_COMPETITION="http://localhost:5165/api/memberResult/competition/id/";
export default class ResultMemberService {

    static async getAllResultsMemberAsync(){
        const token = localStorage.getItem("token");
        const requestOptions = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        };
        const response = await fetch(RESULT_MEMBER_GET_ALL, requestOptions);
        const responseJson = await response.json();
        console.log(responseJson);
          const results = responseJson.responseData.map((responseData) => {
            return new ResultMemberDefinition(
              responseData.id,
              responseData.category,
              responseData.medal,
              new CompetitionDefinition(
                responseData.competition.id,
                responseData.competition.competitionHall,
                responseData.competition.date,
                responseData.competition.name,
                new CityDefinition(
                    responseData.competition.city.id,
                    responseData.competition.city.name,
                    responseData.competition.city.ptt
                )
              ),
              new CompetitorDefinition(
                responseData.competitor.id,
                responseData.competitor.category,
                responseData.competitor.discipline,
                responseData.competitor.medals,
                responseData.competitor.goldMedals,
                responseData.competitor.silverMedals,
                responseData.competitor.bronzeMedals
              )
            );
          });
          console.log(results);
          return results;
    }
    static async getAllResultsMemberForCompetitionAsync(id){
      const token = localStorage.getItem("token");
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      };
      const response = await fetch(RESULT_MEMBER_GET_ALL_BY_COMPETITION+id, requestOptions);
      const responseJson = await response.json();
      console.log(responseJson);
        const results = responseJson.responseData.map((responseData) => {
          return new ResultMemberDefinition(
            responseData.id,
            responseData.category,
            responseData.medal,
            new CompetitionDefinition(
              responseData.competition.id,
              responseData.competition.competitionHall,
              responseData.competition.date,
              responseData.competition.name,
              new CityDefinition(
                  responseData.competition.city.id,
                  responseData.competition.city.name,
                  responseData.competition.city.ptt
              )
            ),
            new CompetitorDefinition(
              responseData.competitor.id,
              responseData.competitor.category,
              responseData.competitor.discipline,
              responseData.competitor.medals,
              responseData.competitor.goldMedals,
              responseData.competitor.silverMedals,
              responseData.competitor.bronzeMedals
            )
          );
        });
        console.log(results);
        return results;
    }

    static async saveResultMember(result){
      const token = localStorage.getItem("token");
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type":"application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          competition: result.competitionDefinition,
          competitor: result.competitorDefinition,
          category: result.category,
          medal : result.medal
      })
      };
      const response = await fetch(RESULT_MEMBER, requestOptions);
      const responseJson = await response.json();
      console.log(responseJson);
      return responseJson;
    }
}