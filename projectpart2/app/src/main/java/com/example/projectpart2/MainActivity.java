package com.example.projectpart2;
import android.util.Log;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.myapplication.databinding.ActivityMainBinding;

import java.util.ArrayList;
import java.util.List;

public class MainActivity extends AppCompatActivity {

    private ActivityMainBinding binding;

    private static List<User> users = new ArrayList<>();
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        User yuli = new User("yulibar", "t123123123", "Yuli Bar", "yuli");
        users.add(yuli);
        User ran = new User("ranworm", "t123123123", "Ran Wurmbrand", "ran");
        users.add(ran);
        User hillel = new User("hillelro", "t123123123", "Hillel Rosenthal", "hillel");
        users.add(hillel);
        binding.newAccount.setOnClickListener(v -> {
            Intent i = new Intent(this, RegisterActivity.class);
            startActivity(i);
        });

        binding.btnLogin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                checkLogin();
            }
        });


    }

    private void checkLogin() {

        User currentUser = new User();
        String username = binding.editTextText.getText().toString();
        String password = binding.editTextTextPassword.getText().toString();
        boolean found = false;
        for (int i = 0; i < users.size(); i++) {
            if (users.get(i).getUsername().equals(username)) {
                if (users.get(i).getPassword().equals(password)) {
                    found = true;
                    currentUser = users.get(i);
                    break;
                }
                else {
                    Toast.makeText(MainActivity.this, "Password incorrect.", Toast.LENGTH_LONG).show();
                    return;
                }
            }
        }
        if (found) {
            Intent intent = new Intent(this, FeedActivity.class);
            intent.putExtra("currentUser", currentUser);
            Log.i("MainActivity", "under putExtra");
            startActivity(intent);
        }
        else {
            Toast.makeText(MainActivity.this, "User doesn't exist.", Toast.LENGTH_LONG).show();
        }
    }

    public static void addUser(User user) {
        users.add(user);
    }

    public static List<User> getUsers() {
        return users;
    }

}
