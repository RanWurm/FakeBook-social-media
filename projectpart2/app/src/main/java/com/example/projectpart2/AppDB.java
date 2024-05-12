package com.example.projectpart2;

import androidx.room.Database;
import androidx.room.RoomDatabase;
import androidx.room.TypeConverters;

import com.example.projectpart2.dao.PostDao;
import com.example.projectpart2.dao.UserDao;
import com.example.projectpart2.entities.Post;
import com.example.projectpart2.entities.User;

@Database(entities = {Post.class, User.class}, version = 16)
@TypeConverters({Converters.class})
public abstract class AppDB extends RoomDatabase {
    public abstract PostDao postDao();
    public abstract UserDao userDao();
}
