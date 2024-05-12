package com.example.projectpart2.repositories;


import android.content.Context;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.projectpart2.UserCredentials;
import com.example.projectpart2.api.UserAPI;
import com.example.projectpart2.entities.User;

import java.util.List;

public class UsersRepository {
    private UserAPI api;

    private MutableLiveData<List<Integer>> friendsListData = new MutableLiveData<>();

    private MutableLiveData<User> userData = new MutableLiveData<>();

    private MutableLiveData<Boolean> actionSuccess = new MutableLiveData<>();



    public UsersRepository(Context context) {

        api = new UserAPI(context, friendsListData, userData, actionSuccess);


    }

        public void createUser(User user) {
            api.createUser(user);
    }


    public void login(UserCredentials details) {
           api.login(details);
    }

    public void getUser(int id, String token) {
        api.getUser(id, token);
    }

    public void deleteUser(int id, String token) {
        api.deleteUser(id, token);
    }

    public void editUser(int id, String token, User user) {
        api.editUser(id, token, user);
    }

    public void getUserFriends(int id, String token) {
        api.getUserFriends(id, token);
    }

    public void sendFriendRequest(int id, String token) {
        api.sendFriendRequest(id, token);
    }

    public void approveFriendRequest(int recipientID, int senderID, String token) {
        api.approveFriendRequest(recipientID, senderID, token);
    }

    public void deleteFriend(int id, int deletedID, String token) {
        api.deleteFriend(id, deletedID, token);
    }

    public LiveData<List<Integer>> getFriendsListData() {
        return this.friendsListData;
    }

    public LiveData<User> getUserData() {
        return this.userData;
    }
    public LiveData<Boolean> getLoginStatus() {
        return this.actionSuccess;
    }

}
