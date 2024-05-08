import { toast } from "react-toastify";

const FriendsRequests = ({ users, getUsers, getUserFriendsList }) => {
  const userI = JSON.parse(localStorage.getItem("userI"));

  const acceptFriendRequest = (recipientId, requestId) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `${userI.token}`);

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `http://localhost:5000/api/users/${recipientId}/friends/${requestId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        toast.success("Friend Request Approved");
        getUsers();
        getUserFriendsList();
      })
      .catch((error) => toast.error(error));
  };

  const denyFriendRequest = (recipientId, requestId) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `${userI.token}`);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `http://localhost:5000/api/users/${recipientId}/friends/${requestId}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        getUsers();
        getUserFriendsList();
      })
      .catch((error) => console.error(error));
  };

  const renderRequests = users
    .flatMap((user) =>
      user.friendRequests.map((request) => ({
        ...request,
        userName: user.userName,
        profilePicture: user.profilePicture,
      }))
    )
    .filter(
      (request) =>
        request.recipient === userI.userId || request.sender === userI.userId
    )
    .map((request) => (
      <div key={request._id} className="requestContainer">
        <div className="userCardContainer">
          <img src={request.profilePicture} alt="" width={60} height={60} />
          <h2>{request.userName}</h2>
          <div className="acceptReject">
            <button
              onClick={() =>
                acceptFriendRequest(request.recipient, request._id)
              }
            >
              Accept
            </button>
            <button
              onClick={() => denyFriendRequest(request.recipient, request._id)}
            >
              Deny
            </button>
          </div>
        </div>
      </div>
    ));

  const noRequestsMessage =
    renderRequests.length === 0 ? <div>No friends Pending</div> : null;

  return (
    <div>
      <h2>FriendsRequests</h2>
      {noRequestsMessage}
      <div className="allUsers">{renderRequests}</div>
    </div>
  );
};

export default FriendsRequests;