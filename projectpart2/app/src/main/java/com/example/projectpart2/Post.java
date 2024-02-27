package com.example.projectpart2;

import androidx.room.Entity;
import androidx.room.PrimaryKey;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
@Entity
public class Post implements Serializable {
    public void setContent(String content) {
        this.content = content;
    }

    private static int count = 0;
    @PrimaryKey(autoGenerate = true)
    private int id;
    private User author;
    private String content;
    private String pic;

    public List<String> getComments() {
        return comments;
    }

    public void setComments(List<String> comments) {
        this.comments = comments;
    }

    private String publishTime;

    public int getId() {
        return id;
    }

    private int likes = 0;
    private List<String> comments = new ArrayList<>();
    public String getPic() {
        return pic;
    }

    public String getPublishTime() {
        return publishTime;
    }

    public String getContent() {
        return content;
    }

    public void setPic(String pic) {
        this.pic = pic;
    }

    public User getAuthor() {
        return author;
    }

    public Post(User author, String content, String pic) {
        this.author = author;
        this.content = content;
        this.pic = pic;
        SimpleDateFormat formatter = new SimpleDateFormat("HH:mm:ss");
        Date date = new Date();
        publishTime = formatter.format(date);
        this.id = count;
        count++;
    }
    public Post(User author, String content) {
        this.author = author;
        this.content = content;
        this.pic = "";
        SimpleDateFormat formatter = new SimpleDateFormat("HH:mm:ss");
        Date date = new Date();
        publishTime = formatter.format(date);
        this.id = count;
        count++;

    }

    public void addLike() {
        likes++;
    }

    public void addComment(String comment) {
        this.comments.add(comment);
    }

    public int getNumComments() {
        return this.comments.size();
    }


}
