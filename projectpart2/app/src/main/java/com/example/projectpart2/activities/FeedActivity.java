package com.example.projectpart2.activities;

import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.PopupMenu;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.room.Room;

import com.example.myapplication.R;
import com.example.myapplication.databinding.ActivityFeedBinding;
import com.example.projectpart2.AppDB;
import com.example.projectpart2.dao.PostDao;
import com.example.projectpart2.dao.UserDao;
import com.example.projectpart2.adapters.PostsListAdapter;
import com.example.projectpart2.entities.Post;
import com.example.projectpart2.entities.User;
import com.example.projectpart2.viewmodels.PostsViewModel;
import com.example.projectpart2.viewmodels.UsersViewModel;

import org.w3c.dom.Comment;

import java.util.List;
public class FeedActivity extends AppCompatActivity {

    private ActivityFeedBinding binding;
    private int currentUserId;

    private String currentUserToken;
    PostsListAdapter adapter;

    private boolean darkMode = false;

    private AppDB db;
    private PostDao postDao;
    private UserDao userDao;
    private PostsViewModel postsViewModel;
    private UsersViewModel usersViewModel;


    @Override
    protected void onCreate(Bundle savedInstanceState) {


        db = Room.databaseBuilder(getApplicationContext(), AppDB.class, "SocialNetworkDB").allowMainThreadQueries().fallbackToDestructiveMigration().build();
        postDao = db.postDao();
        userDao = db.userDao();

        UsersViewModel.UsersViewModelFactory usersfactory = new UsersViewModel.UsersViewModelFactory(this);
        usersViewModel = new ViewModelProvider(this, usersfactory).get(UsersViewModel.class);

        PostsViewModel.PostsViewModelFactory postsFactory = new PostsViewModel.PostsViewModelFactory(this);
        postsViewModel = new ViewModelProvider(this, postsFactory).get(PostsViewModel.class);

        super.onCreate(savedInstanceState);
        binding = ActivityFeedBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        currentUserId = getIntent().getExtras().getInt("currentUserId");
        currentUserToken = getIntent().getExtras().getString("currentUserToken");
        Log.i("current Token in feed:", currentUserToken);

        adapter = new PostsListAdapter(this, currentUserToken, "feed", -1);

        usersViewModel.getUser(currentUserId, currentUserToken);
        User currentUser = userDao.get(currentUserId);
        List<User> users = userDao.index();


        Log.i("userId", String.valueOf(currentUserId));
        Log.i("userToken", currentUserToken);

        binding.imageMenuButton.setOnClickListener(view -> showPopupMenu(view, FeedActivity.this));

        binding.lstPosts.setAdapter(adapter);
        binding.lstPosts.setLayoutManager(new LinearLayoutManager(this));

        adapter.setPosts();

        binding.tvAuthor.setText(currentUser.getDisplayName());
        Drawable authorImgDrawable;
        if (PostsListAdapter.isDrawableResource(this, currentUser.getPic())) {
            authorImgDrawable = PostsListAdapter.getDrawableFromStringName(this, currentUser.getPic());
        }
        else {
            Bitmap bitmap1 = PostsListAdapter.getBitmapFromFilePath(currentUser.getPic());
            authorImgDrawable = PostsListAdapter.getDrawableFromBitmap(this, bitmap1);
        }
        binding.authorImage.setImageDrawable(authorImgDrawable);
        binding.btnAdd.setOnClickListener(v -> {

            Intent intent = new Intent(FeedActivity.this, newPostActivity.class);
            intent.putExtra("currentUserId", currentUserId);
            startActivity(intent);

        });
        binding.btnDarkMode.setOnClickListener(v -> activateNightMode(adapter));

    }

    private void showPopupMenu(View view, Context context) {
        PopupMenu popupMenu = new PopupMenu(FeedActivity.this, view);
        popupMenu.getMenuInflater().inflate(R.menu.menu_example, popupMenu.getMenu());
        popupMenu.setOnMenuItemClickListener(menuItem -> {
            Toast.makeText(FeedActivity.this, menuItem.getTitle() + " clicked", Toast.LENGTH_SHORT).show();
            int id = menuItem.getItemId();

            if (id == R.id.menu_option_logout) {
                // User chose the "Log out" item, change to the login screen
                Intent intent = new Intent(context, MainActivity.class);
                startActivity(intent);
                finish();

            }
            return true;
        });
        popupMenu.show();

    }
    public void activateNightMode(PostsListAdapter adapter) {
        if (darkMode) {
            darkMode = false;
            binding.mainLayout.setBackgroundResource(R.drawable.gradient_background);
            binding.searchLayout.setBackgroundResource(R.drawable.search);
            binding.tvAuthor.setTextColor(Color.BLACK);
            binding.etSearch.setHintTextColor(Color.BLACK);
            adapter.onThemeChanged(false);


        } else {
            darkMode = true;
            binding.mainLayout.setBackgroundResource(R.drawable.gradient_background_night);
            binding.searchLayout.setBackgroundResource(R.drawable.search_night);
            binding.tvAuthor.setTextColor(Color.WHITE);
            binding.etSearch.setHintTextColor(Color.WHITE);
            adapter.onThemeChanged(true);

        }
    }
    @Override
    protected void onResume() {
        super.onResume();
        adapter.setPosts();
    }
}
