package com.example.projectpart2.viewmodels;

import android.content.Context;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;
import androidx.lifecycle.ViewModelProvider;

import com.example.projectpart2.UserCredentials;
import com.example.projectpart2.dao.UserDao;
import com.example.projectpart2.entities.Post;
import com.example.projectpart2.entities.User;
import com.example.projectpart2.repositories.UsersRepository;

import java.util.List;
import java.util.concurrent.Future;

public class UsersViewModel extends ViewModel {
    private UsersRepository usersRepository;
    private LiveData<User> user;
    private LiveData<List<Integer>> friends;
    private LiveData<Boolean> actionSuccess;

    public UsersViewModel(Context context) {
        this.usersRepository = new UsersRepository(context);
        this.user = usersRepository.getUserData();
        this.friends = usersRepository.getFriendsListData();
        this.actionSuccess = usersRepository.getLoginStatus();
    }

    public static class UsersViewModelFactory implements ViewModelProvider.Factory {
        private final Context context;

        public UsersViewModelFactory(Context context) {
            this.context = context.getApplicationContext(); // Use application context to avoid leaks
        }

        @Override
        public <T extends ViewModel> T create(Class<T> modelClass) {
            if (modelClass.isAssignableFrom(UsersViewModel.class)) {
                return (T) new UsersViewModel(context);
            }
            throw new IllegalArgumentException("Unknown ViewModel class");
        }
    }

    public void createUser(User user) {
        usersRepository.createUser(user);
    }


    public void login(UserCredentials details) {
        usersRepository.login(details);
    }

    public void getUser(int id, String token) {
        usersRepository.getUser(id, token);
    }

    public void deleteUser(int id, String token) {
        usersRepository.deleteUser(id, token);
    }

    public void editUser(int id, String token, User user) {
        usersRepository.editUser(id, token, user);
    }

    public void getUserFriends(int id, String token) {
        usersRepository.getUserFriends(id, token);
    }

    public void sendFriendRequest(int id, String token) {
        usersRepository.sendFriendRequest(id, token);
    }

    public void approveFriendRequest(int recipientID, int senderID, String token) {
        usersRepository.approveFriendRequest(recipientID, senderID, token);
    }

    public void deleteFriend(int id, int deletedID, String token) {
        usersRepository.deleteFriend(id, deletedID, token);
    }

    public LiveData<Boolean> getActionSuccess() {
        return this.actionSuccess;
    }
    public LiveData<User> getUserData() {
        return this.user;
    }
    public LiveData<List<Integer>> getFriendsListData() {
        return this.friends;
    }
}
