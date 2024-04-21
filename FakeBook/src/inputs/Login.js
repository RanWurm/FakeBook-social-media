import React, { useState, useRef, useEffect } from 'react';
import '../css/inputsCss/Login.css';
import PageNavigator from '../pages/PageNavigator';
import { Navigate } from 'react-router-dom';

function Login({upDateApproval, premissionRef}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [goToFeed, setGoToFeed] = useState(false);
  const [toReg, setToReg] = useState(false);
  const [isValid, setIsValid] = useState(false); // Adding this line correctly defines the isValid state and its setter

  useEffect(() => {
    if (goToFeed) {
      premissionRef.current = true;
      upDateApproval(premissionRef.current);
    }
  }, [goToFeed, upDateApproval, premissionRef]);

  const handleValid = () => {
    setIsValid(username !== '' && password !== '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleValid();
    if (isValid) {
      setUsername('');
      setPassword('');
    }
  };

  async function reqLogin() {
    try {
      let url = "http://127.0.0.1:5000/api/tokens/";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({userName: username, password: password}),
      });
      let data = await response.json();
      if (response.ok) {
        return data; // Assuming data has a token or similar
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  }

  const handleLogin = async () => {
    let resp = await reqLogin();
    if (resp) { // Assuming resp is truthy on success
      console.log("Login successful:", resp);
      setGoToFeed(true);
    } else {
      console.log("Login failed.");
    }
  };

  if (toReg) {
    return <PageNavigator task="/register" />;
  }

  if (goToFeed) {
    return <Navigate to="/feed" />;
  }

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button className="login_button" type="submit" onClick={handleLogin}>Login</button>
      </form>
      <button className='register_button' onClick={() => setToReg(true)}>Create Account</button>
    </div>
  );
}

export default Login;
