import React, { useState } from "react";
import UserService from "../../services/UserService";
import "../../css/Registration.css";
import { Link } from "react-router-dom";

export default function Register() {
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");

  const registerAsync = async function () {
    const dbUser = await UserService.registerAsync({
      firstname,
      lastname,
      username,
      email,
      password,
      confirmedPassword,
    });
    console.log(dbUser);
  };

  const linkStyle = {
    color: '#263238'
  };

  return (
    <div className="registration-body">
      <div className="popcorn">
        <div className="registration-wrapper">
          <h1>Welcome!</h1>
          <label>
            <p>Firstname</p>
            <input
              name="firstname"
              type="text"
              value={firstname}
              onChange={(event) => setFirstname(event.target.value)}
              required
            />
          </label>
          <label>
            <p>Lastname</p>
            <input
              name="lastname"
              type="text"
              value={lastname}
              onChange={(event) => setLastname(event.target.value)}
              required
            />
          </label>
          <label>
            <p>Username</p>
            <input
              name="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </label>
          <label>
            <p>Email</p>
            <input
              name="email"
              type="text"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            <p>Password</p>
            <input
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          <label>
            <p>Confirm password</p>
            <input
              name="password"
              type="password"
              value={confirmedPassword}
              onChange={(event) => setConfirmedPassword(event.target.value)}
              required
            />
          </label>
          <button onClick={registerAsync} className="button-28">
            Register
          </button>
          <p className="register-p">Already have an account?</p>
          <p> <Link to={'/login'} style={linkStyle}>Click here to login!</Link></p>
        </div>
      </div>
    </div>
  );
}
