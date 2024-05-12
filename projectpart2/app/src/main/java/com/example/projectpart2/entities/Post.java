package com.example.projectpart2.entities;

import androidx.room.Entity;
import androidx.room.PrimaryKey;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
public class Post {
    public void setContent(String content) {
        this.content = content;
    }

    @PrimaryKey(autoGenerate = true)
    private int postID;

    private int authorID;

    public int getAuthorID() {
        return authorID;
    }

    public void setAuthorID(int authorID) {
        this.authorID = authorID;
    }

    public int getPostID() {
        return postID;
    }

    public void setPostID(int postID) {
        this.postID = postID;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void addComment(Comment comment) {
        this.comments.add(comment);
    }

    public void editComment(int position, Comment comment) {
        this.comments.set(position, comment);
    }

    public void deleteComment(int position) {
        this.comments.remove(position);
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    private List<Comment> comments = new ArrayList<>();

    public Post() {
        this.content = "";
        this.picture = "";
        this.dateCreated = new Date();
        this.likeCount = 0;
    }


    public Date getDateCreated() {
        return dateCreated;
    }

    public int getLikeCount() {
        return likeCount;
    }

    private String content;
    private String picture;

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public void setPublishTime(Date publishTime) {
        this.dateCreated = publishTime;
    }

    private Date dateCreated;

    public void setDateCreated(Date dateCreated) {
        this.dateCreated = dateCreated;
    }

    public int getId() {
        return postID;
    }


    public void setLikeCount(int likeCount) {
        this.likeCount = likeCount;
    }

    private int likeCount;

    public String getPic() {
        return picture;
    }

    public String getPublishTime() {
        SimpleDateFormat formatter = new SimpleDateFormat("HH:mm:ss");
        String publishTime = formatter.format(this.dateCreated);
        return publishTime;
    }

    public String getContent() {
        return content;
    }




    public Post(int authorId, String pic, String content) {
        this.authorID = authorId;
        this.content = content;
        this.picture = pic;
        this.dateCreated = new Date();
        this.likeCount = 0;
    }
    public Post(int authorId, String content) {
        this.authorID = authorId;
        this.content = content;
        this.picture = "";
        this.dateCreated = new Date();
        this.likeCount = 0;
    }

    public void addLike() {
        this.likeCount++;
    }
    public void subtractLike() { this.likeCount--; }

    public int getLikes() {
        return this.likeCount;
    }

}
