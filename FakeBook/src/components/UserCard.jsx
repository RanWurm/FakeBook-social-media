import { toast } from "react-toastify";

const UserCard = ({ user, acceptFriendRequest, denyFriendRequest }) => {
  const userI = JSON.parse(localStorage.getItem("userI"));

  console.log('Rendering UserCard with user:', user);

  return (
    <div className="userCardContainer">
      <img src={user.profilePicture} alt="Profile" width={60} height={60} />
      <h2>{user.nickName}</h2>
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
