import React, { useState } from "react";
import "../css/inputsCss/Post.css";
import "../css/inputsCss/Tab.css";
import Edit from "../res/edit.png";
import like_icon from "../res/like.png";
import golden_like from "../res/golden_like.png";
import send_button from "../res/send_button.png";
import Comment from "../res/comment_icon.png";
import comment_icon from "../res/comment_icon.png";
import CommentSection from "./CommentSection";
import Send from "../res/send_button.png";
import TrashCan from "../res/garbage.png";
import "../css/buttonsCss/Button.css";
import { format } from "date-fns";

function Post({
  postID,
  author,
  icon,
  content,
  date,
  isDarkMode,
  setPosts,
  tposts,
  fetchPosts
}) {
  const [likeCount, setLikeCount] = useState(0);
  const [inputText, setInputText] = useState("");
  const [textList, setTextList] = useState([]);
  const [showPosts, setShowPosts] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleShowPost = () => {
    setShowPosts(!showPosts);
  };

  const handleLikeClick = () => {
    setLikeCount(likeCount + 1); // This should ideally also update on the server
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleAddToList = () => {
    if (inputText.trim() !== "") {
      setTextList([...textList, inputText]);
      setInputText("");
    }
  };

  const deletePost = () => {
    const userI = JSON.parse(localStorage.getItem("userI"));
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `${userI.token}`);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      id: postID,
    });

    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`http://localhost:5000/api/users/${userI.userId}/posts/${postID}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        
        setPosts((prevPosts) => {
          return prevPosts.filter((post) => post.id !== postID);
        });
        fetchPosts(); // Call fetchPosts to refresh the posts list
      })
      .catch((error) => console.error(error));

  };

  const editPost = () => {
    const userI = JSON.parse(localStorage.getItem("userI"));
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `${userI.token}`);
    myHeaders.append("Content-Type", "application/json");
  
    const raw = JSON.stringify({
      content: editedContent,
      id: postID,
      picture: icon
    });
  
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
  
    fetch(`http://localhost:5000/api/users/${userI.userId}/posts/${postID}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setIsEditing(false);
        fetchPosts(); // Call fetchPosts to refresh the posts list
      })
      .catch((error) => {
        console.error('Error updating post:', error);
      });
  };
  

  let like = isDarkMode ? golden_like : like_icon;

  return (
    <div key={postID} className={`post ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="post-header">
        <img className="avatar" src={icon} alt={`${author}'s avatar`} />
        <div className="author-name">{author}</div>
        <div className="post-buttons-bar">
          <div className="post_right_col">
            <div className="delete_post_button">
              {isEditing ? (
                <button className="interaction-button" onClick={editPost}>
                  <img
                    className="interaction-button"
                    src={Edit}
                    alt="Save Edit"
                  />
                </button>
              ) : (
                <button
                  className="interaction-button"
                  onClick={() => setIsEditing(true)}
                >
                  <img className="interaction-button" src={Edit} alt="Edit" />
                </button>
              )}
              <button className="interaction-button" onClick={deletePost}>
                <img
                  className="interaction-button"
                  src={TrashCan}
                  alt="Delete"
                />
                Del
              </button>
            </div>
          </div>
        </div>
        <div className="post-date">
          {format(new Date(date), "MMMM d, yyyy")}
        </div>
      </div>
      <div className="post-content">
        {isEditing ? (
          <input
            type="text"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
        ) : (
          <p>{content}</p>
        )}
      </div>
      <span className="interactions-count">
        <span className="right_col">
          {likeCount}
          <img className="interaction-icon" src={like} alt="" />
          {textList.length}
          <img className="interaction-icon" src={comment_icon} alt="" />
        </span>
      </span>
      <div className="interactions-section">
        <div className="post-buttons-bar">
          <div className="post_left_col">
            <button className="interaction-button" onClick={handleLikeClick}>
              <img className="interaction-button" src={like} alt="" />
            </button>
          </div>
          <div className="post_center_col">
            <button className="interaction-button" onClick={handleShowPost}>
              <img className="interaction-button" src={Comment} alt="" />
            </button>
          </div>
        </div>
      </div>
      <div className="comment-section">
        <CommentSection commentList={textList} issShow={showPosts} />
        <input
          className="comment-section"
          type="text"
          placeholder="add comment"
          value={inputText}
          onChange={handleInputChange}
        />
        <div className="left-col">
          <button className="send-button" onClick={handleAddToList}>
            <img className="send-button-logo" src={Send} alt="" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Post;
