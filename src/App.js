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

function App() {

  const[isLoggedIn, setLoggedIn]= useState(false);
  
  const handleLogin = async (loggedUser) => {
    console.log(loggedUser);
    setLoggedIn(true);
  };
  const handleLogout = async () => {
    const shouldLogout = await logoutQuestionPopUpAsync();
    
    if (shouldLogout) {
      setLoggedIn(false);
    }
   
  };


  if(isLoggedIn){
    return (
      <BrowserRouter>
      <Sidebar 
      onLogout={handleLogout}>
      </Sidebar>
        <Routes>
          <Route path="/" element={<Home   />} />
          <Route path="/trainers" element={<Trainers   />} />
          <Route path="/membershipFees" element={<MembershipFees />} />
          <Route path="/competitions" element={<Competition />} />
          <Route path="/competitionEntries" element ={<CompetitionEntry/>} />
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
