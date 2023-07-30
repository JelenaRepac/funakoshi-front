const COMPETITOR_API = "http://localhost:5165/api/competitor/";
export default class CompetitorService {
  static async updateCompetitorAsync(competitor) {
    console.log(competitor);
    const token = localStorage.getItem("token");
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify({
        id: competitor.id,
        category: competitor.category,
        discipline: competitor.discipline,
        medals: competitor.medals,
        goldMedals: competitor.goldMedals,
        silverMedals: competitor.silverMedals,
        bronzeMedals: competitor.bronzeMedals,
        classCategory: competitor.classCategory,
        team: competitor.team,
      }),
    };
    console.log(requestOptions);
    const response = await fetch(COMPETITOR_API, requestOptions);
    const responseJson = await response.json();
    return responseJson;
  }

  static async saveCompetitorAsync(competitor) {
    const token = localStorage.getItem("token");
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify({
        category: competitor.category,
        discipline: competitor.discipline,
        medals: competitor.medals,
        goldMedals: competitor.goldMedals,
        silverMedals: competitor.silverMedals,
        bronzeMedals: competitor.bronzeMedals,
        classCategory: competitor.classCategory,
        team: competitor.team,
      }),
    };
    const response = await fetch(COMPETITOR_API, requestOptions);
    const responseJson = await response.json();
    return responseJson;
  }

 
}
