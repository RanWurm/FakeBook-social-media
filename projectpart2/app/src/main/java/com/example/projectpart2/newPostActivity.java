package com.example.projectpart2;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Bundle;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;

import com.example.myapplication.databinding.ActivityNewPostBinding;

public class newPostActivity extends AppCompatActivity {
    private ActivityResultLauncher<String> getContent;
    private Uri selectedImageUri;
    private ActivityNewPostBinding binding;

    private User currentUser;

    protected void onCreate(Bundle savedInstanceState) {

        currentUser = (User) getIntent().getSerializableExtra("currentUser");

        super.onCreate(savedInstanceState);
        binding = ActivityNewPostBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

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

        Post post = new Post(currentUser, content);
        String picPath = RegisterActivity.saveImageToInternalStorage(uri, this, String.valueOf(post.getId()));
        post.setPic(picPath);


        Intent intent = new Intent(this, FeedActivity.class);
        intent.putExtra("new_post", post);
        setResult(Activity.RESULT_OK, intent);
        finish();
    }
}
