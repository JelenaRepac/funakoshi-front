import React, {useState}from 'react';
import { Link } from 'react-router-dom';
import "../css/Sidebar.css";

export default function Sidebar(props) {
    const onLogout= props.onLogout;
    const [isExpanded, setIsExpanded] = useState(false);

    const handleMouseEnter = () => {
      setIsExpanded(true);
    };
  
    const handleMouseLeave = () => {
      setIsExpanded(false);
    };
  
    return (
      <div
        className={`navbar ${isExpanded ? 'expanded' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
      {isExpanded &&
        <div>
        <div className="image-container">
          <img src="logo-modified.jpg" alt="img" className="image" />
        </div>
        <ul>
        <Link className="link" to={"/"}><li>Home</li></Link>
        <Link className='link' to={"/membershipFees"}><li>Membership fee</li></Link>
        <Link className="link" to={"/competitions"}> <li> Competitions</li></Link>
        {/* <Link className="link" to={"/competitionEntries"}> <li> Competitors</li></Link> */}
        <Link className="link" to={"/results"}><li>Results</li></Link>
        <Link className="link" to={"/trainers"}> <li> Trainers</li></Link>
        <div className="logout-container">
          <li  onClick={onLogout}>Logout</li>
        </div>
        </ul> 
      </div>
      }
      
    
    </div>
  );
}