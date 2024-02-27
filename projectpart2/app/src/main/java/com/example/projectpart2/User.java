package com.example.projectpart2;

import androidx.room.Entity;

import java.io.Serializable;

@Entity
public class User implements Serializable {
    private String username;
    private String password;
    private String displayName;
    private String pic;

    public void setPic(String pic) {
        this.pic = pic;
    }

    public User() {
        this.username = "";
        this.password = "";
        this.displayName = "";
        this.pic = "";
    }
    public User (String username, String password, String displayName) {
        this.username = username;
        this.password = password;
        this.displayName = displayName;
        this.pic = "";
    }
    public User (String username, String password, String displayName, String pic) {
        this.username = username;
        this.password = password;
        this.displayName = displayName;
        this.pic = pic;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getUsername() {
        return username;
    }
    public String getPassword() {
        return password;
    }
    public String getPic() {

        return pic;
    }
}
