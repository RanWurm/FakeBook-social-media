package com.example.projectpart2.api;

import com.example.projectpart2.UserCredentials;
import com.example.projectpart2.entities.Post;
import com.example.projectpart2.entities.User;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.PATCH;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface WebServiceAPI {

    @POST("users")
    Call<User> createUser(@Body User user);
    @POST("tokens")
    Call<User> createToken(@Body UserCredentials credentials);

    @GET("posts")
    Call<List<Post>> getPosts(@Header("authorization") String authToken);

    @GET("users/{id}")
    Call<User> getUser(@Path("id") int id, @Header("authorization") String authToken);

    @PATCH("users/{id}")
    Call<User> editUser(@Path("id") int id, @Header("authorization") String authToken, @Body User user);

    @DELETE("users/{id}")
    Call<User> deleteUser(@Path("id") int id, @Header("authorization") String authToken);

    @GET("users/{id}/posts")
    Call<List<Post>> getUserPosts(@Path("id") int id, @Header("authorization") String authToken);

    @POST("users/{id}/posts")
    Call<Post> createPost(@Path("id") int id, @Header("authorization") String authToken, @Body Post post);

    @PATCH("users/{id}/posts/{pid}")
    Call<Post> editPost(@Path("id") int id, @Path("pid") int pid, @Header("authorization") String authToken, @Body Post post);

    @DELETE("users/{id}/posts/{pid}")
    Call<Void> deletePost(@Path("id") int id, @Path("pid") int pid, @Header("authorization") String authToken);

    @GET("users/{id}/friends") //returns the list of friends of the user
    Call<List<Integer>> getUserFriends(@Path("id") int id, @Header("authorization") String authToken);

    @POST("users/{id}/friends") //sending a friend request
    Call<Void> sendFriendRequest(@Path("id") int id, @Header("authorization") String authToken);

    @PATCH("users/{id}/friends/{fid}")
    Call<Void> approveRequest(@Path("id") int id, @Path("fid") int fid,  @Header("authorization") String authToken);

    @DELETE("users/{id}/friends/{fid}")
    Call<Void> deleteFriend(@Path("id") int id, @Path("fid") int fid,  @Header("authorization") String authToken);

}
