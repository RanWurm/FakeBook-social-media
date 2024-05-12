package com.example.projectpart2.api;

import android.content.Context;
import android.util.Log;

import androidx.lifecycle.MutableLiveData;
import androidx.room.Room;

import com.example.projectpart2.AppDB;
import com.example.projectpart2.UserCredentials;
import com.example.projectpart2.dao.UserDao;
import com.example.projectpart2.entities.User;
import com.google.gson.Gson;

import java.util.List;
import java.util.concurrent.Executors;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class UserAPI {
    private AppDB db;
    private UserDao dao;
    private Retrofit retrofit;
    private WebServiceAPI webServiceAPI;

    private MutableLiveData<List<Integer>> friendsListData;
    private MutableLiveData<User> userData;

    private MutableLiveData<Boolean> actionSuccess;


    public UserAPI(Context context, MutableLiveData<List<Integer>> friendsListData, MutableLiveData<User> userData,
                   MutableLiveData<Boolean> loginSuccess) {
        this.db = Room.databaseBuilder(context, AppDB.class, "SocialNetworkDB").allowMainThreadQueries().fallbackToDestructiveMigration().build();
        this.dao = db.userDao();
        this.userData = userData;
        this.friendsListData = friendsListData;
        this.actionSuccess = loginSuccess;
        String BASE_URL = "http://10.0.2.2:5000/api/";
        retrofit = new Retrofit.Builder().baseUrl(BASE_URL)
                .callbackExecutor(Executors.newSingleThreadExecutor())
                .addConverterFactory(GsonConverterFactory.create()).build();
        webServiceAPI = retrofit.create(WebServiceAPI.class);
    }

    public void createUser(User newUser) {
        Call<User> call = webServiceAPI.createUser(newUser);
        Log.i("UserAPI", "in create user function of user api");
        call.enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                if (response.isSuccessful()) {
                    Log.i("UserAPI", "in response of create user");
                    actionSuccess.postValue(true);
                    Thread dbThread = new Thread(() -> dao.insert(response.body())); // Ensure this runs on a background thread
                    dbThread.start();
                    Log.d("UserAPI", "User created successfully");
                } else {
                    actionSuccess.postValue(false);
                    Log.d("UserAPI", "Failed to create user: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                actionSuccess.postValue(false);
                Log.e("UserAPI", "Error occurred while creating user", t);
            }
        });
    }

    public void login(UserCredentials credentials) {

        webServiceAPI.createToken(credentials).enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                if (response.isSuccessful()) {
                    Log.d("UserAPI", "User data: " + new Gson().toJson(response.body()));
                    Thread dbThread = new Thread(() -> dao.upsert(response.body())); // Ensure this runs on a background thread
                    dbThread.start();
                    userData.postValue(response.body());
                } else {
                    actionSuccess.postValue(false);
                    Log.d("UserAPI", "Failed to login user: " + response.code());

                }
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                actionSuccess.postValue(false);
                Log.e("UserAPI", "Error occurred while deleting user", t);
            }
        });

    }

    public void getUser(int id, String token) {

        webServiceAPI.getUser(id, token).enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                if (response.isSuccessful()) {
                    userData.postValue(response.body());
                } else {
                    // Handle the failure based on the response code
                    Log.d("UserAPI", "Failed to find user: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                // Handle the error occurred while attempting to communicate with the server
                Log.e("UserAPI", "Error occurred while finding user", t);
            }
        });


    }

    public void editUser(int id, String token, User user) {

        webServiceAPI.editUser(id, token, user).enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                if (response.isSuccessful()) {
                    Thread dbThread = new Thread(() -> dao.update(response.body())); // Ensure this runs on a background thread
                    dbThread.start();
                } else {
                    // Handle the failure based on the response code
                    Log.d("UserAPI", "Failed to find user: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                // Handle the error occurred while attempting to communicate with the server
                Log.e("UserAPI", "Error occurred while finding user", t);
            }
        });

    }

    public void deleteUser(int userId, String token) {

        webServiceAPI.deleteUser(userId, token).enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                if (response.isSuccessful()) {
                    Thread dbThread = new Thread(() -> dao.delete(response.body())); // Ensure this runs on a background thread
                    dbThread.start();
                    Log.d("UserAPI", "User deleted successfully");
                } else {
                    Log.d("UserAPI", "Failed to delete user: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                Log.e("UserAPI", "Error occurred while deleting user", t);
            }
        });
    }

    //function to get a list of the user friends
    public void getUserFriends(int id, String token) {
        webServiceAPI.getUserFriends(id, token).enqueue(new Callback<List<Integer>>() {
            @Override
            public void onResponse(Call<List<Integer>> call, Response<List<Integer>> response) {
                if (response.isSuccessful()) {
                    friendsListData.postValue(response.body());
                    User user = dao.get(id);
                    user.setFriends(response.body());
                    Thread dbThread = new Thread(() -> dao.update(user)); // Ensure this runs on a background thread
                    dbThread.start();
                } else {
                    // Handle the failure based on the response code
                    Log.d("UserAPI", "Failed to get user friends: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<List<Integer>> call, Throwable t) {
                // Handle the error occurred while attempting to communicate with the server
                Log.e("UserAPI", "Error occurred while finding user", t);
            }
        });

    }

    public void sendFriendRequest(int id, String token) {

        webServiceAPI.sendFriendRequest(id, token).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    User sender = dao.getByToken(token);
                    User recipient = dao.get(id);
                    recipient.addFriendRequest(sender.getId());
                    Thread dbThread = new Thread(() -> dao.update(recipient)); // Ensure this runs on a background thread
                    dbThread.start();
                } else {
                    // Handle the failure based on the response code
                    Log.d("UserAPI", "Failed to find user: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                // Handle the error occurred while attempting to communicate with the server
                Log.e("UserAPI", "Error occurred while finding user", t);
            }
        });

    }
    public void approveFriendRequest(int recipientID, int senderID, String token) {

        webServiceAPI.approveRequest(recipientID, senderID, token).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    User recipient = dao.get(recipientID);
                    User sender = dao.get(senderID);
                    recipient.deleteFriendRequest(senderID);
                    recipient.addFriend(senderID);
                    sender.addFriend(recipientID);
                    Thread dbThread = new Thread(() -> dao.update(recipient, sender)); // Ensure this runs on a background thread
                    dbThread.start();
                } else {
                    // Handle the failure based on the response code
                    Log.d("UserAPI", "Failed to find friend request: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                // Handle the error occurred while attempting to communicate with the server
                Log.e("UserAPI", "Error occurred while finding friend request", t);
            }
        });

    }

    public void deleteFriend(int id, int deletedID, String token) {

        webServiceAPI.deleteFriend(id, deletedID, token).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    User user = dao.get(id);
                    User deletedUser = dao.get(deletedID);
                    user.deleteFriend(deletedID);
                    deletedUser.deleteFriend(id);
                    Thread dbThread = new Thread(() -> dao.update(user, deletedUser)); // Ensure this runs on a background thread
                    dbThread.start();
                } else {
                    // Handle the failure based on the response code
                    Log.d("UserAPI", "Failed to find delete friend: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                // Handle the error occurred while attempting to communicate with the server
                Log.e("UserAPI", "Error occurred while trying to delete friend", t);
            }
        });

    }


//
//    private static int findIndex(List<User> users, UserCredentials credentials) {
//        List<User> filtered = (List<User>) users.stream().filter((a) -> a.getUsername() ==
//                credentials.getUsername() && a.getPassword() == credentials.getPassword());
//        return filtered.get(0).getId();
//    }
//    private User findUserByToken(String token) {
//        List<User> filtered = (List<User>) dao.index().stream().filter((a) -> a.getToken() == token);
//        return filtered.get(0);
//    }
//    private User findUserById(int id) {
//        List<User> filtered = (List<User>) dao.index().stream().filter((a) -> a.getId() == id);
//        return filtered.get(0);
//    }
}
