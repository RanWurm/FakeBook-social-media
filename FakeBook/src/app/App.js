import FeedPage from '../pages/FeedPage';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import { useState,useRef} from 'react';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import users from '../data/users.json';
function App() {
	const [approvToBrowse,setApproveToBrowse] = useState(false);
  const [updatedUsers,SetUpdatedUsers]  = useState(users)
	let premissionToFeed = useRef(approvToBrowse);

	const handleSecurity = (approval) =>{
    setApproveToBrowse(approval);
    premissionToFeed.current = approval;
 	 }
   
   const handleLRegister = (user) =>{
      SetUpdatedUsers([...updatedUsers, user])
   }

  return (
    <div>
    <Router>
	  <Routes>
    <Route path ="/" element = {<LoginPage isApproveToBrowse={approvToBrowse} onApproveToBrowse={handleSecurity} premissionRef={premissionToFeed} users={updatedUsers}/>}/>
	  <Route path ="/feed" element = {<FeedPage isApproveToBorwse={approvToBrowse} onApproveToBrowse={handleSecurity} premissionRef={premissionToFeed}/>}/>
	  <Route path ="/register" element = {<RegisterPage handleReg = {handleLRegister}/>}/>
    </Routes>
    </Router>
    </div>
   

  );
}

export default App;
