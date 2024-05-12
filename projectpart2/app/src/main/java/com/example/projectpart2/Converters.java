package com.example.projectpart2;

import androidx.room.TypeConverter;

import com.example.projectpart2.entities.Comment;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;

public class Converters {
    @TypeConverter
    public static List<String> fromString(String value) {
        Type listType = new TypeToken<List<String>>() {}.getType();
        return new Gson().fromJson(value, listType);
    }

    @TypeConverter
    public static String fromList(List<String> list) {
        Gson gson = new Gson();
        return gson.toJson(list);
    }

    @TypeConverter
    public static Date fromTimestamp(Long value) {
        return value == null ? null : new Date(value);
    }

    @TypeConverter
    public static Long dateToTimestamp(Date date) {
        return date == null ? null : date.getTime();
    }
    private static Gson gson = new Gson();

    @TypeConverter
    public static List<Comment> stringToCommentList(String data) {
        if (data == null) {
            return null;
        }

        Type listType = new TypeToken<List<Comment>>() {}.getType();
        return gson.fromJson(data, listType);
    }

    @TypeConverter
    public static String commentListToString(List<Comment> someObjects) {
        return gson.toJson(someObjects);
    }
    // Converter for List<Integer>
    @TypeConverter
    public static List<Integer> stringToIntegerList(String data) {
        if (data == null) {
            return null;
        }
        Type listType = new TypeToken<List<Integer>>() {}.getType();
        return gson.fromJson(data, listType);
    }

    @TypeConverter
    public static String integerListToString(List<Integer> someObjects) {
        return gson.toJson(someObjects);
    }
}
