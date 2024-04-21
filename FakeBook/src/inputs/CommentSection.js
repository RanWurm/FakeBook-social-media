import React, { useState, useEffect } from 'react';
import '../css/inputsCss/Comment.css';

const CommentSection = ({ postId }) => {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3000/api/comments/${postId}`)
            .then(response => response.json())
            .then(data => setComments(data.commentSection)) // Assuming 'data' has a 'commentSection'
            .catch(error => console.error('Error fetching comments:', error));
    }, [postId]);

    return (
        <div>
            {comments.map((comment, index) => (
                <div key={index}>{comment.content}</div>
            ))}
        </div>
    );
};

export default CommentSection;
