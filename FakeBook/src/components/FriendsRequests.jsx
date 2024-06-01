import { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import UserCard from './UserCard';

const FriendsRequests = ({ users }) => {
  const [userDetails, setUserDetails] = useState([]);
  const userI = JSON.parse(localStorage.getItem("userI"));

  useEffect(() => {
    const fetchUserDetails = async (userId) => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
          headers: { 'Authorization': userI.token }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
        return await response.json();
      } catch (error) {
        console.error('Error fetching user details:', error);
        return null;
      }
    };

    const fetchUsers = async () => {
      const usersDetails = await Promise.all(users.map(id => fetchUserDetails(id)));
      setUserDetails(usersDetails.filter(user => user !== null)); // Remove any null entries from failed fetches
    };

    if (Array.isArray(users) && users.length > 0) {
      fetchUsers();
    } else {
      console.error('users is not an array or is empty:', users);
    }
  }, [users, userI.token]);

  const handleFriendRequestAction = (action, senderId) => {
    const receiverId = userI.userId;
    const myHeaders = new Headers();
    myHeaders.append("Authorization", userI.token);
    myHeaders.append("Content-Type", "application/json");

    const method = action === 'accept' ? 'PATCH' : 'DELETE';
    const body = action === 'accept' ? JSON.stringify({ action: "accept" }) : null;

    const url = `http://localhost:5000/api/users/${receiverId}/friends/${senderId}`;

    const requestOptions = {
      method,
      headers: myHeaders,
      body,
      redirect: "follow",
    };

    fetch(url, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        toast.success(`Friend request ${action === 'accept' ? 'accepted' : 'denied'}.`);
        // You might need to update the local state here to reflect changes
      })
      .catch(error => {
        console.error(`Failed to ${action} friend request.`, error);
        toast.error(`Failed to ${action} friend request.`);
      });
  };

  const acceptFriendRequest = (senderId) => handleFriendRequestAction('accept', senderId);
  const denyFriendRequest = (senderId) => handleFriendRequestAction('deny', senderId);

  const renderRequests = userDetails.map(user => {
    console.log('User in renderRequests:', user);  // Added logging
    return (
      <UserCard
        key={user.id}
        user={user}
        acceptFriendRequest={() => acceptFriendRequest(user.id)}
        denyFriendRequest={() => denyFriendRequest(user.id)}
      />
    );
  });
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
