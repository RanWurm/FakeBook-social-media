import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


const PostPage = ({browser}) => {
  const { userId } = useParams();  // Get the user ID from the URL
  const [content, setContent] = useState([]);
  const [isFriend, setIsFriend] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
	debugger;

	const userI = JSON.parse(localStorage.getItem("userI"));
	console.log(userId);
	console.log(userI.userId);

	if(userId == userI.userId){
		navigate(`/feed`)
	}
    try {
      const response = await fetch(`/api/users/${userId}/posts-or-details`, {
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

  return (
    <div>
      {isFriend ? (
        <div>
          <h1>Posts</h1>
          {content.map(post => (
            <div key={post.id}>{post.content}</div>  // Adjust according to your post structure
          ))}
        </div>
      ) : (
        <div>
          <h1>User Details</h1>
          {content.map(user => (
            <div key={user.id}>
              <p>Name: {user.userName}</p>
              <p>Nickname: {user.nickName}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostPage;
