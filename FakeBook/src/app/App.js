import FeedPage from '../pages/FeedPage';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import { useState,useRef} from 'react';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import { UserProvider } from '../pages/UserContext';

function App() {
	const [approvToBrowse,setApproveToBrowse] = useState(false);
  const [user,setUser ] = useState(null);
	let premissionToFeed = useRef(approvToBrowse);

	const handleSecurity = (approval) =>{
    setApproveToBrowse(approval);
    premissionToFeed.current = approval;
 	 }

  return (
    <div>
      <UserProvider>
        <Router>
	        <Routes>
            <Route path ="/" element = {<LoginPage isApproveToBrowse={approvToBrowse} onApproveToBrowse={handleSecurity} premissionRef={premissionToFeed} setUser={setUser}/>}/>
	          <Route path ="/feed" element = {<FeedPage isApproveToBorwse={approvToBrowse} onApproveToBrowse={handleSecurity} premissionRef={premissionToFeed} user={user}/>}/>
	          <Route path ="/register" element = {<RegisterPage/>}/>
          </Routes>
        </Router>
      </UserProvider>
    </div>
   

  );
}

export default App;
