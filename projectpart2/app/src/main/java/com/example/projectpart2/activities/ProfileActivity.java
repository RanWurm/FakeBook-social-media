package com.example.projectpart2.activities;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.util.Log;
import android.view.View;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.room.Room;

import com.example.myapplication.databinding.ActivityProfileBinding;
import com.example.projectpart2.AppDB;
import com.example.projectpart2.adapters.PostsListAdapter;
import com.example.projectpart2.dao.UserDao;
import com.example.projectpart2.entities.User;
import com.example.projectpart2.viewmodels.UsersViewModel;

import java.util.List;

public class ProfileActivity extends AppCompatActivity {
    private ActivityProfileBinding binding;
    private String currentUserToken;
    private int wantedUserId;
    private AppDB db;
    private UserDao userDao;
    private PostsListAdapter adapter;
    private UsersViewModel usersViewModel;

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityProfileBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        db = Room.databaseBuilder(getApplicationContext(), AppDB.class, "SocialNetworkDB").allowMainThreadQueries().fallbackToDestructiveMigration().build();
        userDao = db.userDao();

        UsersViewModel.UsersViewModelFactory usersfactory = new UsersViewModel.UsersViewModelFactory(this);
        usersViewModel = new ViewModelProvider(this, usersfactory).get(UsersViewModel.class);

        currentUserToken = getIntent().getExtras().getString("currentUserToken");
        wantedUserId = getIntent().getExtras().getInt("wantedUserId");
        Log.i("profile activity", currentUserToken);
        Log.i("profile activity", String.valueOf(wantedUserId));

        adapter = new PostsListAdapter(this, currentUserToken, "profile", wantedUserId);
        User wantedUser = userDao.get(wantedUserId);
        User currentUser = userDao.getByToken(currentUserToken);

        binding.profileName.setText(wantedUser.getDisplayName());
        Drawable imgDrawable;
        if (PostsListAdapter.isDrawableResource(this, wantedUser.getPic())) {
            imgDrawable = PostsListAdapter.getDrawableFromStringName(this, wantedUser.getPic());
        } else {
            Bitmap bitmap1 = PostsListAdapter.getBitmapFromFilePath(wantedUser.getPic());
            imgDrawable = PostsListAdapter.getDrawableFromBitmap(this, bitmap1);
        }
        binding.profileImage.setImageDrawable(imgDrawable);
        binding.lstPosts.setAdapter(adapter);
        binding.lstPosts.setLayoutManager(new LinearLayoutManager(this));

        boolean requestedFound = requested(wantedUserId, currentUserToken);
        boolean requestFound = requestFound(wantedUserId, currentUserToken);
        boolean areFriends = areFriends(wantedUserId, currentUserToken);

        usersViewModel.getFriendsListData().observe(this, friends -> {
            adapter.setPosts();
            binding.lstPosts.setVisibility(View.VISIBLE);
        });
        usersViewModel.getUserFriends(wantedUserId, currentUserToken);

        if (requestedFound) {
            binding.tvPending.setVisibility(View.VISIBLE);
        }
        else if (requestFound) {
            binding.buttonConfirmRequest.setVisibility(View.VISIBLE);
        }
        else if (areFriends) {
            binding.buttonDeleteFriend.setVisibility(View.VISIBLE);
        }
        else {
            binding.buttonAddFriend.setVisibility(View.VISIBLE);
        }
//        usersViewModel.getFriendsListData().observe(this, friends -> {
//            if (wantedUserId != currentUser.getId()) {
//                binding.buttonDeleteFriend.setVisibility(View.VISIBLE);
//            }
//            adapter.setPosts();
//            binding.lstPosts.setVisibility(View.VISIBLE);
//        });
//        usersViewModel.getUserFriends(wantedUserId, currentUserToken);
//        boolean requestFound = requestFound(wantedUserId, currentUserToken);
//        if (requestFound) {
//            binding.buttonConfirmRequest.setVisibility(View.VISIBLE);
//        }
//
//        boolean areFriends = areFriends(wantedUserId, currentUserToken);
//        if (areFriends) {
//            binding.buttonDeleteFriend.setVisibility(View.VISIBLE);
//            adapter.setPosts();
//            binding.lstPosts.setVisibility(View.VISIBLE);
//        }
//        boolean userItself = false;
//        if (wantedUserId == currentUser.getId()) {
//            userItself = true;
//        }
//
//        if (!areFriends && !requestFound && !userItself) {
//            binding.buttonAddFriend.setVisibility(View.VISIBLE);
//        }
        binding.buttonAddFriend.setOnClickListener(v -> {
            Log.i("buttonAddFriend", "in the click");
            usersViewModel.sendFriendRequest(wantedUserId, currentUserToken);
            binding.buttonAddFriend.setVisibility(View.GONE);
            binding.tvPending.setVisibility(View.VISIBLE);
        });
        binding.buttonConfirmRequest.setOnClickListener(v -> {
            User user = userDao.getByToken(currentUserToken);
            usersViewModel.approveFriendRequest(user.getId(), wantedUserId, currentUserToken);
            adapter.setPosts();
            binding.lstPosts.setVisibility(View.VISIBLE);
            binding.buttonConfirmRequest.setVisibility(View.GONE);
            binding.buttonDeleteFriend.setVisibility(View.VISIBLE);
        });
        binding.buttonDeleteFriend.setOnClickListener(v -> {
            User user = userDao.getByToken(currentUserToken);
            usersViewModel.deleteFriend(user.getId(), wantedUserId, currentUserToken);
            binding.buttonDeleteFriend.setVisibility(View.GONE);
            binding.lstPosts.setVisibility(View.GONE);
            binding.buttonAddFriend.setVisibility(View.VISIBLE);
            binding.buttonAddFriend.setEnabled(true);
        });
        binding.imageBackwardsButton.setOnClickListener(v -> {
            Intent intent = new Intent(this, FeedActivity.class);
            intent.putExtra("currentUserId", currentUser.getId());
            intent.putExtra("currentUserToken", currentUserToken);
            startActivity(intent);
        });

    }

    public boolean requestFound(int wantedUserId, String currentUserToken) {
        User user = userDao.getByToken(currentUserToken);
        List<Integer> requests = user.getFriendRequests();
        for (int requester : requests) {
            if (requester == wantedUserId) {
                return true;
            }
        }
        return false;
    }

    public boolean requested(int wantedUserId, String currentUserToken) {
        User user = userDao.getByToken(currentUserToken);
        int userId = user.getId();
        User wantedUser = userDao.get(wantedUserId);
        List<Integer> requests = wantedUser.getFriendRequests();
        for (int requester : requests) {
            if (requester == userId) {
                return true;
            }
        }
        return false;

    }

    public boolean areFriends(int wantedUserId, String currentUserToken) {
        User user = userDao.getByToken(currentUserToken);
        List<Integer> friends = user.getFriends();
        for (int id : friends) {
            if (id == wantedUserId) {
                return true;
            }
        }
        return false;
    }
}
