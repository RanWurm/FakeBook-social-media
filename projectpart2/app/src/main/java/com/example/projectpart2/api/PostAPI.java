package com.example.projectpart2.api;

import android.util.Log;

import androidx.lifecycle.MutableLiveData;

import com.example.projectpart2.UserCredentials;
import com.example.projectpart2.dao.PostDao;
import com.example.projectpart2.dao.UserDao;
import com.example.projectpart2.entities.Post;
import com.example.projectpart2.entities.User;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Executors;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class PostAPI {
    private MutableLiveData<List<Post>> feedPosts;
    private MutableLiveData<List<Post>> profilePosts;
    private PostDao dao;
    private Retrofit retrofit;
    private WebServiceAPI webServiceAPI;

    public PostAPI(MutableLiveData<List<Post>> feedPosts, MutableLiveData<List<Post>> profilePosts, PostDao dao) {
        this.feedPosts = feedPosts;
        this.profilePosts = profilePosts;
        this.dao = dao;
        String BASE_URL = "http://10.0.2.2:5000/api/";
        retrofit = new Retrofit.Builder().baseUrl(BASE_URL)
                .callbackExecutor(Executors.newSingleThreadExecutor())
                .addConverterFactory(GsonConverterFactory.create()).build();
        webServiceAPI = retrofit.create(WebServiceAPI.class);
    }
    public void getPosts(String token) {
        Call<List<Post>> call = webServiceAPI.getPosts(token);
        call.enqueue(new Callback<List<Post>>() {
            @Override
            public void onResponse(Call<List<Post>> call, Response<List<Post>> response) {
                if (response.isSuccessful()) {
                    feedPosts.postValue(response.body()); // Posting the updated list back to LiveData
                    Post[] postsArr = response.body().toArray(new Post[0]);
                    Thread dbThread = new Thread(() -> dao.upsert(postsArr)); // Ensure this runs on a background thread
                    dbThread.start();
                    Log.d("PostAPI", "got posts successfully");
                } else {
                    Log.d("PostAPI", "Failed to get posts: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<List<Post>> call, Throwable t) {
                Log.e("PostAPI", "Error occurred while get posts", t);
            }
        });
    }

    public void getUserPosts(int id, String token) {
        Call<List<Post>> call = webServiceAPI.getUserPosts(id, token);
        call.enqueue(new Callback<List<Post>>() {
            @Override
            public void onResponse(Call<List<Post>> call, Response<List<Post>> response) {
                if (response.isSuccessful()) {
                    profilePosts.postValue(response.body()); // Posting the updated list back to LiveData
                    Post[] postsArr = response.body().toArray(new Post[0]);
                    Thread dbThread = new Thread(() -> dao.upsert(postsArr)); // Ensure this runs on a background thread
                    dbThread.start();
                    Log.d("PostAPI", "got user's posts successfully");
                } else {
                    Log.d("PostAPI", "Failed to get user's posts: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<List<Post>> call, Throwable t) {
                Log.e("PostAPI", "Error occurred while get user's posts", t);
            }
        });
    }

    public void createPost(int id, String token, Post post) {
        Call<Post> call = webServiceAPI.createPost(id, token, post);
        call.enqueue(new Callback<Post>() {
            @Override
            public void onResponse(Call<Post> call, Response<Post> response) {
                if (response.isSuccessful()) {
                    List<Post> currentPosts = feedPosts.getValue();
                    if (currentPosts == null) {
                        currentPosts = new ArrayList<>(); // Initialize if null
                    }
                    List<Post> updatedPosts = new ArrayList<>(currentPosts); // Create a new list based on the current one
                    updatedPosts.add(response.body()); // Add the new post to the updated list
                    feedPosts.postValue(updatedPosts); // Post the updated list
                    Thread dbThread = new Thread(() -> dao.insert(response.body())); // Ensure this runs on a background thread
                    dbThread.start();
                    Log.d("PostAPI", "post created successfully");
                } else {
                    Log.d("PostAPI", "Failed to create post: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<Post> call, Throwable t) {
                Log.e("PostAPI", "Error occurred while create post", t);
            }
        });
    }

    public void editPost(int id, int pid, String token, Post post) {
        Call<Post> call = webServiceAPI.editPost(id, pid, token, post);
        call.enqueue(new Callback<Post>() {
            @Override
            public void onResponse(Call<Post> call, Response<Post> response) {
                if (response.isSuccessful()) {
                    List<Post> currentPosts = feedPosts.getValue();
                    if (currentPosts != null) {
                        List<Post> updatedPosts = new ArrayList<>(currentPosts);
                        int ind = findIndex(post.getId());
                        updatedPosts.set(ind, response.body());
                        feedPosts.postValue(updatedPosts);
                    }
                    Thread dbThread = new Thread(() -> dao.update(response.body())); // Ensure this runs on a background thread
                    dbThread.start();
                    Log.d("PostAPI", "post edited successfully");
                } else {
                    Log.d("PostAPI", "Failed to edit post: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<Post> call, Throwable t) {
                Log.e("PostAPI", "Error occurred while edit post", t);
            }
        });
    }

    public void deletePost(int id, int pid, String token) {
        Call<Void> call = webServiceAPI.deletePost(id, pid, token);
        call.enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    List<Post> currentPosts = feedPosts.getValue();
                    if (currentPosts != null) {
                        List<Post> updatedPosts = new ArrayList<>(currentPosts);
                        Post toRemove = findPostById(pid);
                        updatedPosts.remove(toRemove);
                        feedPosts.postValue(updatedPosts);
                    }
                    Thread dbThread = new Thread(() -> {
                        Post del = dao.get(pid);
                        dao.delete(del);
                    }); // Ensure this runs on a background thread
                    dbThread.start();
                    Log.d("PostAPI", "post edited successfully");
                } else {
                    Log.d("PostAPI", "Failed to edit post: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Log.e("PostAPI", "Error occurred while edit post", t);
            }
        });
    }

    private int findIndex(int postId) {
        List<Post> currentPosts = feedPosts.getValue();
        int size = currentPosts.size();
        for (int i = 0; i < size; i++) {
            if (postId == currentPosts.get(i).getId())
                return i;
        }
        return -1;
    }
    private Post findPostById(int id) {
        for (int i = 0; i < feedPosts.getValue().size(); i++) {
            if (id == feedPosts.getValue().get(i).getId())
                return feedPosts.getValue().get(i);
        }
        return null;
    }
}
