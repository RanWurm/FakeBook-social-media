package com.example.projectpart2.activities;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.drawable.Drawable;
import android.icu.text.SimpleDateFormat;
import android.net.Uri;
import android.os.Bundle;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;
import androidx.room.Room;

import com.example.myapplication.databinding.ActivityNewPostBinding;
import com.example.projectpart2.AppDB;
import com.example.projectpart2.dao.PostDao;
import com.example.projectpart2.dao.UserDao;
import com.example.projectpart2.adapters.PostsListAdapter;
import com.example.projectpart2.entities.Post;
import com.example.projectpart2.entities.User;
import com.example.projectpart2.viewmodels.PostsViewModel;
import com.example.projectpart2.viewmodels.UsersViewModel;

import java.util.Date;

public class newPostActivity extends AppCompatActivity {
    private ActivityResultLauncher<String> getContent;
    private Uri selectedImageUri;
    private ActivityNewPostBinding binding;

    private static int postsCounter = 1;

    private int currentUserId;

    private AppDB db;
    private PostDao postDao;
    private UserDao userDao;
    private PostsViewModel postsViewModel;
    private User currentUser;

    protected void onCreate(Bundle savedInstanceState) {

        currentUserId = getIntent().getIntExtra("currentUserId", -1);


        super.onCreate(savedInstanceState);
        binding = ActivityNewPostBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        db = Room.databaseBuilder(getApplicationContext(), AppDB.class, "SocialNetworkDB").allowMainThreadQueries().
                fallbackToDestructiveMigration().build();
        postDao = db.postDao();
        userDao = db.userDao();

        PostsViewModel.PostsViewModelFactory postsFactory = new PostsViewModel.PostsViewModelFactory(this);
        postsViewModel = new ViewModelProvider(this, postsFactory).get(PostsViewModel.class);
        this.currentUser = userDao.get(currentUserId);

        Drawable imageAuthor;
        if (PostsListAdapter.isDrawableResource(this, currentUser.getPic())) {
            imageAuthor = PostsListAdapter.getDrawableFromStringName(this, currentUser.getPic());
        }
        else {
            Bitmap bitmap1 = PostsListAdapter.getBitmapFromFilePath(currentUser.getPic());
            imageAuthor = PostsListAdapter.getDrawableFromBitmap(this, bitmap1);
        }
        binding.authorImage.setImageDrawable(imageAuthor);
        binding.tvAuthor.setText(currentUser.getDisplayName());
        getContent = registerForActivityResult(new ActivityResultContracts.GetContent(), uri -> {
            // This is called when a file is selected
            if (uri != null) {
                binding.imageViewUpload.setImageURI(uri);
                selectedImageUri = uri;
            }
        });

        // Set up the button click listener
        binding.btnSelectImage.setOnClickListener(v -> {
            // Open the gallery
            getContent.launch("image/*");
        });

        binding.postButton.setOnClickListener(v -> {
            addNewPost(this.selectedImageUri);
        });

        binding.closeButton.setOnClickListener(v -> {
            Intent intent = new Intent(this, FeedActivity.class);
            startActivity(intent);
        });

    }

    private void addNewPost(Uri uri) {
        String content = binding.newPostContent.getText().toString();
        Drawable imageDrawable = binding.imageViewUpload.getDrawable();

        // Check if any field is empty or if the image is not uploaded
        if (content.isEmpty() || imageDrawable == null) {
            Toast.makeText(newPostActivity.this, "Please fill in text and upload an image.", Toast.LENGTH_LONG).show();
            return;
        }

        Post post = new Post(currentUser.getId(), content);
        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
        String imageFileName = "JPEG_" + timeStamp + "_";
        String picPath = RegisterActivity.saveImageToInternalStorage(uri, this, imageFileName);
        post.setPicture(picPath);
        postsViewModel.createPost(currentUserId, currentUser.getToken(), post);

        setResult(Activity.RESULT_OK);
        finish();
    }
}
