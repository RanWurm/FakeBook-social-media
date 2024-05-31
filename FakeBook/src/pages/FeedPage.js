import React, { useState, useEffect, useContext } from "react";
import "../css/pagesCss/FeedPage.css";
import NavBar from "../Bars/NavBar";
import Post from "../inputs/Post";
import PageNavigator from "./PageNavigator";


function FeedPage({ isApproveToBorwse, onApproveToBrowse, premissionRef}) {
  // const { user, logOut } = useUser();
  const [tposts, setPosts] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false); // Example of local state definition for dark mode
  const [logOut, setLogOut] = useState(false);
  const handleRemovePost = (id) => {
    // Define what happens when a post is removed
  };

  const handlePostEdit = (id, newContent) => {
    // Define what happens when a post is edited
  };
  
  useEffect(() => {
    if (logOut) {
      onApproveToBrowse(false);
      premissionRef.current = false;
    }
    fetchPosts(); // Call fetch posts on component mount
  }, []);

  const fetchPosts = () => {
    const userI = JSON.parse(localStorage.getItem("userI"));
    fetch(`http://localhost:5000/api/posts`, {
      method: "GET",
      headers: {
        //we need to get the tokenn from Login.js
        Authorization: `${userI.token}`
      },
    })
      .then((response) => {
        if (response.status === 404) {
          console.log("No posts found, setting posts to empty.");
          setPosts([]); // Set posts to empty if the response is 404
          return; // Stop further processing
        }
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          // Ensure there's data before setting it
          setPosts(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setPosts([]); // Optionally reset posts on any error
      });
  };

  const handleNewPost = () => {
    const userI = JSON.parse(localStorage.getItem("userI"));
    if (inputText.trim() !== "") {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `${userI.token}`);

      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        authorID: userI.userId,
        author: userI.username,
        pcture:userI.profilePicture,
        content: inputText,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      fetch(`http://localhost:5000/api/users/${userI.userId}/posts`, requestOptions)
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then((result) => {
        setPosts([result, ...tposts]); // Updates the list of posts to include the new post at the top
        setInputText(""); // Clears the input field after successful post creation
    })
    .catch((error) => {
        console.error('Error creating post:', error);
        // Optionally, update UI to show error message or notification to the user
    });
    }
  };
  const handleDarkModeClick = () =>{
    setIsDarkMode(!isDarkMode);
  }
  const handleLogOut = () => {
    setLogOut(true);
    onApproveToBrowse(false);
    premissionRef.current = false;
    // Redirect or perform additional cleanup
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleNewPost();
  };

  if (!isApproveToBorwse) {
    return <PageNavigator caller={"FeedPage"} />;
  }
  const userI = JSON.parse(localStorage.getItem("userI"));
  let author = userI ? `${userI.username}` : '';
  let pic = userI ? `${userI.profilePicture}` : '';
  return (
    <div className={`app-container ${isDarkMode ? "dark-mode" : ""}`}>
      <NavBar firstHandleClick={handleLogOut} secondHandleClick={handleDarkModeClick} darkMode={isDarkMode}/>
      <div className="float-parent-element">
        <div className="float-child-element">
          <div className="right">
            <div className="new_post_box">
              <h2 className="post_head">Write New Post</h2>
              <form onSubmit={handleSubmit}>
                <input
                  className="new-post-input"
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="What's on your mind..."
                  required
                />
                <button className="new-post-button">Add Post</button>
              </form>
            </div>
          </div>
        </div>
        <div className="float-child-element">
          <div className="left">
            {tposts.length ? (
              tposts.map((post) => (
<Post
  key={post._id}
  postID={post.postID}
  icon={post.picture}
  authorId={post.authorID}
  author={author}
  content={post.content}
  date={post.dateCreated}
  handleDelete={handleRemovePost}
  handleEdit={handlePostEdit}
  setPosts={setPosts}
  posts={tposts}
  isDarkMode={isDarkMode}
  fetchPosts={fetchPosts} // Passing down fetchPosts as a prop
/>

              ))
            ) : (
              <h2 style={{ textAlign: "center" }}>No Posts Yet</h2>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeedPage;