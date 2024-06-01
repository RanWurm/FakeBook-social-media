import React from "react";
import { toast } from "react-toastify";

const MyFriends = ({ users, userFriends, getUsers, getUserFriendsList }) => {
  const removeFriendHandler = (friendId) => {
    const userI = JSON.parse(localStorage.getItem("userI"));
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `${userI.token}`);

    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `http://localhost:5000/api/users/${userI.userId}/friends/${friendId}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        toast.success("Friend Removed");
        getUsers();
        getUserFriendsList();
      })
      .catch((error) => console.error(error));
  };

  const renderMyFriends = users
    .filter((user) => userFriends.includes(user._id))
    .map((user) => (
      <div key={user._id}>
        <div className="userCardContainer">
          <img src={user.profilePicture} alt="" width={60} height={60} />
          <h2>{user.userName}</h2>
          <button onClick={() => removeFriendHandler(user._id)}>
            Remove Friend
          </button>
        </div>
      </div>
    ));

  const noFriendsMessage =
    renderMyFriends.length === 0 ? (
      <div>No friends to display</div>
    ) : (
      renderMyFriends
    );

  return (
    <div>
      <h2>My Friends</h2>
      <div className="allUsers">{noFriendsMessage}</div>
    </div>
  );
};

export default MyFriends;