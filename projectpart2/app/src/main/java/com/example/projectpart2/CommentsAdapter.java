package com.example.projectpart2;

import android.graphics.Color;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.EditorInfo;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import com.example.myapplication.R;

import java.util.List;

public class CommentsAdapter extends RecyclerView.Adapter<CommentsAdapter.CommentViewHolder> {

    private List<String> comments;
    //private PostsListAdapter postsAdapter;
    private CommentUpdateListener updateListener;

    private int postPosition;
    private boolean isDarkMode = false;
    public CommentsAdapter(List<String> comments, int postPosition, CommentUpdateListener updateListener) {
        this.comments = comments;
        this.postPosition = postPosition;
        this.updateListener = updateListener;

    }

    @Override
    public CommentViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.comment_item, parent, false);
        return new CommentViewHolder(view);
    }

    public void onThemeChanged(boolean isDarkMode) {
        // Implement theme change handling here
        // This could involve setting a member variable and using it in onBindViewHolder
        this.isDarkMode = isDarkMode;
        notifyDataSetChanged(); // Trigger re-binding of data to reflect theme change
    }

    @Override
    public void onBindViewHolder(CommentViewHolder holder, int position) {
        if (comments != null) {
            String comment = this.comments.get(position);
            holder.tvComment.setText(comment);



            holder.editComment.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    holder.tvComment.setVisibility(View.GONE);
                    holder.etComment.setVisibility(View.VISIBLE);
                    holder.etComment.setText(holder.tvComment.getText());
                    holder.etComment.requestFocus();

                }
            });
            holder.etComment.setOnEditorActionListener((v, actionId, event) -> {
                if (actionId == EditorInfo.IME_ACTION_DONE || (event != null && event.getKeyCode() == KeyEvent.KEYCODE_ENTER)) {
                    // Update comment with new text
                    String newComment = holder.etComment.getText().toString();
                    holder.tvComment.setText(newComment);
                    holder.etComment.setVisibility(View.GONE);
                    holder.tvComment.setVisibility(View.VISIBLE);
                    int adapterPosition = holder.getAdapterPosition();
                    comments.set(adapterPosition, newComment);

                    if (updateListener != null) {
                        updateListener.onCommentUpdated(postPosition, comments);
                    }
                    notifyItemChanged(adapterPosition);

                    // Optional: Hide keyboard
                    return true;
                }
                return false;
            });

            holder.deleteComment.setOnClickListener(new View.OnClickListener() {
                @Override

                public void onClick(View v) {
                    int adapterPosition = holder.getAdapterPosition();
                    if (adapterPosition != RecyclerView.NO_POSITION) {
                        comments.remove(adapterPosition);

                        if (updateListener != null) {
                            updateListener.onCommentUpdated(postPosition, comments);
                        }
                        notifyItemRemoved(adapterPosition);
                    }

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

    static class CommentViewHolder extends RecyclerView.ViewHolder {
        TextView tvComment;
        EditText etComment;
        ImageButton editComment;
        ImageButton deleteComment;

        public CommentViewHolder(View itemView) {
            super(itemView);
            tvComment = itemView.findViewById(R.id.tvComment);
            etComment = itemView.findViewById(R.id.etComment);
            editComment = itemView.findViewById(R.id.editComment);
            deleteComment = itemView.findViewById(R.id.deleteComment);

        }
    }

}
