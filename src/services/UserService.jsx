import TrainerDefinition from "../model/TrainerDefinition";
import {
    invalidFirstnamePopUp,
    invalidUsernamePopUp,
    invalidPasswordPopUp,
    invalidConfirmPasswordPopUp,
    invalidEmailPopUp,
    errorOccurredPopUp,
    successToastPopUp,
  } from "../popups/SwalPopUp";
const LOGIN_API_URL= "http://localhost:5165/api/trainer/login";
const REGISTER_API_URL= "http://localhost:5165/api/trainer/register";
const TRAINER_GET_ALL_API="http://localhost:5165/api/trainer";



export default class UserService {
    static validateFirstname(firstname){
        if (firstname.length < 3 || firstname.length > 40) {
            return false;
          }
          return true;
    }
    static validateUsername(username) {
        if (username.length < 3 || username.length > 40) {
          return false;
        }
        return true;
      }
      static validatePassword(password) {
        if (password.length < 8 || password.length > 40) {
          return false;
        }
        if (/[A-Z]/.test(password) === false) {
          return false;
        }
        if (/[a-z]/.test(password) === false) {
          return false;
        }
        if (/\d/.test(password) === false) {
          return false;
        }
        return true;
      }
      static validateEmail(email) {
        if (email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) === null) {
          return false;
        }
        return true;
      }
    
      static async loginAsync(user) {
        const { username, password } = user;
        if (this.validateUsername(username) === false) {
          invalidUsernamePopUp();
          return null;
        }
        if (this.validatePassword(password) === false) {
          invalidPasswordPopUp();
          return null;
        }

        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: user.username,
            password: user.password,
          }),
        };

        const response = await fetch(LOGIN_API_URL, requestOptions);
        const responseJson = await response.json(); 
        if (response.status === 200) {
          successToastPopUp("Login successfully");
          localStorage.setItem("token", responseJson.responseData[0]);
          return responseJson;
        }
        else{
            errorOccurredPopUp("Wrong credentials. Please try again!");
            return null;
          
        }
      }
    
      static async registerAsync(user) {
        const { firstname,lastname, username, email, password, confirmedPassword } = user;
        if (this.validateFirstname(firstname) === false) {
            invalidFirstnamePopUp();
            return null;
        }
        if (this.validateUsername(username) === false) {
          invalidUsernamePopUp();
          return null;
        }
        if (password !== confirmedPassword) {
          invalidConfirmPasswordPopUp();
          return null;
        }
        if (this.validatePassword(password) === false) {
          invalidPasswordPopUp();
          return null;
        }
        if (this.validateEmail(email) === false) {
          invalidEmailPopUp();
          return null;
        }
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: user.username,
            email: user.email,
            password: user.password,
            firstname: user.firstname,
            lastname: user.lastname
          })
        };
        const response = await fetch(REGISTER_API_URL, requestOptions);
        const responseJson = await response.json();
        if (response.ok === false) {
          errorOccurredPopUp(responseJson.message);
          return null;
        }
        successToastPopUp("Registered successfully");
        const dbUser = {
          username: responseJson.username,
          
        };
        return dbUser;
      }

      static async getTrainersAsync(){
        const token = localStorage.getItem("token");
        const requestOptions = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        };
        const response = await fetch(TRAINER_GET_ALL_API, requestOptions);
        const responseJson = await response.json();
      
          const trainers = responseJson.responseData.map((responseData) => {
            return new TrainerDefinition(
              responseData.firstname,
              responseData.lastname,
              responseData.username,
              responseData.email,
            );
          });
          return trainers;
      

      }
    }
