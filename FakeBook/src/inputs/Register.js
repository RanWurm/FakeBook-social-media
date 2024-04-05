import React, { useState } from 'react';
import '../css/inputsCss/Register.css'; // Import the CSS file
import PageNavigator from '../pages/PageNavigator';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nickName,  setNickName] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const	[isValid,	setIsValid] =	useState(true);
  const [usersList,addUserToList] = useState([]);
  const [userImage,setUserImage] = useState(null);
  const [approveRegister,setApproveRegister] = useState(false);
  let errors = ["User Name Invalid","PassWords must match","Password must contain atleas 6 latters","Nick Name Invalid",
                "Image Required!"]
  const   [reasonForFail,setReasonForFail] = useState(null);
  // const handleRegister = ()=>{
	// const user = {
	// 	"userName": {username},
	// 	"passWord": {password},
  //   "nickName": {nickName},
  //   "image":    {userImage}
	// 	}
	// addUserToList([...usersList,user]);
  // }

  const processFileInput = (event) => {
    const selectedFile = event.target.files[0];
    const fileURL = URL.createObjectURL(selectedFile);

    const fileReader = new FileReader();

    fileReader.onload = function (event) {
        const binaryData = Array.from(new Uint8Array(event.target.result))
            .map((byteUnit) => String.fromCharCode(byteUnit))
            .join('');

        // Encoding binary data to Base64
        setUserImage(window.btoa(binaryData));
        // Continue with the use of encodedImage as needed
    };

    fileReader.readAsArrayBuffer(selectedFile);
};

  async function createUser() {
    let base64Image = null; // Initialize base64Image
    console.log("Shalome2", userImage);
      const reader = new FileReader();

      reader.onload = function (userImage) {
        const binaryString = Array.from(new Uint8Array(userImage.target.result))
          .map((byte) => String.fromCharCode(byte))
          .join("");
          console.log("Shalom3", binaryString);
        // Convert binary string to Base64
        base64Image = btoa(binaryString);
      }
    console.log(base64Image + "Shalom");
    const formData = {
      userName: username,
      password: password,
      nickName: nickName,
      confirmedPassword: confirmedPassword,
      profilePicture: userImage
    };
    try {
      let url = "http://127.0.0.1:5000/api/users";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      //number 409 could change
      if (response.statusCode === 409) {
        let data = await response.json();
        return data; // Return data if not OK
      }
      return 200;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error; // Propagate the error if needed
    }
    }

  const handleConfirm = async () => {
    if (username === ''){
      setReasonForFail(errors[0]);
      setIsValid(false);
    } else if(password !== confirmedPassword){
      setReasonForFail(errors[1]);
      setIsValid(false);
    }else if( password.length <= 5 ){
      setReasonForFail(errors[2]);
      setIsValid(false);
    }else if (nickName === ''){
      setReasonForFail(errors[3]);
      setIsValid(false)
    } else if(userImage === null){
      setReasonForFail(errors[4]);
      setIsValid(false);
    } else {
      let data = await createUser();
      if (data === 200) {
        setIsValid(true);
        setApproveRegister(true);
      } else {
        //make this css
        console.log("Taken");
      }
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    handleConfirm();
    setUsername('');
    setPassword('');
	  setConfirmedPassword('');
    setNickName('');
    setUserImage(null);
  };
  

  return (
    <div className="login-container"> 
      <h2 className>Register</h2>
	  {!isValid&&(
			<h4 className='wrong_input'>{reasonForFail}</h4>
		)}
    {approveRegister && (<h4 className='wrong_input'>Registration Completed! </h4>)}
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
		      <div className="form-group"> {/* Added a class for styling */}
          <label htmlFor="confiremdPassword">Comfirm Password:</label>
          <input
            type="password"
            id="confirmedPassword"
            value={confirmedPassword}
            onChange={(e) => setConfirmedPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group"> {/* Added a class for styling */}
          <label htmlFor="confiremdPassword">Choose FakeNick:</label>
          <input
            type="text"
            id="nickName"
            value={nickName}
            onChange={(e) => setNickName(e.target.value)}
            required
          />
        </div>
        <div className="form-group"> {/* Added a class for styling */}
          <label className ='image_input' htmlFor="confiremdPassword">add image:</label>
          <input
            className='image_input'
            type="file"
            accept='image/*'
            onChange={processFileInput}
            required
          />
        </div>
        <button className='button' type="submit">register</button>
      </form>
      
    </div>
  );
    }

export default Register;
