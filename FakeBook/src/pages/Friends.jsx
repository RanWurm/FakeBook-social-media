import { useEffect, useState } from "react";
import NavBar from "../Bars/NavBar";
import UserCard from "../components/UserCard";
import FriendsRequests from "../components/FriendsRequests";
import MyFriends from "../components/MyFriends";
import "../css/styles/friendsStyles.css";
import { useNavigate } from "react-router-dom";

const Friends = ({ onApproveToBrowse, premissionRef }) => {
  const [logOut, setLogOut] = useState(false);
  const [users, setUsers] = useState([]);
  const [userFriends, setUserFriends] = useState([]);
  const [showUsers, setShowUsers] = useState(true);
  const [showMyFriends, setShowMyFriends] = useState(false);
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (logOut) {
      onApproveToBrowse(false);
      premissionRef.current = false;
    }
  }, []);

  const handleLogOut = () => {
    setLogOut(true);
    onApproveToBrowse(false);
    premissionRef.current = false;
    navigate("/");
    // Redirect or perform additional cleanup
  };

  // GET all users from database and set state of users as an array
  const getAllUsers = () => {
    const userI = JSON.parse(localStorage.getItem("userI"));
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      `http://localhost:5000/api/users/getAllUser?excludedUserId=${userI.userId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => setUsers(result))
      .catch((error) => {
        setUsers([]);
        console.error(error);
      });
  };
  useEffect(() => {
    getAllUsers();
    getUserFriendsList();
  }, []);

  const getUserFriendsList = () => {
    const userI = JSON.parse(localStorage.getItem("userI"));
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      `http://localhost:5000/api/users/${userI.userId}/friends`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => setUserFriends(result.friendList))
      .catch((error) => setUserFriends([]));
  };

  // Sort fo filter so user can check there friend/add friends/delete friends
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
          <button onClick={showUsersHandler}>Add Friends</button>
          <button onClick={showRequestsHandler}>Friend Requests</button>
          <button onClick={showFriendsHandler}>Friends</button>
        </div>
        <div>
          {showUsers ? (
            users.length ? (
              <div className="allUsers">
                {users.map((user) => (
                  <UserCard
                    getUserFriendsList={getUserFriendsList}
                    key={user._id}
                    user={user}
                  />
                ))}
              </div>
            ) : (
              <h2>No Friends To Add</h2>
            )
          ) : null}

          {showFriendRequests && (
            <FriendsRequests
              users={users}
              getUsers={getAllUsers}
              getUserFriendsList={getUserFriendsList}
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