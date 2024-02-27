import React, { useState, useEffect } from 'react';
import '../css/pagesCss/FeedPage.css';
import NavBar from '../Bars/NavBar';
import Post from '../inputs/Post';
import RanPic from '../res/myprofile.png';
import posts from '../data/db.json';
import HillelPic from '../res/hilel.png';
import YuliPic from '../res/yuli.png';
import PageNavigator from './PageNavigator';

function FeedPage({ isApproveToBorwse, onApproveToBrowse, premissionRef }) {
    const [inputText, setInputText] = useState('');
    const [logOut, setLogOut] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false); // Change to true for initial dark mode
    const [clickedPostId, setClickedPostId] = useState(null);
    const [editedPostText, setEditedPostText] = useState(null);
    const [removedPostId, setRemovePostId] = useState(null);
    const [tposts, setPosts] = useState(posts);

    useEffect(() => {
        if (logOut) {
            onApproveToBrowse(false);
            premissionRef.current = false;
        }
    }, [logOut, onApproveToBrowse, premissionRef]);

    const handleLogOut = () => {
        setLogOut(true);
    };

    const toggleDarkMode = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    if (!isApproveToBorwse) {
        return <PageNavigator caller={'FeedPage'} />;
    }

    let profilePics = {
        Ran: {
            pic: RanPic,
        },
        Hilel: {
            pic: HillelPic,
        },
        Yuli: {
            pic: YuliPic,
        },
    };

    const handleClickPost = (id) => {
        setClickedPostId(id);
    };

    const handleNewPost = () => {
        const today = new Date();
        if (inputText.trim() !== '') {
            const newPost = {
                postId: Date.now(),
                author: 'Ranel',
                icon: 'Ran',
                content: inputText,
                date:   today.toString()
            };
            setPosts([newPost, ...tposts]);
            setInputText('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleNewPost();
    };

    const handleRemovePost = (id) => {
        setRemovePostId(id);
        setPosts(prevPosts => prevPosts.filter(post => post.postId !== id));
    };

    const handlePostEdit = (id, text) => {
        setClickedPostId(id);
        setEditedPostText(text);
        const updatedPosts = tposts.map(post =>
            post.postId === id ? { ...post, content: text } : post
        );
        setPosts(updatedPosts);
        setClickedPostId(null);
        setEditedPostText(null);
    };
    

    return (
        <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
            <NavBar firstHandleClick={handleLogOut} darkMode = {isDarkMode}toggleDarkMode={toggleDarkMode} />
            <div className="float-parent-element">
                <div className="float-child-element">
                    <div className="left">
                        {tposts.map(post => (
                            <Post
                                darkMode = {isDarkMode}
                                key={post.postId}
                                postID={post.postId}
                                author={post.author}
                                icon={profilePics[post.icon].pic}
                                content={post.content}
                                date = {post.date}
                                handleDelete={handleRemovePost}
                                handleEdit={handlePostEdit}
                                handleGetPost={handleClickPost}
                                isDarkMode={isDarkMode} // Pass isDarkMode as a prop
                            />
                        ))}
                    </div>
                </div>
                <div className="float-child-element">
                    <div className="right">
                        <div className="new_post_box">
                            <h2 className="post_head">Write New FakePost</h2>
                            <form onSubmit={handleSubmit}>
                                <input
                                    className="new-post-input"
                                    type="text"
                                    value={inputText}
                                    onChange={e => setInputText(e.target.value)}
                                    placeholder="What's on your fakeMind..."
                                    required
                                />
                            </form>
                            <button className="new-post-button" onClick={handleNewPost}>
                                add FakPost
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FeedPage;
