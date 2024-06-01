import { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import UserCard from './UserCard';

const FriendsRequests = ({ users, updateFriendRequests }) => {
  const [userDetails, setUserDetails] = useState([]);
  const userI = JSON.parse(localStorage.getItem("userI"));

  useEffect(() => {
    const fetchUserDetails = async () => {
      const usersDetails = await Promise.all(users.map(userId => {
        return fetch(`http://localhost:5000/api/users/${userId}`, {
          headers: { 'Authorization': userI.token }
        }).then(response => response.json()).catch(err => {
          console.error('Error fetching user details:', err);
          return null;
        });
      }));
      setUserDetails(usersDetails.filter(user => user !== null));
    };

    fetchUserDetails();
  }, [users]);

  const handleFriendRequestAction = async (action, senderId) => {
    const receiverId = userI.userId;
    const requestOptions = {
      method: action === 'accept' ? 'PATCH' : 'DELETE',
      headers: {
        "Authorization": userI.token,
        "Content-Type": "application/json"
      },
      body: action === 'accept' ? JSON.stringify({ action: "accept" }) : null,
      redirect: "follow"
    };

    try {
      const response = await fetch(`http://localhost:5000/api/users/${receiverId}/friends/${senderId}`, requestOptions);
      const result = await response.json();
      toast.success(`Friend request ${action === 'accept' ? 'accepted' : 'denied'}.`);
      updateFriendRequests(senderId);  // Call to update friend requests list in the parent component
    } catch (error) {
      console.error(`Failed to ${action} friend request:`, error);
      toast.error(`Failed to ${action} friend request.`);
    }
  };

  const acceptFriendRequest = senderId => handleFriendRequestAction('accept', senderId);
  const denyFriendRequest = senderId => handleFriendRequestAction('deny', senderId);

  const renderRequests = userDetails.map(user => (
    <UserCard
      key={user.id}
      user={user}
      acceptFriendRequest={() => acceptFriendRequest(user.id)}
      denyFriendRequest={() => denyFriendRequest(user.id)}
    />
  ));

  return (
    <div>
      <h2>Friends Requests</h2>
      {renderRequests.length === 0 ? <div>No friend requests pending</div> : <div className="allUsers">{renderRequests}</div>}
    </div>
  );
};

export default FriendsRequests;
