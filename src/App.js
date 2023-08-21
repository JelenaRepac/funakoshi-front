import { BrowserRouter, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import React,{useState, useEffect, useLayoutEffect} from "react";
import Login from "./components/auth/Login";
import '../src/css/App.css';
import Registration from "../src/components/auth/Registration";
import Home from "../src/components/Home";
import Sidebar from "./components/Sidebar";
import Trainers from "./components/Trainers";
import {
  logoutQuestionPopUpAsync
} from "../src/popups/SwalPopUp";
import MembershipFees from "./components/MembershipFees";
import Competitions from "./components/Competitions";
import CompetitionEntryByCompetition from "./components/CompetitionEntryByCompetition";
import UserService from "./services/UserService";
import CompetitionEntries from "./components/CompetitionEntries";
function App() {

  const[isLoggedIn, setLoggedIn]= useState(false);
  const [loggedUser, setLoggedUser]=useState('');
  const [loggedTrainer, setTrainer] = useState(); 

  const handleLogin = async (loggedUser) => {
    getTrainers();
    setLoggedUser(loggedUser);
    setLoggedIn(true);
  };
  const handleLogout = async () => {
    const shouldLogout = await logoutQuestionPopUpAsync();
    if (shouldLogout) {
      setLoggedIn(false);
      setTrainer();
      setLoggedUser('');
    }
   
  };
  const getTrainers = async () => {
    try {
      const dbTrainers = await UserService.getTrainersAsync();
      if (dbTrainers && Array.isArray(dbTrainers)) { // Check if dbTrainers is an array
        const logged = dbTrainers.find(trainer => trainer.username === loggedUser);
        if (logged) {
          const trainer = logged.firstname + " " + logged.lastname;
          setTrainer(trainer);
        } else {
          setTrainer(""); // Set to an empty string if no matching trainer is found
        }
      } else {
        console.error("Invalid trainers data:", dbTrainers);
      }
    } catch (error) {
      console.error("Error fetching trainers data:", error);
    }
  };
  useEffect(() => {
    console.log(loggedUser);
    const fetchData = async () => {
      try {
        if (isLoggedIn && loggedUser) {
          await getTrainers(); // Wait for the getTrainers function to complete
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [isLoggedIn, loggedUser]);

  if(isLoggedIn){
    return (
      <BrowserRouter>
      <div className="logged-in-trainer" onClick={handleLogout} style={{cursor:"pointer"}}>
      {loggedTrainer}
      </div>
      <Sidebar 
      onLogout={handleLogout}>
      </Sidebar>
        <Routes>
          <Route path="/" element={<Home   loggedUser={loggedUser}/>} />
          <Route path="/trainers" element={<Trainers   />} />
          <Route path="/membershipFees" element={<MembershipFees />} />
          <Route path="/competitions" element={<Competitions />} />
          <Route path="/competitionEntries" element ={<CompetitionEntries/>} />
          <Route path="/competitionEntries/competition" element ={<CompetitionEntryByCompetition/>} />
          <Route path="/*" element={<Navigate to="/registration" />} />
        </Routes>
      </BrowserRouter> 
    )
  }
  else{
    return (
      <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/registration" element={<Registration/>} />
            <Route path="/*" element={<Navigate to="/login" />} />
          </Routes>
        </BrowserRouter> 
    )
  }
}

export default App;
