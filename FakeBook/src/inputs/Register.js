import React, { useState } from "react";
import "../css/inputsCss/Register.css"; // Import the CSS file
import PageNavigator from "../pages/PageNavigator";
import { toast } from "react-toastify";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nickName, setNickName] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [usersList, addUserToList] = useState([]);
  const [userImage, setUserImage] = useState("");
  const [approveRegister, setApproveRegister] = useState(false);
  let errors = [
    "User Name Invalid",
    "PassWords must match",
    "Password must contain atleas 6 latters",
    "Nick Name Invalid",
    "Image Required!",
  ];
  const [reasonForFail, setReasonForFail] = useState(null);
  const processFileInput = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
        setUserImage(reader.result);
        // Pass imageSrc as an argument to onChange function
    };

    if (file) {
        reader.readAsDataURL(file);
    }
  };

  async function createUser() {
    const formData = {
      userName: username,
      password,
      nickName,
      confirmedPassword,
      profilePicture:userImage
    };
    console.log(formData);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify(formData);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://localhost:5000/api/users", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setIsValid(true);
        setApproveRegister(true);
        toast.success("Account Created");
      })
      .catch((error) => toast.error("Error Creating"));
    // try {
    //   let url = "http://127.0.0.1:5000/api/users";
    //   const response = await fetch(url, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(formData),
    //   });
    //   //number 409 could change
    //   if (response.statusCode === 409) {
    //     let data = await response.json();
    //     return data; // Return data if not OK
    //   }
    //   return 200;
    // } catch (error) {
    //   console.error("Error creating user:", error);
    //   throw error; // Propagate the error if needed
    // }
  }

  const handleConfirm = async () => {
    if (username === "") {
      setReasonForFail(errors[0]);
      setIsValid(false);
    } else if (password !== confirmedPassword) {
      setReasonForFail(errors[1]);
      setIsValid(false);
    } else if (password.length <= 5) {
      setReasonForFail(errors[2]);
      setIsValid(false);
    } else if (nickName === "") {
      setReasonForFail(errors[3]);
      setIsValid(false);
    } else if (userImage === null) {
      setReasonForFail(errors[4]);
      setIsValid(false);
    } else {
      let data = await createUser();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleConfirm();
    setUsername("");
    setPassword("");
    setConfirmedPassword("");
    setNickName("");
    setUserImage("");
  };

  return (
    <div className="login-container">
      <h2>Register</h2>
      {!isValid && <h4 className="wrong_input">{reasonForFail}</h4>}
      {approveRegister && (
        <h4 className="wrong_input">Registration Completed! </h4>
      )}
      <form onSubmit={handleSubmit}>
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
          <label htmlFor="password">Choose Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          {" "}
          {/* Added a class for styling */}
          <label htmlFor="confiremdPassword">Comfirm Password:</label>
          <input
            type="password"
            id="confirmedPassword"
            value={confirmedPassword}
            onChange={(e) => setConfirmedPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          {" "}
          {/* Added a class for styling */}
          <label htmlFor="confiremdPassword">Choose FakeNick:</label>
          <input
            type="text"
            id="nickName"
            value={nickName}
            onChange={(e) => setNickName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          {" "}
          {/* Added a class for styling */}
          <label className="image_input" htmlFor="confiremdPassword">
            add image:
          </label>
          <input
            className="image_input"
            type="file"
            accept="image/*"
            onChange={processFileInput}
            required
          />
        </div>
        <button className="button" type="submit">
          register
        </button>
      </form>
    </div>
  );
}

export default Register;