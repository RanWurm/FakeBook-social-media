import FeedPage from '../pages/FeedPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useRef } from 'react';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import { UserProvider } from '../pages/UserContext';
import Friends from '../pages/Friends';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserProfile from '../pages/UserProfile';
import PostPage from '../pages/postPage';
function App () {
  const [ approvToBrowse, setApproveToBrowse ] = useState(false);
  const [ user, setUser ] = useState(null);
  let premissionToFeed = useRef(approvToBrowse);

  const handleSecurity = (approval) => {
    setApproveToBrowse(approval);
    premissionToFeed.current = approval;
  };

  return (
    <div>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage isApproveToBrowse={approvToBrowse} onApproveToBrowse={handleSecurity} premissionRef={premissionToFeed} userToSet={setUser} />} />
            <Route path="/feed" element={<FeedPage isApproveToBorwse={approvToBrowse} onApproveToBrowse={handleSecurity} premissionRef={premissionToFeed} user={user} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/add-friends" element={<Friends onApproveToBrowse={handleSecurity} premissionRef={premissionToFeed} />} />
            <Route path="/user-profile" element={<UserProfile onApproveToBrowse={handleSecurity} premissionRef={premissionToFeed} />} />
            <Route path="/posts/:userId" element={<PostPage browser = {user}/>} />
          </Routes>
        </Router>
      </UserProvider>
      <ToastContainer />
    </div>


  );
}

export default App;