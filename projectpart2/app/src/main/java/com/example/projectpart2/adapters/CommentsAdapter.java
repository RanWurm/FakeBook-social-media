package com.example.projectpart2.adapters;

import android.content.Context;
import android.graphics.Color;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.EditorInfo;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.TextView;

import androidx.lifecycle.ViewModelProvider;
import androidx.lifecycle.ViewModelStoreOwner;
import androidx.recyclerview.widget.RecyclerView;
import androidx.room.Room;

import com.example.myapplication.R;
import com.example.projectpart2.AppDB;
import com.example.projectpart2.dao.PostDao;
import com.example.projectpart2.dao.UserDao;
import com.example.projectpart2.entities.Comment;
import com.example.projectpart2.entities.Post;
import com.example.projectpart2.entities.User;
import com.example.projectpart2.viewmodels.PostsViewModel;

import java.util.List;

public class CommentsAdapter extends RecyclerView.Adapter<CommentsAdapter.CommentViewHolder> {

    private List<Comment> comments;
    //private PostsListAdapter postsAdapter;
    private PostsListAdapter postsListAdapter;
    private int postPosition;
    private int postId;
    private String token;
    private boolean isDarkMode = false;
    private AppDB db;

    private PostsViewModel postsViewModel;

    private PostDao postDao;
    private UserDao userDao;
    public CommentsAdapter(Context context, int postId, int postPosition, PostsListAdapter postsListAdapter, String token) {
        db = Room.databaseBuilder(context, AppDB.class, "SocialNetworkDB").allowMainThreadQueries().fallbackToDestructiveMigration().build();
        postDao = db.postDao();
        userDao = db.userDao();
        this.comments = postDao.get(postId).getComments();
        this.postPosition = postPosition;
        this.postsListAdapter = postsListAdapter;
        this.postId = postId;
        this.token = token;
        this.postsViewModel = new ViewModelProvider((ViewModelStoreOwner) context).get(PostsViewModel.class);

    }

    @Override
    public CommentViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.comment_item, parent, false);
        return new CommentViewHolder(view);
    }

    public void onThemeChanged(boolean isDarkMode) {
        this.isDarkMode = isDarkMode;
        notifyDataSetChanged(); // Trigger re-binding of data to reflect theme change
    }

    @Override
    public void onBindViewHolder(CommentViewHolder holder, int position) {
        if (comments != null) {
            Comment comment = this.comments.get(position);
            holder.tvComment.setText(comment.getContent());



            holder.editComment.setOnClickListener(v -> {
                holder.tvComment.setVisibility(View.GONE);
                holder.etComment.setVisibility(View.VISIBLE);
                holder.etComment.setText(holder.tvComment.getText());
                holder.etComment.requestFocus();

            });
            holder.etComment.setOnEditorActionListener((v, actionId, event) -> {
                if (actionId == EditorInfo.IME_ACTION_DONE || (event != null && event.getKeyCode() == KeyEvent.KEYCODE_ENTER)) {
                    // Update comment with new text
                    Comment newComment = new Comment(holder.etComment.getText().toString());
                    comments.set(position, newComment);
                    holder.tvComment.setText(holder.etComment.getText().toString());
                    holder.etComment.setVisibility(View.GONE);
                    holder.tvComment.setVisibility(View.VISIBLE);
                    Post post = postDao.get(postId); //getting the current post before the edit of the comment
                    post.editComment(position, newComment); //editing the comment
                    User currentUser = findUserByPostAuthor(post.getAuthorID());
                    postsViewModel.editPost(currentUser.getId(), postId, token, post);
                    notifyItemChanged(position);

                    return true;
                }
                return false;
            });

            holder.deleteComment.setOnClickListener(v -> {
                int adapterPosition = holder.getAdapterPosition();
                if (adapterPosition != RecyclerView.NO_POSITION) {
                    comments.remove(position);
                    Post post = postDao.get(postId); //getting the current post before the edit of the comment
                    post.deleteComment(position); //deleting the comment
                    User currentUser = findUserByPostAuthor(post.getAuthorID());
                    postsViewModel.editPost(currentUser.getId(), postId, token, post);
                    notifyItemChanged(position);
                }

            });

            if (isDarkMode) {
                holder.tvComment.setBackgroundResource(R.drawable.lower_border_night);
                holder.tvComment.setTextColor(Color.WHITE);
                holder.etComment.setTextColor(Color.WHITE);
                holder.editComment.setBackgroundResource(R.drawable.bottom_layout_buttons_night);
                holder.deleteComment.setBackgroundResource(R.drawable.bottom_layout_buttons_night);
            }
            else {
                holder.tvComment.setBackgroundResource(R.drawable.lower_border);
                holder.tvComment.setTextColor(Color.BLACK);
                holder.etComment.setTextColor(Color.BLACK);
                holder.editComment.setBackgroundResource(R.drawable.bottom_layout_buttons);
                holder.deleteComment.setBackgroundResource(R.drawable.bottom_layout_buttons);
            }
        }

        }

    @Override
    public int getItemCount() {
        return comments.size();
    }

    class CommentViewHolder extends RecyclerView.ViewHolder {
        TextView tvComment;
        EditText etComment;
        ImageButton editComment;
        ImageButton deleteComment;

        private CommentViewHolder(View itemView) {
            super(itemView);
            tvComment = itemView.findViewById(R.id.tvComment);
            etComment = itemView.findViewById(R.id.etComment);
            editComment = itemView.findViewById(R.id.editComment);
            deleteComment = itemView.findViewById(R.id.deleteComment);

        }
    }

    public User findUserByPostAuthor(int authorId) {
        User user = userDao.get(authorId);
        return user;
    }

}
