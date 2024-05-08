import React, { useState } from "react";
import "../css/inputsCss/Post.css";
import "../css/inputsCss/Tab.css";
import Edit from "../res/edit.png";
import like_icon from "../res/like.png";
import golden_like from "../res/golden_like.png";
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

    fetch("http://localhost:5000/api/posts/deletePost", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        setPosts((prevPosts) => {
          return prevPosts.filter((post) => post._id !== postID);
        });
      })
      .catch((error) => console.error(error));
    // fetch(`http://localhost:3000/api/posts/deletePost`, {
    //   method: "DELETE",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ id: postID }),
    // })
    //   .then((response) => response.json())
    //   .then(() => {
    //     console.log("Post deleted successfully");
    //     // Optionally trigger a refresh of the post list in the parent component here
    //   })
    //   .catch((error) => console.error("Error deleting post:", error));
  };

  const editPost = () => {
    const userI = JSON.parse(localStorage.getItem("userI"));

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `${userI.token}`);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      content: editedContent,
      id: postID,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://localhost:5000/api/posts/editPost", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setPosts((prevPosts) => {
          return prevPosts.map((post) => {
            return post._id === postID
              ? { ...post, content: editedContent }
              : post;
          });
        });
        setIsEditing(false);
      })
      .catch((error) => console.error(error));

    // fetch(`http://localhost:3000/api/posts/editPost`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ id: postID, content: editedContent }),
    // })
    //   .then((response) => response.json())
    //   .then(() => {
    //     setIsEditing(false);
    //     // Optionally refresh the post to show updated content
    //   })
    //   .catch((error) => console.error("Error updating post:", error));
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
