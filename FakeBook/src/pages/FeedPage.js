import React, { useState, useEffect, useContext } from 'react';
import '../css/pagesCss/FeedPage.css';
import NavBar from '../Bars/NavBar';
import Post from '../inputs/Post';
import PageNavigator from './PageNavigator';
import { useUser } from '../pages/UserContext';

// function FeedPage({ isApproveToBorwse, onApproveToBrowse, premissionRef }) {
//     const { user } = useUser(); // Use user context to access user details
//     const [inputText, setInputText] = useState('');
//     const [tposts, setPosts] = useState([]);
function FeedPage({ isApproveToBorwse, onApproveToBrowse, premissionRef }) {
    // const { user, logOut } = useUser();
    const [tposts, setPosts] = useState([]);
    const [inputText, setInputText] = useState('');
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
        const userI = JSON.parse(localStorage.getItem('userI'));
        console.log(userI);
        fetch(`http://127.0.0.1:5000/api/users/${userI.username}/posts`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${userI.token}`
            },
        })
        .then(response => {
            if (response.status === 404) {
                console.log('No posts found, setting posts to empty.');
                setPosts([]); // Set posts to empty if the response is 404
                return; // Stop further processing
            }
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            return response.json();
        })
        .then(data => {
            if (data) { // Ensure there's data before setting it
                setPosts(data);
            }
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
            setPosts([]); // Optionally reset posts on any error
        });
    };
    

    const handleNewPost = () => {
        const userI = JSON.parse(localStorage.getItem('userI'));
        if (inputText.trim() !== '') {
            const newPost = {
                author: userI.username, // Assuming the username is the author
                profilePicture: userI.profilePicture, // You need to manage how to get/set profile picture
                content: inputText,
                date: new Date().toISOString()
            };
            console.log("Hillel the king");
            console.log("DATE: ",newPost.date);
            fetch(`http://127.0.0.1:5000/api/users/${userI.username}/posts/createPost`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userI.token}`
                },
                body: JSON.stringify(newPost)
            })
            .then(response => response.json())
            .then(post => {
                setPosts([post, ...tposts]);
                setInputText('');
            })
            .catch(error => console.error('Error creating post:', error));
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
        return <PageNavigator caller={'FeedPage'} />;
    }

    return (
        <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
            <NavBar firstHandleClick={handleLogOut} />
            <div className="float-parent-element">
                <div className="float-child-element">
                    <div className="left">
                        {tposts.map(post => (
                            <Post
                                key={post._id}
                                postID={post._id}
                                author={post.author}
                                content={post.content}
                                date={post.date}
                                handleDelete={handleRemovePost}
                                handleEdit={handlePostEdit}
                                isDarkMode={isDarkMode} // Assuming isDarkMode is managed globally or passed as a prop
                            />
                        ))}
                    </div>
                </div>
                <div className="float-child-element">
                    <div className="right">
                        <div className="new_post_box">
                            <h2 className="post_head">Write New Post</h2>
                            <form onSubmit={handleSubmit}>
                                <input
                                    className="new-post-input"
                                    type="text"
                                    value={inputText}
                                    onChange={e => setInputText(e.target.value)}
                                    placeholder="What's on your mind..."
                                    required
                                />
                                <button className="new-post-button">Add Post</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FeedPage;
