package com.example.projectpart2;

public class UserCredentials {
    private String userName;
    private String password;

    public UserCredentials(String username, String password) {
        this.userName = username;
        this.password = password;
    }

    // Getters and Setters
    public String getUsername() {
        return userName;
    }

    public void setUsername(String username) {
        this.userName = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}