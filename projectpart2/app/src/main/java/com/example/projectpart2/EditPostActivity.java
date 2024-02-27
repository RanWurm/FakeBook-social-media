package com.example.projectpart2;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;

import com.example.myapplication.databinding.ActivityEditPostBinding;


public class EditPostActivity extends AppCompatActivity {
    private ActivityResultLauncher<String> getContent;
    private String postImage;
    private ActivityEditPostBinding binding;

    private Post currentPost;

    protected void onCreate(Bundle savedInstanceState) {

        currentPost = (Post) getIntent().getSerializableExtra("post");
        postImage = currentPost.getPic();

        super.onCreate(savedInstanceState);
        binding = ActivityEditPostBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
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
                currentPost.setPic(postImage);

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
        currentPost.setContent(content);
        Drawable imageDrawable = binding.imageViewUpload.getDrawable();

        // Check if any field is empty or if the image is not uploaded
        if (content.isEmpty() || imageDrawable == null) {
            Toast.makeText(EditPostActivity.this, "Please fill in text and upload an image.", Toast.LENGTH_LONG).show();
            return;
        }

        Intent intent = new Intent(this, FeedActivity.class);
        intent.putExtra("updated_post", currentPost);
        setResult(Activity.RESULT_OK, intent);
        finish();
    }
}
