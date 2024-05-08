import { toast } from "react-toastify";

const UserCard = ({ user, getUserFriendsList }) => {
  const sendFriendRequest = async () => {
    const userI = JSON.parse(localStorage.getItem("userI"));
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `${userI.token}`);
    myHeaders.append("Content-Type", "application/json");

    // Check if the users are already friends
    const areFriends = user.friends.some((friend) => friend === user._id);

    if (areFriends) {
      toast.info("You are already friends");
      return;
    }

    const raw = JSON.stringify({
      senderId: `${userI.userId}`,
      recipientId: `${user._id}`,
    });
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `http://localhost:5000/api/users/${userI.userId}/sendFriendRequest/${user._id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.message) {
          console.log(result);
          toast.success("Friend Request Sent");
          getUserFriendsList();
        } else if (result.error) {
          toast.error(result.error);
        }
      })
      .catch((error) => toast.error("Friend Request Pending"));
  };

  return (
    <div className="userCardContainer">
      <img src={user.profilePicture} alt="" />
      <h2>{user.userName}</h2>
      <div>
        <button className="addFriendBtn" onClick={sendFriendRequest}>
          Add Friend
        </button>
      </div>
    </div>
  );
};

export default UserCard;