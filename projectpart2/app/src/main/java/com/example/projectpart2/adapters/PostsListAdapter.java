package com.example.projectpart2.adapters;

import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.EditorInfo;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.widget.AppCompatButton;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.core.content.ContextCompat;
import androidx.lifecycle.LifecycleOwner;
import androidx.lifecycle.ViewModelProvider;
import androidx.lifecycle.ViewModelStoreOwner;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.room.Room;

import com.example.myapplication.R;
import com.example.projectpart2.AppDB;
import com.example.projectpart2.activities.EditPostActivity;
import com.example.projectpart2.activities.ProfileActivity;
import com.example.projectpart2.dao.PostDao;
import com.example.projectpart2.dao.UserDao;
import com.example.projectpart2.entities.Comment;
import com.example.projectpart2.entities.Post;
import com.example.projectpart2.entities.User;
import com.example.projectpart2.viewmodels.PostsViewModel;
import com.google.android.material.bottomsheet.BottomSheetDialog;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

public class PostsListAdapter extends RecyclerView.Adapter<PostsListAdapter.PostViewHolder>{

    Context context;
    private final LayoutInflater mInflater;
    private List<Post> posts = new ArrayList<>();
    private boolean isDarkMode = false;
    private AppDB db;
    private PostDao postDao;
    private UserDao userDao;
    private PostsViewModel postsViewModel;
    private String currentToken;

    private String infoType;
    private int wantedUserId;


    public void onCommentUpdated(int postPosition, List<Comment> updatedComments) {
        notifyItemChanged(postPosition);
    }
    class PostViewHolder extends RecyclerView.ViewHolder {
        private final TextView tvAuthor;
        private final TextView tvContent;
        private final ImageView ivPic;
        private final ImageView authorImage;
        private final TextView tvTime;
        private final ImageButton editPost;
        private final ImageButton deletePost;
        private final ImageButton btnLike;
        private final ImageButton btnShare;
        private final ImageButton btnAddComment;
        private final AppCompatButton btnComments;
        private final RecyclerView rvComments;
        private final EditText etAddComment;
        private final ConstraintLayout mainLayout;




        private PostViewHolder(View itemView) {
            super(itemView);
            tvAuthor = itemView.findViewById(R.id.tvAuthor);
            authorImage = itemView.findViewById(R.id.authorImage);
            tvContent = itemView.findViewById(R.id.tvContent);
            ivPic = itemView.findViewById(R.id.ivPic);
            tvTime = itemView.findViewById(R.id.tvTime);
            editPost = itemView.findViewById(R.id.editPost);
            deletePost = itemView.findViewById(R.id.deletePost);
            btnLike = itemView.findViewById(R.id.btnLike);
            btnShare = itemView.findViewById(R.id.btnShare);
            btnAddComment = itemView.findViewById(R.id.btnAddComment);
            btnComments = itemView.findViewById(R.id.btnComments);
            rvComments = itemView.findViewById(R.id.rvComments);
            etAddComment = itemView.findViewById(R.id.etAddComment);
            mainLayout = itemView.findViewById(R.id.mainLayout);
        }
    }


    public PostsListAdapter(Context context, String token, String infoType, int wantedUserId) {
        this.context = context;
        this.currentToken = token;
        Log.i("current Token in adapter:", currentToken);
        this.infoType = infoType;
        this.wantedUserId = wantedUserId;
        mInflater = LayoutInflater.from(context);
        db = Room.databaseBuilder(context, AppDB.class, "SocialNetworkDB").allowMainThreadQueries().fallbackToDestructiveMigration().build();
        postDao = db.postDao();
        userDao = db.userDao();
        PostsViewModel.PostsViewModelFactory postsFactory = new PostsViewModel.PostsViewModelFactory(context);
        this.postsViewModel = new ViewModelProvider((ViewModelStoreOwner) context, postsFactory).get(PostsViewModel.class);
//        this.postsViewModel = new ViewModelProvider((ViewModelStoreOwner) context).get(PostsViewModel.class);

        if (infoType.equals("feed")) {
            postsViewModel.getFeedPosts().observe((LifecycleOwner) context, posts -> {
                this.posts = posts;
                notifyDataSetChanged();
            });
        } else {
            postsViewModel.getProfilePosts().observe((LifecycleOwner) context, posts -> {
                this.posts = posts;
                notifyDataSetChanged();
            });

        }
    }


    public void onThemeChanged(boolean isDarkMode) {
        this.isDarkMode = isDarkMode;
        notifyDataSetChanged(); // Trigger re-binding of data to reflect theme change
    }

