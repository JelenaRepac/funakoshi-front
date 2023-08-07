
import CompetitionEntryDefinition from "../../src/model/CompetitionEntryDefinition";
import CompetitorDefinition from "../model/CompetitorDefinition";
import CompetitionDefinition from "../model/CompetitionDefinition";
import CityDefinition from "../model/CityDefinition";
const COMPETITION_ENTRY_API ="http://localhost:5165/api/competitionEntries";
const COMPETITION_ENTRY_API_BY_COMPETITION ="http://localhost:5165/api/competitionEntries/competition/id/";
export default class CompetitionEntryService {
    

    static async saveCompetitionEntryAsync(competition, selectedMember){
      const token = localStorage.getItem("token");
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type":"application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          competition: competition,
          competitor: selectedMember.competitorDefinition
      })
      };
      const response = await fetch(COMPETITION_ENTRY_API, requestOptions);
      const responseJson = await response.json();
      console.log(responseJson);
      return responseJson;
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
      const response = await fetch(COMPETITION_ENTRY_API_BY_COMPETITION+id, requestOptions);
      const responseJson = await response.json();
        const entries = responseJson.responseData.map((responseData) => {
          return new CompetitionEntryDefinition(
            responseData.id,
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
        return entries;
  }

   
}
