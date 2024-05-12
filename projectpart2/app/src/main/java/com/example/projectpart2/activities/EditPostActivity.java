package com.example.projectpart2.activities;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;
import androidx.lifecycle.ViewModelStoreOwner;
import androidx.room.Dao;
import androidx.room.Room;

import com.example.myapplication.databinding.ActivityEditPostBinding;
import com.example.projectpart2.AppDB;
import com.example.projectpart2.dao.PostDao;
import com.example.projectpart2.adapters.PostsListAdapter;
import com.example.projectpart2.dao.UserDao;
import com.example.projectpart2.entities.Post;
import com.example.projectpart2.entities.User;
import com.example.projectpart2.viewmodels.PostsViewModel;
import com.example.projectpart2.viewmodels.UsersViewModel;

import java.util.List;


public class EditPostActivity extends AppCompatActivity {
    private ActivityResultLauncher<String> getContent;
    private String postImage;
    private ActivityEditPostBinding binding;

    private int currentPostId;
    private String currentToken;
    private Post currentPost;
    private AppDB db;
    private PostDao postDao;
    private UserDao userDao;
    private PostsViewModel postsViewModel;

    protected void onCreate(Bundle savedInstanceState) {

        currentPostId = getIntent().getIntExtra("postId", -1);
        currentToken = getIntent().getStringExtra(currentToken);
        super.onCreate(savedInstanceState);
        binding = ActivityEditPostBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        db = Room.databaseBuilder(getApplicationContext(), AppDB.class, "SocialNetworkDB").allowMainThreadQueries().fallbackToDestructiveMigration().build();
        postDao = db.postDao();
        userDao = db.userDao();

        PostsViewModel.PostsViewModelFactory postsFactory = new PostsViewModel.PostsViewModelFactory(this);
        this.postsViewModel = new ViewModelProvider(this, postsFactory).get(PostsViewModel.class);

        currentPost = postDao.get(currentPostId);
        postImage = currentPost.getPic();

        //exhibiting the content and picture of the current post
        binding.editPostContent.setText(currentPost.getContent());

        Drawable pic;
        if (PostsListAdapter.isDrawableResource(this, postImage)) {
            pic = PostsListAdapter.getDrawableFromStringName(this, postImage);
        }
        else {
            Bitmap bitmap1 = PostsListAdapter.getBitmapFromFilePath(currentPost.getPic());
            pic = PostsListAdapter.getDrawableFromBitmap(this, bitmap1);
        }
        binding.imageViewUpload.setImageDrawable(pic);

        getContent = registerForActivityResult(new ActivityResultContracts.GetContent(), uri -> {
            // This is called when a file is selected
            if (uri != null) {
                binding.imageViewUpload.setImageURI(uri);
                postImage = RegisterActivity.saveImageToInternalStorage(uri, this, String.valueOf(currentPost.getId()));
                currentPost.setPicture(postImage);

            }
        });

        // Set up the button click listener
        binding.btnSelectImage.setOnClickListener(v -> {
            // Open the gallery
            getContent.launch("image/*");
        });

        binding.postButton.setOnClickListener(v -> {
            editPost();
        });

        binding.closeButton.setOnClickListener(v -> {
            Intent intent = new Intent(this, FeedActivity.class);
            startActivity(intent);
        });

    }

    private void editPost() {
        String content = binding.editPostContent.getText().toString();
        Drawable imageDrawable = binding.imageViewUpload.getDrawable();

        // Check if any field is empty or if the image is not uploaded
        if (content.isEmpty() || imageDrawable == null) {
            Toast.makeText(EditPostActivity.this, "Please fill in text and upload an image.", Toast.LENGTH_LONG).show();
            return;
        }
        currentPost.setContent(content);
        User currentUser = findUserByPostAuthor(currentPost.getAuthorID());
        postsViewModel.editPost(currentUser.getId(), currentPostId, currentUser.getToken(), currentPost);

        setResult(Activity.RESULT_OK);
        finish();
    }
    public User findUserByPostAuthor(int authorId) {
        User user = userDao.get(authorId);
        return user;
    }
}
