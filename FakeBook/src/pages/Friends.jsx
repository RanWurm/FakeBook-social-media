import { useEffect, useState } from "react";
import NavBar from "../Bars/NavBar";
import UserCard from "../components/UserCard";
import FriendsRequests from "../components/FriendsRequests";
import MyFriends from "../components/MyFriends";
import "../css/styles/friendsStyles.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Friends = ({ onApproveToBrowse, premissionRef }) => {
  const [users, setUsers] = useState([]);
  const [userFriends, setUserFriends] = useState([]);
  const [showUsers, setShowUsers] = useState(true);
  const [showMyFriends, setShowMyFriends] = useState(false);
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [friendRequests,setFriendRequests] = useState([]);
  const navigate = useNavigate();
  
 
  async function getUser() {
    const userI = JSON.parse(localStorage.getItem("userI"));
      try {
        const response = await fetch(`http://localhost:5000/api/users/${userI.userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${userI.token}`, // Correctly formatted token header
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
  
  
  
  
  const handleFetchFriendRequests = async () => {
    try {
      const user = await getUser(); // Correctly waiting for the user data
      if (!user) {
        throw new Error("Failed to get user!");
      }
      setFriendRequests(user.friendRequests); // Ensure the field name matches your schema
      console.log("row 51 " + user.friendRequests);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
      toast.error("Failed to fetch friend requests.");
    }
  };
  
  
  useEffect(() => {
    debugger;
    const userI = JSON.parse(localStorage.getItem("userI"));
    if (!userI || !userI.token) {
      // Handle unauthenticated session or expired token
      toast.error("Session expired. Please log in again.");
      navigate("/");
    } else{
      handleFetchFriendRequests();
    }
  }, []); // Dependencies should include any props/state if they influence data fetching

  const handleLogOut = () => {
    onApproveToBrowse(false);
    premissionRef.current = false;
    navigate("/");
    // Redirect or perform additional cleanup
  };

  const getAllUsers = () => {
    const userI = JSON.parse(localStorage.getItem("userI"));
    fetch(`http://localhost:5000/api/users/getAllUser?excludedUserId=${userI.userId}`, {
      method: "GET",
      redirect: "follow",
    })
    .then(response => response.json())
    .then(result => setUsers(result))
    .catch(error => {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to fetch users.");
      setUsers([]);
    });
  };

  const getUserFriendsList = () => {
    const userI = JSON.parse(localStorage.getItem("userI"));
    fetch(`http://localhost:5000/api/users/${userI.userId}/friends`, {
      method: "GET",
      redirect: "follow",
    })
    .then(response => response.json())
    .then(result => setUserFriends(result.friendList))
    .catch(error => {
      console.error("Failed to fetch friends list:", error);
      toast.error("Failed to fetch friends list.");
      setUserFriends([]);
    });
  };

  const showUsersHandler = () => {
    setShowUsers(true);
    setShowMyFriends(false);
    setShowFriendRequests(false);
  };
  const showRequestsHandler = () => {
    setShowUsers(false);
    setShowMyFriends(false);
    setShowFriendRequests(true);
  };
  const showFriendsHandler = () => {
    setShowUsers(false);
    setShowMyFriends(true);
    setShowFriendRequests(false);
  };

  return (
    <div>
      <NavBar firstHandleClick={handleLogOut} />
      <div className="addUsersContainer">
        <div className="usersFilter">
          <button onClick={showRequestsHandler}>Friend Requests</button>

        </div>
        <div>
        {showFriendRequests && (
    <FriendsRequests
        users={friendRequests}  // Changed from `friendsRequest` to `friendRequests`
    />
)}

          {showMyFriends && (
            <MyFriends
              getUsers={getAllUsers}
              users={users}
              userFriends={userFriends}
              getUserFriendsList={getUserFriendsList}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Friends;
