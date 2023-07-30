import FileDefiniton from "../model/FileDefinition";
const FILE_API ="http://localhost:5165/api/file/upload";

export default class FileService {
    
    static async saveFileAsync(file){
      const token = localStorage.getItem("token");
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `${token}`,
        },
        body: file
      }
      
      const response = await fetch(FILE_API, requestOptions);
      const responseJson = await response.json();
      return responseJson;
    }
}
