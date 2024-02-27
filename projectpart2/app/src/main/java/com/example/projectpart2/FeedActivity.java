package com.example.projectpart2;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.view.MenuItem;
import android.view.View;
import android.widget.PopupMenu;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.example.myapplication.R;
import com.example.myapplication.databinding.ActivityFeedBinding;

import java.util.ArrayList;
import java.util.List;
public class FeedActivity extends AppCompatActivity {


    private static List<Post> posts = new ArrayList<>();
    private ActivityFeedBinding binding;
    private User currentUser;
    private ActivityResultLauncher<Intent> editPostActivityResultLauncher;
    private ActivityResultLauncher<Intent> newPostActivityResultLauncher;

    private boolean darkMode = false;

    public ActivityResultLauncher<Intent> getEditPostActivityResultLauncher() {
        return editPostActivityResultLauncher;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        final PostsListAdapter adapter = new PostsListAdapter(this);

        currentUser = (User) getIntent().getSerializableExtra("currentUser");

        super.onCreate(savedInstanceState);
        binding = ActivityFeedBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        binding.imageMenuButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                showPopupMenu(view, FeedActivity.this);
            }
        });


        binding.lstPosts.setAdapter(adapter);
        binding.lstPosts.setLayoutManager(new LinearLayoutManager(this));

        List<User> users = MainActivity.getUsers();
        for (int i = 0; i < 10; i++) {
            if (i % 3 == 0) {
                posts.add(new Post(users.get(0), "hello world!", "cat"));
                posts.get(i).addComment("hellooooo!");
            } else if (i % 3 == 1) {
                posts.add(new Post(users.get(1), "hello!", "dog"));
                posts.get(i).addComment("how are you?");
            }
            else {
                posts.add(new Post(users.get(2), "what's up?", "bunnies"));
                posts.get(i).addComment("great!");
            }
        }

        adapter.setPosts(posts);
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
        binding.btnAdd.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                Intent intent = new Intent(FeedActivity.this, newPostActivity.class);
                intent.putExtra("currentUser", currentUser);
                startNewPostActivity(intent);
            }
        });
        binding.btnDarkMode.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {


                activateNightMode(FeedActivity.this, adapter);
            }
        });

        editPostActivityResultLauncher = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
                    if (result.getResultCode() == Activity.RESULT_OK) {
                        Intent data = result.getData();
                        if (data != null) {
                            Post updatedPost = (Post) data.getSerializableExtra("updated_post");
                            // Assuming you have a method to update the post in your adapter's data set
                            adapter.updatePost(updatedPost);
                        }
                    }
                });
        newPostActivityResultLauncher = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
                    if (result.getResultCode() == Activity.RESULT_OK) {
                        Intent data = result.getData();
                        if (data != null) {
                            Post newPost = (Post) data.getSerializableExtra("new_post");
                            // Assuming you have a method to update the post in your adapter's data set
                            adapter.addPost(newPost);
                        }
                    }
                });


    }

    private void showPopupMenu(View view, Context context) {
        PopupMenu popupMenu = new PopupMenu(FeedActivity.this, view);
        popupMenu.getMenuInflater().inflate(R.menu.menu_example, popupMenu.getMenu());
        popupMenu.setOnMenuItemClickListener(new PopupMenu.OnMenuItemClickListener() {
            @Override
            public boolean onMenuItemClick(MenuItem menuItem) {
                Toast.makeText(FeedActivity.this, menuItem.getTitle() + " clicked", Toast.LENGTH_SHORT).show();
                int id = menuItem.getItemId();

                if (id == R.id.menu_option_logout) {
                    // User chose the "Log out" item, change to the login screen
                    Intent intent = new Intent(context, MainActivity.class);
                    startActivity(intent);
                    finish();

                }
                return true;
            }

        });
        popupMenu.show();

    }

    public void startEditPostActivity(Intent intent) {
        editPostActivityResultLauncher.launch(intent);
    }
    public void startNewPostActivity(Intent intent) {
        newPostActivityResultLauncher.launch(intent);
    }
    public void activateNightMode(Context context, PostsListAdapter adapter) {
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
    public static boolean isNightModeEnabled(Context context) {
        int nightModeFlags = context.getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK;
        return nightModeFlags == Configuration.UI_MODE_NIGHT_YES;
    }
}
