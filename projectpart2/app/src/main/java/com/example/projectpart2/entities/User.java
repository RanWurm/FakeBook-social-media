package com.example.projectpart2.entities;

import androidx.room.Entity;
import androidx.room.PrimaryKey;

import java.io.Serializable;
import java.util.List;

@Entity
public class User {

    public void setId(int id) {
        this.id = id;
    }

    @PrimaryKey(autoGenerate = true)
    private int id;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    private String token;
    public void setUsername(String username) {
        this.userName = username;
    }

    public String getUserName() {
        return userName;
    }

    public String getNickName() {
        return nickName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    private String userName;

    public void setPassword(String password) {
        this.password = password;
    }

    private String password;

    public void setDisplayName(String displayName) {
        this.nickName = displayName;
    }

    private String nickName;
    private String profilePicture;

    public void setFriends(List<Integer> friends) {
        this.friends = friends;
    }

    private List<Integer> friends;
    private List<Integer> friendRequests;

    public List<Integer> getFriendRequests() {
        return friendRequests;
    }

    public void setFriendRequests(List<Integer> friendRequests) {
        this.friendRequests = friendRequests;
    }

    public List<Integer> getFriends() {
        return friends;
    }

    public void setPic(String pic) {
        this.profilePicture = pic;
    }

    public User() {
        this.userName = "";
        this.password = "";
        this.nickName = "";
        this.profilePicture = "";
        this.token = "";
    }
    public User (String username, String password, String nickName) {
        this.userName = username;
        this.password = password;
        this.nickName = nickName;
        this.profilePicture = "";
        this.token = "";
    }
    public User (String username, String password, String displayName, String pic) {
        this.userName = username;
        this.password = password;
        this.nickName = displayName;
        this.profilePicture = pic;
        this.token = "";
    }
    public int getId() {
        return id;
    }

    public String getDisplayName() {
        return nickName;
    }

    public String getUsername() {
        return userName;
    }
    public String getPassword() {
        return password;
    }
    public String getPic() {

        return profilePicture;
    }

    public void addFriendRequest(Integer requester) {
        this.friendRequests.add(requester);
    }
    public void deleteFriendRequest(Integer requester) {
        this.friendRequests.remove(requester);
    }
    public void addFriend(Integer friendId) {
        this.friends.add(friendId);
    }
    public void deleteFriend(Integer friendId) {
        this.friends.remove(friendId);
    }
}
