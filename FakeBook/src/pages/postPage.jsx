import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import "../css/styles/friendsStyles.css";
import { toast } from "react-toastify";
const PostPage = ({getUserFriendsList}) => {
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [content, setContent] = useState([]);
  const [isFriend, setIsFriend] = useState(false);
  const postDetails = location.state;
  
  useEffect(() => {
    console.log("line 12");
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    const userI = JSON.parse(localStorage.getItem("userI"));
    console.log(userId);
    console.log(userI.userId);

    if (userId === userI.userId) {
      navigate(`/feed`);
    }

    try {
      	const response = await fetch(`/api/users/${userId}/posts`, {  // Adjusted endpoint
        headers: { 'Authorization': `Bearer ${userI.token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();

      if (Array.isArray(data)) {
        setContent(data);  // Assuming data is an array of posts if they are friends
        setIsFriend(true);
      } else {
        setContent([data]);  // Assuming data is user details if not friends
        setIsFriend(false);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  
  
  async function getUser(id) {
	debugger;
	const userI = JSON.parse(localStorage.getItem("userI"));
    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
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


  console.log(location.state);  // This will log the state you passed
  
  
  const sendFriendRequest = async () => {
    const userI = JSON.parse(localStorage.getItem("userI"));
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `${userI.token}`);
    myHeaders.append("Content-Type", "application/json");
	debugger;
	let user = await getUser(userI.userId)
	console.log(user);
    // Check if the users are already friends
    const areFriends = user.friends.some((friend) => friend === user.userId);

    if (areFriends) {
      toast.info("You are already friends");
      return;
    }
	console.log(`${userId}`);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,

      redirect: "follow",
    };

    fetch(
      `http://localhost:5000/api/users/${userId}/friends`,
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
	  <img src={postDetails.icon} alt="" />
	  
      <h2>User Name: {postDetails.author}</h2>

	          <button className="addFriendBtn" onClick={sendFriendRequest}>
          Add Friend
        </button>
      {/* More details can be rendered here */}
    </div>
  );
};


export default PostPage;
