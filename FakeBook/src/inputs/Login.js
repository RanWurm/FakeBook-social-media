import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../pages/UserContext';  // Ensure this import path is correct
import '../css/inputsCss/Login.css'; // Confirm the CSS path

function Login({ upDateApproval, premissionRef, setUser }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [goToFeed, setGoToFeed] = useState(false);
    const [toReg, setToReg] = useState(false);
    const { fffff, logout } = useUser();

    useEffect(() => {
        if (goToFeed) {
            upDateApproval(true);
            premissionRef.current = true;
            <Navigate to="/feed" />;
        }
    }, [goToFeed, upDateApproval, premissionRef]);

    async function getUser() {
      // Assuming SERVER_ADDRESS and username are provided
      const SERVER_ADDRESS = "http://127.0.0.1:5000"; // Update with your actual server address
      try {
        const url = `${SERVER_ADDRESS}/api/users/${encodeURIComponent(username)}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 404) {
          return 404; // Or handle 404 specifically if needed
        }
        const data = await response.json();
        console.log(data);
        return data; // Returns the entire user object
      } catch (error) {
        console.error("Error fetching user data:", error);
        throw error; // Rethrowing the error might be necessary for caller to handle
      }
    }
    

    async function handleLogin(e) {
      e.preventDefault();
      if (!username || !password) {
          console.log("Please fill in both username and password.");
          return;  // Exit early if credentials are not provided
      }
      const item = {
        "userName": username,
        "password": password
      };
      const res = await fetch('http://localhost:5000/api/Tokens', {
        'method': 'post',
        'headers': {
          'Content-Type': 'application/json',
        },
        'body': JSON.stringify(item),
      });
      if (res.ok) {
        const token = await res.text(); // Retrieve the token from the response body
        const user = {
          "username": item.username,
          "token": token
        }
        setUser(user);
       setGoToFeed(true);
      }
    else {
      console.error('Error during login');
        logout();
      return;
    }
  }
  
  

    if (toReg) {
        return <Navigate to="/register" />;
    }

    if (goToFeed) {
        return <Navigate to="/feed" />;
    }

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" value={username} onChange={e => setUsername(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <button className="login_button" type="submit">Login</button>
            </form>
            <button className='register_button' onClick={() => setToReg(true)}>Create Fakount</button>
        </div>
    );
}

export default Login;
