package com.example.projectpart2.repositories;

import android.content.Context;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.room.Room;

import com.example.projectpart2.AppDB;
import com.example.projectpart2.api.PostAPI;
import com.example.projectpart2.api.UserAPI;
import com.example.projectpart2.dao.PostDao;
import com.example.projectpart2.dao.UserDao;
import com.example.projectpart2.entities.Post;
import com.example.projectpart2.entities.User;

import java.util.List;

public class PostsRepository {
    private AppDB db;
    private PostDao dao;
    private MutableLiveData<List<Post>> feedPosts = new MutableLiveData<>();
    private MutableLiveData<List<Post>> profilePosts = new MutableLiveData<>();
    private PostAPI api;


    public PostsRepository(Context context) {
        db = Room.databaseBuilder(context, AppDB.class, "SocialNetworkDB").allowMainThreadQueries().fallbackToDestructiveMigration().build();
        dao = db.postDao();
        api = new PostAPI(feedPosts, profilePosts, dao);


    }


    public LiveData<List<Post>> getFeedPosts() {
        return feedPosts;
    }
    public LiveData<List<Post>> getProfilePosts() {
        return profilePosts;
    }
    public void getPosts(String token) {
        new Thread(() -> { //not in the main thread - need to use postValue()
            feedPosts.postValue(dao.getLatestPostsFromFriendsAndNonFriends(token));
            api.getPosts(token);
        }).start();
    }
    public void getUserPosts(int id, String token) {
        new Thread(() -> { //not in the main thread - need to use postValue()
            profilePosts.postValue(dao.getUserPosts(id, token));
            api.getUserPosts(id, token);
        }).start();
    }
    public void createPost(int id, String token, Post post) {
        api.createPost(id, token, post);
    }

    public void editPost(int id, int pid, String token, Post post) {
        api.editPost(id, pid, token, post);
    }

    public void deletePost(int id, int pid, String token) {
        api.deletePost(id, pid, token);
    }

}

