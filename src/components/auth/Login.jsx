import React, { useState } from "react";
import "../../../src/css/Login.css";
import { Link } from "react-router-dom";
import UserService from "../../services/UserService";
import { useNavigate } from "react-router-dom";

import {
  errorOccurredPopUp,
} from "../../popups/SwalPopUp";
export default function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate= useNavigate();
  const onLogin = props.onLogin;

  const loginAsync = async function () {
    try{
    const responseJson = await UserService.loginAsync({ username, password });
    
    if(responseJson!=null){
      console.log(responseJson);
      const loggedUser= responseJson.userDetails.username;
      if (loggedUser != null) {
        onLogin(loggedUser);
        navigate("/");
      }
    }
   
  }catch(error){
    errorOccurredPopUp('Check if the server is running!');
    console.log(`Error: ${error}`);
  }
  };

  const linkStyle = {
    color: '#263238'
  };

  return (
    <div className="container">
    <div className="login-background">
      <div className="login-wrapper">
        <h1>Log In</h1>
        <label>
          <p>Username</p>
          <input
            name="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>
        <label>
          <p>Password</p>
          <input
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <button onClick={loginAsync} className="button-28">
          Submit
        </button>
        <p className="register-p">Don't have an account?</p>
        <p> <Link to={'/registration'} style={linkStyle}>Click here to register!</Link></p>

      </div>
    </div>
    <img src="logo-modified.jpg" alt="img" className="right-image" />
     </div>
  );
}
