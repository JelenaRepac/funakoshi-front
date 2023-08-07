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
import Competition from "./components/Competitions";
import CompetitionEntry from "./components/CompetitionEntry";
import CompetitionEntryByCompetition from "./components/CompetitionEntryByCompetition";
import UserService from "./services/UserService";
function App() {

  const[isLoggedIn, setLoggedIn]= useState(false);
  const [loggedUser, setLoggedUser]=useState();
  const [loggedTrainer, setTrainer] = useState(); 

  const handleLogin = async (loggedUser) => {
    setLoggedUser(loggedUser);
    setLoggedIn(true);
  };
  const handleLogout = async () => {
    const shouldLogout = await logoutQuestionPopUpAsync();
    if (shouldLogout) {
      setLoggedIn(false);
      setTrainer();
    }
   
  };
  const getTrainers = async () => {
    try {
      const dbTrainers = await UserService.getTrainersAsync();
      if (dbTrainers) {
        const logged = dbTrainers.find(trainer => trainer.username === loggedUser);
        if (logged) {
          const trainer = logged.firstname + " " + logged.lastname;
          setTrainer(trainer);
        }
      } else {
        console.error("No trainers data available.");
      }
    } catch (error) {
      console.error("Error fetching trainers data:", error);
    }
  };
  useEffect(() => {
    console.log(loggedUser);
    const fetchData = async () => {
      try {
        if (isLoggedIn) {
        getTrainers();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    fetchData();
  },[loggedUser]);
 



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
          <Route path="/competitions" element={<Competition />} />
          <Route path="/competitionEntries" element ={<CompetitionEntry/>} />
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
