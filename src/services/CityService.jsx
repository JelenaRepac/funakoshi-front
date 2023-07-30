import CityDefinition from "../model/CityDefinition";
const CITY_GET_ALL_API="http://localhost:5165/api/city";


export default class CityService {
    
    static async getAllCitiesAsync(){
        const token = localStorage.getItem("token");
        const requestOptions = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        };
        const response = await fetch(CITY_GET_ALL_API, requestOptions);
        const responseJson = await response.json();
        console.log(responseJson);
          const cities = responseJson.responseData.map((responseData) => {
            return new CityDefinition(
              responseData.id,
              responseData.name,
              responseData.ptt
            );
          });
          return cities;
    }

    

    
}
