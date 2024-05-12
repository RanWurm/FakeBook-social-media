package com.example.projectpart2.viewmodels;

import android.content.Context;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.ViewModel;
import androidx.lifecycle.ViewModelProvider;

import com.example.projectpart2.dao.PostDao;
import com.example.projectpart2.entities.Post;
import com.example.projectpart2.entities.User;
import com.example.projectpart2.repositories.PostsRepository;

import java.util.List;

public class PostsViewModel extends ViewModel {
    private PostsRepository postsRepository;
    private LiveData<List<Post>> feedPosts;
    private LiveData<List<Post>> profilePosts;

    public PostsViewModel(Context context) {
        postsRepository = new PostsRepository(context);
        this.feedPosts = postsRepository.getFeedPosts();
        this.profilePosts = postsRepository.getProfilePosts();
    }
    public static class PostsViewModelFactory implements ViewModelProvider.Factory {
        private final Context context;

        public PostsViewModelFactory(Context context) {
            this.context = context.getApplicationContext(); // Use application context to avoid leaks
        }

        @Override
        public <T extends ViewModel> T create(Class<T> modelClass) {
            if (modelClass.isAssignableFrom(PostsViewModel.class)) {
                return (T) new PostsViewModel(context);
            }
            throw new IllegalArgumentException("Unknown ViewModel class");
        }
    }

    public LiveData<List<Post>> getFeedPosts() {
        return this.feedPosts;
    }
    public LiveData<List<Post>> getProfilePosts() {
        return this.profilePosts;
    }

    public void getPosts(String token) {
        postsRepository.getPosts(token);
    }
    public void getUserPosts(int id, String token) {
        postsRepository.getUserPosts(id, token);
    }
    public void createPost(int id, String token, Post post) {
        postsRepository.createPost(id, token, post);
    }

    public void editPost(int id, int pid, String token, Post post) {
        postsRepository.editPost(id, pid, token, post);
    }

    public void deletePost(int id, int pid, String token) {
        postsRepository.deletePost(id, pid, token);
    }
}
