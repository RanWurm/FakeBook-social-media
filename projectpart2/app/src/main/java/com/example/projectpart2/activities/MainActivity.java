package com.example.projectpart2.activities;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModel;
import androidx.lifecycle.ViewModelProvider;
import androidx.room.Room;

import com.example.myapplication.databinding.ActivityMainBinding;
import com.example.projectpart2.AppDB;
import com.example.projectpart2.UserCredentials;
import com.example.projectpart2.api.UserAPI;
import com.example.projectpart2.entities.Post;
import com.example.projectpart2.viewmodels.PostsViewModel;
import com.example.projectpart2.viewmodels.UsersViewModel;
import com.example.projectpart2.dao.UserDao;
import com.example.projectpart2.entities.User;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Future;

public class MainActivity extends AppCompatActivity {

    private ActivityMainBinding binding;
    private UsersViewModel usersViewModel;
    private PostsViewModel postsViewModel;
    private List<User> users = new ArrayList<>();
    private AppDB db;
    private UserDao userDao;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        db = Room.databaseBuilder(getApplicationContext(), AppDB.class, "SocialNetworkDB").allowMainThreadQueries().fallbackToDestructiveMigration().build();
        userDao = db.userDao();
        UsersViewModel.UsersViewModelFactory usersFactory = new UsersViewModel.UsersViewModelFactory(this);
        usersViewModel = new ViewModelProvider(this, usersFactory).get(UsersViewModel.class);

        PostsViewModel.PostsViewModelFactory postsFactory = new PostsViewModel.PostsViewModelFactory(this);
        postsViewModel = new ViewModelProvider(this, postsFactory).get(PostsViewModel.class);

        usersViewModel.getUserData().observe(this, user -> {
            if (user != null) {
                Intent intent = new Intent(this, FeedActivity.class);
                intent.putExtra("currentUserId", user.getId());
                intent.putExtra("currentUserToken", user.getToken());
                startActivity(intent);
            }
            else {
                Toast.makeText(MainActivity.this, "Login failed", Toast.LENGTH_LONG).show();
            }
        });

//        User yuli = new User("yulibar", "t123123123", "Yuli Bar", "yuli");
//        usersViewModel.createUser(yuli);
//
//
//
//        User ran = new User("ranworm", "t123123123", "Ran Wurmbrand", "ran");
//        usersViewModel.createUser(ran);
//
//
//        User hillel = new User("hillelro", "t123123123", "Hillel Rosenthal", "hillel");
//        usersViewModel.createUser(hillel);


        binding.newAccount.setOnClickListener(v -> {
            Intent i = new Intent(this, RegisterActivity.class);
            startActivity(i);
        });

        binding.btnLogin.setOnClickListener(v -> checkLogin());

    }

    private void checkLogin() {

        String username = binding.editTextText.getText().toString();
        String password = binding.editTextTextPassword.getText().toString();
        UserCredentials credentials = new UserCredentials(username, password);
        usersViewModel.login(credentials);

    }
    public void setUsers() {
        users.clear();
        users = userDao.index();
    }
    protected void onResume() {
        super.onResume();
        setUsers();
    }

//    public int getUserID(UserCredentials credentials) {
//        User user = userDao.getByCredentials(credentials.getUsername(), credentials.getPassword());
//        return user.getId();
//    }
//
//    public String getUserToken(UserCredentials credentials) {
//        User user = userDao.getByCredentials(credentials.getUsername(), credentials.getPassword());
//        return user.getToken();
//    }

}
