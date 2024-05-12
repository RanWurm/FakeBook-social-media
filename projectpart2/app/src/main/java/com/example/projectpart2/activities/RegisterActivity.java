package com.example.projectpart2.activities;

import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Bundle;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;
import androidx.room.Room;

import com.example.myapplication.databinding.ActivityRegisterBinding;
import com.example.projectpart2.AppDB;
import com.example.projectpart2.dao.UserDao;
import com.example.projectpart2.entities.User;
import com.example.projectpart2.viewmodels.PostsViewModel;
import com.example.projectpart2.viewmodels.UsersViewModel;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
public class RegisterActivity extends AppCompatActivity {

    private AppDB db;
    private UserDao userDao;
    private ActivityResultLauncher<String> getContent;
    private ActivityRegisterBinding binding;
    private UsersViewModel usersViewModel;

    private Uri selectedImageUri;
    private List <User> users = new ArrayList<User>();
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityRegisterBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        db = Room.databaseBuilder(getApplicationContext(), AppDB.class, "SocialNetworkDB").allowMainThreadQueries().fallbackToDestructiveMigration().build();
        userDao = db.userDao();
        UsersViewModel.UsersViewModelFactory usersfactory = new UsersViewModel.UsersViewModelFactory(this);
        usersViewModel = new ViewModelProvider(this, usersfactory).get(UsersViewModel.class);
        usersViewModel.getActionSuccess().observe(this, actionSuccess -> {
            if (actionSuccess) {

                Intent intent = new Intent(this, MainActivity.class);
                startActivity(intent);
            }
            else {
                Toast.makeText(RegisterActivity.this, "username already exists", Toast.LENGTH_LONG).show();
            }
        });

        getContent = registerForActivityResult(new ActivityResultContracts.GetContent(), uri -> {
            // This is called when a file is selected
            if (uri != null) {
                binding.imageViewUpload.setImageURI(uri);
                selectedImageUri = uri;
            }
        });

        binding.btnSelectImage.setOnClickListener(v -> {
            // Open the gallery
            getContent.launch("image/*");
        });
        binding.btnRegister.setOnClickListener(v -> registerUser(selectedImageUri));

        binding.imageBackwardsButton.setOnClickListener(v -> {
                Intent intent = new Intent(this, MainActivity.class);
                startActivity(intent);
        });
    }

    private void registerUser(Uri uri) {
        String username = binding.editTextText.getText().toString();
        String password = binding.editTextTextPassword.getText().toString();
        String passwordVerification = binding.editTextTextPasswordVerification.getText().toString();
        String displayName = binding.editTextTextDisplay.getText().toString();
        Drawable imageDrawable = binding.imageViewUpload.getDrawable();

        // Check if any field is empty or if the image is not uploaded
        if (username.isEmpty() || password.isEmpty() || passwordVerification.isEmpty() || displayName.isEmpty() || imageDrawable == null) {
            Toast.makeText(RegisterActivity.this, "Please fill in all fields and upload an image.", Toast.LENGTH_LONG).show();
            return;
        }

        // Check if the password is at least 8 characters long and contains numbers and letters
        if (!password.matches("(?=.*[0-9])(?=.*[a-zA-Z]).{8,}")) {
            Toast.makeText(RegisterActivity.this, "Password must be at least 8 characters long and contain both letters and numbers.", Toast.LENGTH_LONG).show();
            return;
        }

        // Check if password and password verification match
        if (!password.equals(passwordVerification)) {
            Toast.makeText(RegisterActivity.this, "Password verification does not match.", Toast.LENGTH_LONG).show();
            return;
        }

        User user = new User(username, password, displayName);
        String imagePath = saveImageToInternalStorage(uri, this, username);
        user.setPic(imagePath);
        usersViewModel.createUser(user);
    }


    public static String saveImageToInternalStorage(Uri uri, Context context, String userName) {
        try {
            // Create a bitmap from the URI
            InputStream inputStream = context.getContentResolver().openInputStream(uri);
            Bitmap bitmap = BitmapFactory.decodeStream(inputStream);
            inputStream.close();

            // Create a file in the internal storage
            String fileName = userName + "_profile_picture.png";
            File outputFile = new File(context.getFilesDir(), fileName);

            // Save the bitmap to the file
            OutputStream os = new FileOutputStream(outputFile);
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, os);
            os.flush();
            os.close();

            // Return the file path
            return outputFile.getAbsolutePath();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}