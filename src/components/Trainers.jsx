
import UserService from "../services/UserService";
import "../css/Trainers.css";
import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
export default function Trainers(){
    const[trainers, setTrainers]= useState([]);
    
    const getAllTrainers = async () => {
      const dbTrainers = await UserService.getTrainersAsync();
      if (dbTrainers !== null) {
        setTrainers(dbTrainers);
      }
    };
    useEffect(() => {
      getAllTrainers();
    },[]);
  
   
    return(
        <div>
        <table className="table-container">
        <thead>
        <tr>
            <th>Firstname</th>
            <th>Lastname</th>
            <th>Username</th>
            <th>Email</th>
        </tr>
        </thead>
        <tbody>
        {trainers.map((trainer, index) => (
            <tr
            key={index}
            >
            <td>{trainer.firstname}</td>
            <td>{trainer.lastname}</td>
            <td>{trainer.username}</td>
            <td>{trainer.email}</td>
            </tr>
        ))}
        </tbody>
    </table>
    </div>
    )
}