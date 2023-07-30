import CompetitionEntryDefinition from "../model/CompetitionEntryDefinition";
import CompetitionDefinition from "../model/CompetitionDefinition";
import CompetitorDefinition from "../model/CompetitorDefinition";
const COMPETITION_ENTRY_API ="http://localhost:5165/api/competitionEntries";

export default class CompetitionEntryService {
    

    static async saveCompetitionEntryAsync(competition, selectedMember){
      console.log(competition);
      console.log(selectedMember);
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

   
}
