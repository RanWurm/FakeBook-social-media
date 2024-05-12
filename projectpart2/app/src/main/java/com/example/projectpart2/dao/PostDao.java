package com.example.projectpart2.dao;

import androidx.room.Dao;
import androidx.room.Delete;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;
import androidx.room.Update;

import com.example.projectpart2.entities.Post;

import java.util.List;

@Dao
public interface PostDao {

    @Query("SELECT * FROM post")
    List<Post> index();

    @Query("SELECT * FROM (" +
            "  SELECT P.* FROM Post P " +
            "  INNER JOIN User U ON P.authorID = U.id " +
            "  WHERE U.id IN (SELECT friends FROM User WHERE token = :token) " +
            "  ORDER BY P.dateCreated DESC LIMIT 20" +
            ") UNION ALL " +
            "SELECT * FROM (" +
            "  SELECT P.* FROM Post P " +
            "  INNER JOIN User U ON P.authorID = U.id " +
            "  WHERE U.id NOT IN (SELECT friends FROM User WHERE token = :token) " +
            "  ORDER BY P.dateCreated DESC LIMIT 5" +
            ")")
    List<Post> getLatestPostsFromFriendsAndNonFriends(String token);

    @Query("SELECT P.* FROM Post P " +
            "  INNER JOIN User U ON P.authorID = U.id " +
            "  WHERE U.id IN (SELECT friends FROM User WHERE token = :token) " +
            "  AND U.id = :id")
    List<Post> getUserPosts(int id, String token);


    @Query("SELECT * FROM post WHERE postID = :id")
    Post get(int id);

    @Insert
    void insert(Post... posts);

    @Update
    void update(Post... posts);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void upsert(Post... posts);


    @Delete
    void delete(Post... posts);

    @Query("DELETE FROM post")
    void deleteAllPosts();

}
