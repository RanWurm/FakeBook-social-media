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
  const handleRegister = ()=>{
	const user = {
		"userName": {username},
		"passWord": {password},
    "nickName": {nickName},
    "image":    {userImage}
		}
	addUserToList([...usersList,user]);
  }
  
  const handleConfirm = () => {
    if (username === ''){
      setReasonForFail(errors[0]);
      setIsValid(false)
    } else if(password !== confirmedPassword){
      setReasonForFail(errors[1]);
      setIsValid(false)
    }else if( password.length <= 5 ){
      setReasonForFail(errors[2]);
      setIsValid(false)
    }else if (nickName === ''){
      setReasonForFail(errors[3]);
      setIsValid(false)
    } else if(userImage === null){
      setReasonForFail(errors[4]);
      setIsValid(false)
    } else {
	  setIsValid(true)
    setApproveRegister(true);
	  handleRegister();
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
            onChange={(e)=>setUserImage(e.target.files[0])}
            required
          />
        </div>
        <button className='button' type="submit">register</button>
      </form>
      
    </div>
  );
}

export default Register;
