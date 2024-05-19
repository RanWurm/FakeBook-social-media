import React, { useState, useEffect, useContext } from "react";
import "../css/pagesCss/FeedPage.css";
import NavBar from "../Bars/NavBar";
import Post from "../inputs/Post";
import PageNavigator from "./PageNavigator";
import { useUser } from "../pages/UserContext";

function FeedPage({ isApproveToBorwse, onApproveToBrowse, premissionRef }) {
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
    console.table(userI);
    fetch(`http://localhost:5000/api/posts`, {
      method: "GET",
      headers: {
        //we need to get the tokenn from Login.js
        Authorization: `${userI.token}`
      },
    })
      .then((response) => {
        console.log(userI.token);
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
        author: userI.username,
        profilePicture:
          "https://images.pexels.com/photos/1759531/pexels-photo-1759531.jpeg?auto=compress&cs=tinysrgb&w=600",
        content: inputText,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch("http://localhost:5000/api/posts/createPost", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          setPosts([result, ...tposts]);
          setInputText("");
        })
        .catch((error) => console.error(error));

      //   fetch(http://localhost:5000/api/posts/createPost, {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: Bearer ${userI.token},
      //     },
      //     body: JSON.stringify(newPost),
      //   })
      //     .then((response) => response.json())
      //     .then((post) => {
      //       console.log(post);
      //       //   setPosts([post, ...tposts]);
      //       //   setInputText("");
      //     })
      //     .catch((error) => console.error("Error creating post:", error));
    }
  };

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
  return (
    <div className={`app-container ${isDarkMode ? "dark-mode" : ""}`}>
      <NavBar firstHandleClick={handleLogOut} />
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
                  postID={post._id}
                  icon={post.profilePicture}
                  author={post.author}
                  content={post.content}
                  date={post.dateCreated}
                  handleDelete={handleRemovePost}
                  handleEdit={handlePostEdit}
                  setPosts={setPosts}
                  posts={tposts}
                  isDarkMode={isDarkMode} // Assuming isDarkMode is managed globally or passed as a prop
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