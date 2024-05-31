import { toast } from "react-toastify";

const UserCard = ({ user, acceptFriendRequest, denyFriendRequest }) => {
  const userI = JSON.parse(localStorage.getItem("userI"));

  return (
    <div className="userCardContainer">
      <img src={user.profilePicture} alt="" width={60} height={60} />
      <h2>{user.userName}</h2>
      <div className="acceptReject">
        <button onClick={() => acceptFriendRequest(userI.id, user.id)}>
          Accept
        </button>
        <button onClick={() => denyFriendRequest(userI.id, user.id)}>
          Deny
        </button>
      </div>
    </div>
  );
};

export default UserCard;
