import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import "../css/styles/friendsStyles.css";
import { toast } from "react-toastify";

const PostPage = ({ getUserFriendsList }) => {
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [content, setContent] = useState([]);
  const [isFriend, setIsFriend] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [pendingList, setPendingList] = useState([]);
  const postDetails = location.state;

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    const userI = JSON.parse(localStorage.getItem("userI"));

    if (userId === userI.userId) {
      navigate(`/feed`);
      return;
    }

    try {
      // Fetch the friends list
      const friendsResponse = await fetch(`http://localhost:5000/api/users/${userI.userId}/friends`, {
        headers: { 'Authorization': userI.token }
      });
      if (!friendsResponse.ok) {
        console.error('Failed to fetch friends list:', friendsResponse.statusText);
        const errorText = await friendsResponse.text();
        console.error('Response text:', errorText);
        throw new Error('Failed to fetch friends list');
      }
      const friendsData = await friendsResponse.json();
      const friendsList = Array.isArray(friendsData) ? friendsData : [];
      console.log('Fetched friends list:', friendsList);

      const isFriend = friendsList.includes(parseInt(userId, 10));
      setIsFriend(isFriend);

      // Fetch the requested user's details
      const userDetailsResponse = await fetch(`http://localhost:5000/api/users/${userId}`, {
        headers: { 'Authorization': userI.token }
      });
      if (!userDetailsResponse.ok) {
        console.error('Failed to fetch user details:', userDetailsResponse.statusText);
        const errorText = await userDetailsResponse.text();
        console.error('Response text:', errorText);
        throw new Error('Failed to fetch user details');
      }
      const userDetailsData = await userDetailsResponse.json();
      console.log('Fetched user details:', userDetailsData);
      setUserDetails(userDetailsData);

      // If they are friends, fetch the posts
      if (isFriend) {
        const postsResponse = await fetch(`http://localhost:5000/api/users/${userId}/posts`, {
          headers: { 'Authorization': userI.token }
        });
        if (!postsResponse.ok) {
          console.error('Failed to fetch posts:', postsResponse.statusText);
          const errorText = await postsResponse.text();
          console.error('Response text:', errorText);
          throw new Error('Failed to fetch posts');
        }
        const postsData = await postsResponse.json();
        console.log('Fetched posts:', postsData);

        // Fetch the author's nickname for each post
        const postsWithAuthors = await Promise.all(postsData.map(async (post) => {
          console.log('current post', post);
          const authorResponse = await fetch(`http://localhost:5000/api/users/${post.authorID}`, {
            headers: { 'Authorization': userI.token }
          });
          if (!authorResponse.ok) {
            console.error('Failed to fetch author details:', authorResponse.statusText);
            const errorText = await authorResponse.text();
            console.error('Response text:', errorText);
            throw new Error('Failed to fetch author details');
          }
          const authorData = await authorResponse.json();
          return { ...post, authorNickName: authorData.nickName };
        }));

        setContent(postsWithAuthors);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const sendFriendRequest = async () => {
    const userI = JSON.parse(localStorage.getItem("userI"));
    const myHeaders = new Headers();
    myHeaders.append("Authorization", userI.token);
    myHeaders.append("Content-Type", "application/json");

    try {
      const friendsResponse = await fetch(`http://localhost:5000/api/users/${userI.userId}/friends`, {
        headers: { 'Authorization': userI.token }
      });
      if (!friendsResponse.ok) {
        console.error('Failed to fetch friends list:', friendsResponse.statusText);
        const errorText = await friendsResponse.text();
        console.error('Response text:', errorText);
        throw new Error('Failed to fetch friends list');
      }
      const friendsList = await friendsResponse.json();
      const areFriends = Array.isArray(friendsList) ? friendsList.includes(parseInt(userId, 10)) : false;

      if (areFriends) {
        toast.info("You are already friends");
        return;
      }

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(`http://localhost:5000/api/users/${userId}/friends`, requestOptions);
      if (!response.ok) {
        console.error('Failed to send friend request:', response.statusText);
        const errorText = await response.text();
        console.error('Response text:', errorText);
        throw new Error('Failed to send friend request');
      }
      const result = await response.json();

      if (result.message) {
        toast.success("Friend Request Sent");
        getUserFriendsList();
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Friend Request Pending");
    }
  };

  console.log(userDetails)

  return (
    <div className="userCardContainer">
      <img src={userDetails.icon || postDetails.icon} alt="" />
      <h2>{userDetails.nickName || postDetails.author}</h2>
      {!isFriend && (
        <button className="addFriendBtn" onClick={sendFriendRequest}>
          Add Friend
        </button>
      )}
      {isFriend && content.map((post, index) => (
        <div key={index} className="post">
          <h3>{post.title}</h3>
          <p dangerouslySetInnerHTML={{ __html: post.body }}></p> {/* Display HTML content */}
          <p>{post.content}</p>
          <img src={post.picture} alt="" />
        </div>
      ))}
    </div>
  );
};

export default PostPage;
