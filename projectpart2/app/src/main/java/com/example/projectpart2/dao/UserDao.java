package com.example.projectpart2.dao;

import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Delete;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;
import androidx.room.Update;

import com.example.projectpart2.entities.Post;
import com.example.projectpart2.entities.User;

import java.util.List;

@Dao
public interface UserDao {

    @Query("SELECT * FROM user")
    List<User> index();

    @Query("SELECT * FROM user WHERE id = :id")
    User get(int id);

    @Query("SELECT * FROM user WHERE token = :token")
    User getByToken(String token);
    @Query("SELECT * FROM user WHERE username = :username")
    User getByUsername(String username);

    @Query("SELECT * FROM user WHERE username = :username AND password = :password")
    User getByCredentials(String username, String password);

    @Insert
    void insert(User... users);

    @Update
    void update(User... users);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void upsert(User... users);
    @Delete
    void delete(User... users);

    @Query("DELETE FROM user")
    void deleteAllUsers();
}
