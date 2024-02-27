package com.example.projectpart2;

import java.util.List;

public interface CommentUpdateListener {
    void onCommentUpdated(int postPosition, List<String> updatedComments);
}