import React, { useState } from 'react';
import '../css/inputsCss/Login.css'; // Import the CSS file
import { useRef,useEffect } from 'react';
import PageNavigator from '../pages/PageNavigator';
function Login({upDateApproval,premissionRef}) {
  console.log("Login line 7")
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [goToFeed,  setGoToFeed] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [toReg, setToReg] = useState(false);  
  const approvToBrowse = useRef(false);
 
  useEffect(()=>{
    console.log("Login line 16")

    const condition = goToFeed;
    if(condition){
      premissionRef.current= true;
      upDateApproval(premissionRef.current);
      
    }
  });
 
  const handleValid = () =>{
    if (username !== '' && password !==''){
      setIsValid(true);
    }
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
    handleValid();
    setUsername('');
    setPassword('');
  };

  const handleLogin=()=>{
    if(approvToBrowse.current.valueOf){
      setGoToFeed(true);
    }
    
  }
  const handregister=()=>{
    setToReg(true);
  }
 
  if (toReg){
    //TODO update that the user want to register
    return <PageNavigator task = "/register"/>
  }

  return (
    <div className="login-container"> {/* Added a class for styling */}
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group"> {/* Added a class for styling */}
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group"> {/* Added a class for styling */}
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className = "login_button"type="submit" onClick={handleLogin}>Login</button>
      </form>
      <button className='register_button'onClick={handregister}>Create Fakount</button>
      
    </div>
  );
}

export default Login;
