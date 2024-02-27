package com.example.projectpart2;

import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.util.DisplayMetrics;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.EditorInfo;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.appcompat.widget.AppCompatButton;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.myapplication.R;
import com.google.android.material.bottomsheet.BottomSheetDialog;

import java.io.File;
import java.util.List;

public class PostsListAdapter extends RecyclerView.Adapter<PostsListAdapter.PostViewHolder> implements CommentUpdateListener {

    Context context;

    public void onCommentUpdated(int postPosition, List<String> updatedComments) {
        Post post = posts.get(postPosition);
        post.setComments(updatedComments);
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

    private final LayoutInflater mInflater;
    private List<Post> posts;
    private boolean isDarkMode = false;


    public PostsListAdapter(Context context) {
        this.context = context;
        mInflater = LayoutInflater.from(context);
    }

    public void onThemeChanged(boolean isDarkMode) {
        // Implement theme change handling here
        // This could involve setting a member variable and using it in onBindViewHolder
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
            Post current = posts.get(position);
            holder.rvComments.setLayoutManager(new LinearLayoutManager(context));
            CommentsAdapter commentsAdapter = new CommentsAdapter(current.getComments(), position, this);
            holder.rvComments.setAdapter(commentsAdapter);
            String authorImageString = current.getAuthor().getPic();
            String postImageString = current.getPic();
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
            DisplayMetrics displayMetrics = context.getResources().getDisplayMetrics();
            int screenHeight = displayMetrics.heightPixels;
            int screenWidth = displayMetrics.widthPixels;

            // Calculate desired height and width
            int desiredHeight = (int) (screenHeight * 0.6); // 20% of screen height
            //int desiredWidth = (int) (screenWidth * 0.6); // 50% of screen width

            // Set the size of the ViewHolder's itemView
            ViewGroup.LayoutParams layoutParams = holder.itemView.getLayoutParams();
            //layoutParams.height = desiredHeight;
            //layoutParams.width = desiredWidth;
            holder.tvAuthor.setText(current.getAuthor().getDisplayName());
            holder.authorImage.setImageDrawable(imageAuthor);
            holder.tvContent.setText(current.getContent());
            holder.ivPic.setImageDrawable(imagePost);
            holder.tvTime.setText(current.getPublishTime());
            //holder.itemView.setLayoutParams(layoutParams);

            holder.editPost.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    onEditClicked(current);
                }
            });

            holder.deletePost.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    onDeleteClicked(current);
                }
            });

            holder.btnLike.setOnClickListener(new View.OnClickListener() {
                private boolean isLiked = false;
                @Override
                public void onClick(View v) {
                    isLiked = !isLiked; // Toggle the state
                    holder.btnLike.setColorFilter(isLiked ? Color.BLUE : Color.DKGRAY);
                }
            });

            holder.btnShare.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    showShareOptions();
                }
            });

            holder.btnComments.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    if (holder.rvComments.getVisibility() == View.GONE) {
                        holder.btnComments.setText("Hide comments");
                        holder.rvComments.setVisibility(View.VISIBLE);
                        notifyDataSetChanged();
                        // Optionally, load comments here if they haven't been loaded
                    } else {
                        holder.rvComments.setVisibility(View.GONE);
                        holder.btnComments.setText("Show comments");
                        notifyDataSetChanged();
                    }
                }
            });

            holder.btnAddComment.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    holder.etAddComment.setVisibility(View.VISIBLE);
                    holder.etAddComment.requestFocus();

                }
            });
            holder.etAddComment.setOnEditorActionListener(new TextView.OnEditorActionListener() {
                @Override
                public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
                    if (actionId == EditorInfo.IME_ACTION_DONE || (event != null && event.getKeyCode() == KeyEvent.KEYCODE_ENTER)) {
                        // Retrieve the comment text
                        String commentText = holder.etAddComment.getText().toString();
                        if (!commentText.isEmpty()) {
                            // Add the comment to the comments list of the post
                            current.addComment(commentText);
                            // Notify the adapter (assuming you have a reference to your CommentsAdapter)
                            commentsAdapter.notifyDataSetChanged();
                            holder.etAddComment.setText(""); // Clear the EditText
                            holder.etAddComment.setVisibility(View.GONE); // Optionally hide the EditText again
                        }
                        return true;
                    }
                    return false;
                }
            });
            if (isDarkMode) {
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

                // Example styling
            } else {
                // Apply light mode styles
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

        }
        }


    public void setPosts(List<Post> s) {
        posts = s;
        notifyDataSetChanged();
    }

    @Override
    public int getItemCount() {
        if (posts != null) {
            return posts.size();
        }
        else return 0;
        }
        public List<Post> getPosts() {
            return posts;
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

    public void onEditClicked(Post post) {
        // Handle edit action, e.g., open an EditPostActivity
        Intent intent = new Intent(context, EditPostActivity.class);
        intent.putExtra("post", post); // Assuming your Post model has an ID
        ((FeedActivity)context).startEditPostActivity(intent);
    }
    public void onDeleteClicked(Post post) {
        // Handle delete action, e.g., show a confirmation dialog
        this.posts.remove(post);
        notifyDataSetChanged();
    }

    public void updatePost(Post updatedPost) {
        // Find the post by ID or another unique identifier and update it
        int index = updatedPost.getId();
        for (Post post : posts) {
            if (post.getId() == index) {
                post.setContent(updatedPost.getContent());
                post.setPic(updatedPost.getPic());
            }// This requires a properly overridden equals method in Post
            notifyDataSetChanged();
        }

    }
    public void addPost(Post post) {
        posts.add(post);
        notifyDataSetChanged();

    }

    private void showShareOptions() {
        final BottomSheetDialog bottomSheetDialog = new BottomSheetDialog(context);
        bottomSheetDialog.setContentView(R.layout.bottom_sheet_share);

        ImageButton btnShareSmartphone = bottomSheetDialog.findViewById(R.id.btnShareSmartphone);
        ImageButton btnShareMessenger = bottomSheetDialog.findViewById(R.id.btnShareChat);
        ImageButton btnShareFeed = bottomSheetDialog.findViewById(R.id.btnShareFeed);

        bottomSheetDialog.show();
    }

}
