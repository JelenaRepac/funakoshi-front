import CityDefinition from "../model/CityDefinition";
import CompetitionDefinition from "../model/CompetitionDefinition";
const COMPETITION_GET_ALL_API="http://localhost:5165/api/competition";
const COMPETITION_API ="http://localhost:5165/api/competition";

export default class CompetitionService {
    
    static async getAllCompetitionAsync(){
        const token = localStorage.getItem("token");
        const requestOptions = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        };
        const response = await fetch(COMPETITION_GET_ALL_API, requestOptions);
        const responseJson = await response.json();
          const competitions = responseJson.responseData.map((responseData) => {
            const city = responseData.city ? new CityDefinition(
              responseData.city.id,
              responseData.city.name,
              responseData.city.ptt
          ) : null;
            return new CompetitionDefinition(
              responseData.id,
              responseData.competitionHall,
              responseData.date,
              responseData.name,
              city
            );
          });
          return competitions;
    }

    static async deleteCompetitionAsync(competitionId){
        const token = localStorage.getItem("token");
        const requestOptions = {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        };
        const response = await fetch(COMPETITION_API+competitionId, requestOptions);
        const responseJson = await response.json();
        
        return responseJson;
    }
    

    static async saveCompetitionAsync(competition){
      const token = localStorage.getItem("token");
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type":"application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          "name":competition.name,
          "competitionHall": competition.competitionHall,
          "date": competition.date,
          "city": competition.city
      })
      };
      const response = await fetch(COMPETITION_API, requestOptions);
      const responseJson = await response.json();
      return responseJson;
    }
}
