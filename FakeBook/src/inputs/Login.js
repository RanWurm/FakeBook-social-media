import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../pages/UserContext"; // Ensure this import path is correct
import "../css/inputsCss/Login.css"; // Confirm the CSS path
import { toast } from "react-toastify";
// import { getUserById } from "../../../server/controllers/user";

function Login({ upDateApproval, premissionRef}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [goToFeed, setGoToFeed] = useState(false);
  const [toReg, setToReg] = useState(false);
  const { setUser, logout } = useUser();
  let tokenn = 0;

  useEffect(() => {
    if (goToFeed) {
      upDateApproval(true);
      premissionRef.current = true;
      <Navigate to="/feed" />;
    }
  }, [goToFeed, upDateApproval, premissionRef]);

  async function getUser(id) {
    // Assuming SERVER_ADDRESS and username are provided
    const SERVER_ADDRESS = `http://localhost:5000/api/users/${id}`;

    try {
      const url = `${SERVER_ADDRESS}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${tokenn}`, // Correctly formatted token header
        },
      });
      if (response.status === 404) {
        return 404; // Or handle 404 specifically if needed
      }
      const data = await response.json();
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
      return; // Exit early if credentials are not provided
    }

    try {
      const response = await fetch("http://localhost:5000/api/tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: username, password: password }),
      });
      if (!response.ok) {
        throw new Error(`Login failed: ${response.statusText}`);
      }
      const data = await response.json();
      tokenn = data.token;
      debugger;
      let user = await getUser(data.id); // Fetch user with the token
      if (!user) {
        throw new Error("Failed to retrieve user data");
      }

      let token2 = data.token;
      let userId2 = user.id;
      let username2 = user.userName;
      let profilePicture2 = user.profilePicture
      const userDetails = {
        token: token2,
        userId: userId2,
        username: username2,
        profilePicture: profilePicture2
      };
    
      localStorage.setItem("userI", JSON.stringify(userDetails)); // Store user details in localStorag
      toast.success("Login Success");
      setGoToFeed(true); // Trigger navigation to feed page upon successful login
  
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Error during login");
      logout();
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
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="login_button" type="submit">
          Login
        </button>
      </form>
      <button className="register_button" onClick={() => setToReg(true)}>
        Create Fakount
      </button>
    </div>
  );
}

export default Login;