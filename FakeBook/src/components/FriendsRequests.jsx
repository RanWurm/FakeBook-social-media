import { toast } from "react-toastify";
import UserCard from './UserCard';

const FriendsRequests = ({ users }) => {
  const userI = JSON.parse(localStorage.getItem("userI"));

  const handleFriendRequestAction = (action, userId, requestId) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `${userI.token}`);
    const method = action === 'accept' ? 'PATCH' : 'DELETE';
    const body = action === 'accept' ? JSON.stringify({ action: "accept" }) : null;

    const requestOptions = {
      method,
      headers: myHeaders,
      body,
      redirect: "follow",
    };

    const url = `http://localhost:5000/api/users/${userId}/${action === 'accept' ? 'acceptFriend' : 'denyFriend'}/${requestId}`;

    fetch(url, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        toast.success(`Friend request ${action === 'accept' ? 'accepted' : 'denied'}.`);
        // You might need to update the local state here to reflect changes
      })
      .catch(error => toast.error(`Failed to ${action} friend request.`));
  };

  const acceptFriendRequest = (userId, requestId) => handleFriendRequestAction('accept', userId, requestId);
  const denyFriendRequest = (userId, requestId) => handleFriendRequestAction('deny', userId, requestId);

  // Ensure users is always treated as an array
  const safeUsers = Array.isArray(users) ? users : [];
  const renderRequests = safeUsers.map(user => (
    <UserCard key={user.id} user={user} acceptFriendRequest={acceptFriendRequest} denyFriendRequest={denyFriendRequest} />
));
  const noRequestsMessage = renderRequests.length === 0 ? <div>No friends Pending</div> : null;

  return (
    <div>
      <h2>Friends Requests</h2>
      {noRequestsMessage}
      <div className="allUsers">{renderRequests}</div>
    </div>
  );
};

export default FriendsRequests;
