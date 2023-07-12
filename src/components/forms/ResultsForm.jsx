
import "../../css/ResultForm.css";
export default function ResultsForm(props){
  
    const results = props.results;
    return (
        <div>
      <table className="results-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Lastname</th>
            <th>Category</th>
            <th>Medal</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result,index) => (
            <tr key={result.id}>
              <td>{index + 1}</td>
              <td>{result.member.firstname}</td>
              <td>{result.member.lastname}</td>
              <td>{result.category}</td>
              <td>{result.medal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    );
   
}