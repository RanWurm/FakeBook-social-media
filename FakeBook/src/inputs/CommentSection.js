import React from 'react';
import '../css/inputsCss/Comment.css';

const Comment = ({commentId,commentList,issShow }) => {
  if (commentList===0 || issShow === false){
    return(<div></div>);
  }
  return (
    <div>
      <ul>
        {/* Render the list items */}
        {commentList.map((text, index) => (
          <div className="comment" key={index}>{text}</div>
        ))}
       </ul>
        </div>
  );
};

export default Comment;