    @Override
    public PostViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View itemView = mInflater.inflate(R.layout.post_layout, parent, false);
        return new PostViewHolder(itemView);
    }

    @Override
    public void onBindViewHolder(PostViewHolder holder, int position) {
        if (posts != null) {
            Post currentPost = posts.get(position);
            User currentUser = userDao.get(currentPost.getAuthorID());
            holder.rvComments.setLayoutManager(new LinearLayoutManager(context));
            CommentsAdapter commentsAdapter = new CommentsAdapter(context, currentPost.getId(), position, this, currentToken);
            holder.rvComments.setAdapter(commentsAdapter);
            String authorImageString = currentUser.getPic();
            String postImageString = currentPost.getPic();
            Drawable imageAuthor;
            Drawable imagePost;
            if (isDrawableResource(context, authorImageString)) {
                imageAuthor = getDrawableFromStringName(context, authorImageString);
            }
            else {
                Bitmap bitmap1 = getBitmapFromFilePath(authorImageString);
                imageAuthor = getDrawableFromBitmap(context, bitmap1);
            }
            if (isDrawableResource(context, postImageString)) {
                imagePost = getDrawableFromStringName(context, postImageString);
            }
            else {
                Bitmap bitmap2 = getBitmapFromFilePath(postImageString);
                imagePost = getDrawableFromBitmap(context, bitmap2);
            }

            holder.tvAuthor.setText(currentUser.getDisplayName());
            holder.authorImage.setImageDrawable(imageAuthor);
            holder.tvContent.setText(currentPost.getContent());
            holder.ivPic.setImageDrawable(imagePost);
            holder.tvTime.setText(currentPost.getPublishTime());

            holder.authorImage.setOnClickListener(v -> {
                Intent intent = new Intent(context, ProfileActivity.class);
                intent.putExtra("currentUserToken", currentToken);
                intent.putExtra("wantedUserId", currentUser.getId());
                context.startActivity(intent);
            });
            holder.tvAuthor.setOnClickListener(v -> {
                Intent intent = new Intent(context, ProfileActivity.class);
                intent.putExtra("currentUserToken", currentToken);
                intent.putExtra("wantedUserId", currentUser.getId());
                context.startActivity(intent);
            });
            holder.editPost.setOnClickListener(v -> {
                if(currentUser.getToken().equals(currentToken))
                    onEditClicked(currentPost.getId());
                else
                    Toast.makeText(context, "can't edit post", Toast.LENGTH_LONG).show();
            });

            holder.deletePost.setOnClickListener(v -> {
                if(currentUser.getToken().equals(currentToken))
                    postsViewModel.deletePost(currentUser.getId(), currentPost.getId(), currentToken);
                else
                    Toast.makeText(context, "can't delete post", Toast.LENGTH_LONG).show();
            });

            holder.btnLike.setOnClickListener(new View.OnClickListener() {
                private boolean isLiked = false;
                @Override
                public void onClick(View v) {
                    isLiked = !isLiked; // Toggle the state
                    holder.btnLike.setColorFilter(isLiked ? Color.BLUE : Color.DKGRAY);
                    if (isLiked) {
                        currentPost.addLike();
                    }
                    else {
                        currentPost.subtractLike();
                    }

                }
            });

            holder.btnShare.setOnClickListener(view -> showShareOptions());

            holder.btnComments.setOnClickListener(view -> {
                if (holder.rvComments.getVisibility() == View.GONE) {
                    holder.btnComments.setText("Hide comments");
                    holder.rvComments.setVisibility(View.VISIBLE);
                    notifyDataSetChanged();
                } else {
                    holder.rvComments.setVisibility(View.GONE);
                    holder.btnComments.setText("Show comments");
                    notifyDataSetChanged();
                }
            });

            holder.btnAddComment.setOnClickListener(view -> {
                holder.etAddComment.setVisibility(View.VISIBLE);
                holder.etAddComment.requestFocus();

            });
            holder.etAddComment.setOnEditorActionListener((v, actionId, event) -> {
                if (actionId == EditorInfo.IME_ACTION_DONE || (event != null && event.getKeyCode() == KeyEvent.KEYCODE_ENTER)) {
                    // Retrieve the comment text
                    String commentText = holder.etAddComment.getText().toString();
                    if (!commentText.isEmpty()) {
                        // Add the comment to the comments list of the post
                        currentPost.addComment(new Comment(commentText));
                        postsViewModel.editPost(currentUser.getId(), currentPost.getId(), currentToken, currentPost);
                        // Notify the adapter
                        setPosts();
                        holder.etAddComment.setText(""); // Clear the EditText
                        holder.etAddComment.setVisibility(View.GONE); // Optionally hide the EditText again
                    }
                    return true;
                }
                return false;
            });
            if (isDarkMode) {
                // Apply dark mode styles
                inDarkMode(holder, commentsAdapter);
                // Example styling
            } else {
                // Apply light mode styles
                inLightMode(holder, commentsAdapter);
            }

        }
        }


    public void setPosts() {
        if (this.infoType.equals("feed")) {
            postsViewModel.getPosts(this.currentToken);
        }
        else {
            postsViewModel.getUserPosts(wantedUserId, currentToken);
        }
    }

    @Override
    public int getItemCount() {
        if (posts != null) {
            return posts.size();
        }
        else return 0;
        }
    public static Bitmap getBitmapFromFilePath(String filePath) {
        File imgFile = new File(filePath);
        if (imgFile.exists()) {
            Bitmap bitmap = BitmapFactory.decodeFile(imgFile.getAbsolutePath());
            return bitmap;
        }
        return null;
    }

    public static Drawable getDrawableFromBitmap(Context context, Bitmap bitmap) {
        if (bitmap != null) {
            return new BitmapDrawable(context.getResources(), bitmap);
        }
        return null;
    }

    public static boolean isDrawableResource(Context context, String imageName) {
        int resourceId = context.getResources().getIdentifier(imageName, "drawable", context.getPackageName());
        return resourceId != 0;
    }

    public static Drawable getDrawableFromStringName(Context context, String drawableName) {
        int resourceId = context.getResources().getIdentifier(drawableName, "drawable", context.getPackageName());
        if (resourceId != 0) { // Resource found
            return ContextCompat.getDrawable(context, resourceId);
        } else {
            // Handle the case where the drawable was not found
            return null;
        }
    }

    public void onEditClicked(int id) {
        // Handle edit action, e.g., open an EditPostActivity
        Intent intent = new Intent(context, EditPostActivity.class);
        intent.putExtra("postId", id);
        intent.putExtra("currentToken", currentToken);
        context.startActivity(intent);
    }

    private void showShareOptions() {
        final BottomSheetDialog bottomSheetDialog = new BottomSheetDialog(context);
        bottomSheetDialog.setContentView(R.layout.bottom_sheet_share);

        ImageButton btnShareSmartphone = bottomSheetDialog.findViewById(R.id.btnShareSmartphone);
        ImageButton btnShareMessenger = bottomSheetDialog.findViewById(R.id.btnShareChat);
        ImageButton btnShareFeed = bottomSheetDialog.findViewById(R.id.btnShareFeed);

        bottomSheetDialog.show();
    }
    private void inDarkMode(PostViewHolder holder, CommentsAdapter commentsAdapter) {
        // Apply dark mode styles
        holder.mainLayout.setBackgroundResource(R.drawable.post_rounded_corners_night);
        holder.tvAuthor.setTextColor(Color.WHITE);
        holder.tvTime.setTextColor(Color.WHITE);
        holder.editPost.setBackgroundResource(R.drawable.bottom_layout_buttons_night);
        holder.deletePost.setBackgroundResource(R.drawable.bottom_layout_buttons_night);
        holder.tvContent.setTextColor(Color.WHITE);
        holder.btnComments.setBackgroundColor(Color.BLACK);
        holder.btnComments.setTextColor(Color.WHITE);
        holder.btnLike.setBackgroundResource(R.drawable.bottom_layout_buttons_night);
        holder.btnAddComment.setBackgroundResource(R.drawable.bottom_layout_buttons_night);
        holder.btnShare.setBackgroundResource(R.drawable.bottom_layout_buttons_night);
        holder.etAddComment.setTextColor(Color.WHITE);
        holder.etAddComment.setHintTextColor(Color.WHITE);
        commentsAdapter.onThemeChanged(true);
    }

    private void inLightMode(PostViewHolder holder, CommentsAdapter commentsAdapter) {
        holder.mainLayout.setBackgroundResource(R.drawable.post_rounded_corners);
        holder.tvAuthor.setTextColor(Color.BLACK);
        holder.tvTime.setTextColor(Color.BLACK);
        holder.editPost.setBackgroundResource(R.drawable.bottom_layout_buttons);
        holder.deletePost.setBackgroundResource(R.drawable.bottom_layout_buttons);
        holder.tvContent.setTextColor(Color.BLACK);
        holder.btnComments.setBackgroundColor(Color.WHITE);
        holder.btnComments.setTextColor(Color.BLACK);
        holder.btnLike.setBackgroundResource(R.drawable.bottom_layout_buttons);
        holder.btnAddComment.setBackgroundResource(R.drawable.bottom_layout_buttons);
        holder.btnShare.setBackgroundResource(R.drawable.bottom_layout_buttons);
        holder.etAddComment.setTextColor(Color.BLACK);
        holder.etAddComment.setHintTextColor(Color.BLACK);
        commentsAdapter.onThemeChanged(false);
    }
    public User findUserByPostAuthor(String author) {
        List<User> filtered = (List<User>) userDao.index().stream().filter(a -> a.getDisplayName().equals(author));
        return filtered.get(0);
    }

}
