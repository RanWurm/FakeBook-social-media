// Post.js
import React, { useState } from 'react';
import '../css/inputsCss/Post.css'; 
import '../css/inputsCss/Tab.css'
import Edit from '../res/edit.png'
import like_icon from '../res/like.png'
import golden_like from '../res/golden_like.png'
import Comment from '../res/comment_icon.png'
import comment_icon from '../res/comment_icon.png'
import CommentSection from './CommentSection';
import Send from '../res/send_button.png'
import TrashCan from '../res/garbage.png'
import '../css/buttonsCss/Button.css'


function Post  ({ postID, author, icon, content, date, handleDelete, handleEdit, handleGetPost, isDarkMode }) {
    const [likeCount, setLikeCount] = useState(0);
    const [inputText, setInputText] = useState('');
    const [textList, setTextList] = useState([]);
    const [showPosts, setShowPosts] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(content);

    const handleShowpost = () => {
        setShowPosts(!showPosts);
    };

    const handleLikeClick = () => {
        setLikeCount(likeCount + 1);
    };

    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    const handleAddToList = () => {
        if (inputText.trim() !== '') {
            setTextList([...textList, inputText]);
            setInputText('');
        }
    };

    const handleDeleteClick = () => {
        handleDelete(postID);
    };

    const handleEditClick = () => {
        handleGetPost(postID);
        setIsEditing(true);
    };

    const handleSaveEdit = () => {
        setIsEditing(false);
        handleEdit(postID, editedContent);
    };
    
    let like = isDarkMode ?  golden_like : like_icon
   
    return ( 
        <div key={postID} className={`post ${isDarkMode ? 'dark-mode' : ''}`}>
            <div className="post-header">
                <img className="avatar" src={icon} alt={`${author}'s avatar`} />
                <div className="author-name">{author}</div>
                <div className='post-buttons-bar'>
                    <div className='post_right_col'>
                        <div className='delete_post_button'>
                            {isEditing ? (
                               <button className ="interaction-button" onClick={handleSaveEdit}>
                               <img className="interaction-button" src = {Edit}></img>
                               </button>
                            ) : (
                              <button className ="interaction-button" onClick={handleEditClick}>
                              <img className="interaction-button" src = {Edit}></img>
                            </button>
                            )}
                            <button className ="interaction-button" onClick={ handleDeleteClick}>
                              <img className="interaction-button" src = {TrashCan}></img>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="post-date">
                {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>
            <div className="post-content">
                {isEditing ? (
                    <input
                        type="text"
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                    />
                ) : (<p>{editedContent}</p>)}
            </div>
            <span className="interactions-count">
                <span className='right_col'>
                    {likeCount}
                    <img className="interaction-icon" src={like} alt='' /> 
                    {textList.length}
                    <img className="interaction-icon" src={comment_icon} alt='' />
                </span>
            </span> 
            <div className='interactions-section'>
                <div className='post-buttons-bar'>
                    <div className='post_left_col'>
                    <button className ="interaction-button" onClick={handleLikeClick}>
                          <img className="interaction-button" src = {like}></img>
                        </button>
                    </div>
                    <div className='post_center_col'>
                    <button className ="interaction-button" onClick={handleShowpost} >
                    <img className="interaction-button" src = {Comment}></img>
                    </button>
                    </div>
                </div>
            </div>
            <div className="comment-section">
                <CommentSection commentList={textList} issShow={showPosts} />
                <input 
                    className="comment-section" 
                    type="text" 
                    placeholder='add comment'
                    value={inputText}
                    onChange={handleInputChange}
                />
                <div className='left-col'>
                    <button className='send-button' onClick={handleAddToList}>
                        <img className='send-button-logo' src={Send} alt="" />
                    </button>  
                </div>
            </div> 
        </div>
    );
};

export default Post;
