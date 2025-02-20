import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import * as SQLite from "expo-sqlite";
import { Button } from "react-native-paper";

const UpdateBook = () => {
  const { id } = useLocalSearchParams();
  const [book, setBook] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: "Update Book",
    });

    const fetchBook = async () => {
      const db = await SQLite.openDatabaseAsync("books.db");
      const book = await db.getFirstAsync("SELECT * FROM books WHERE id = ?", [
        id,
      ]);

      if (book) {
        setBook(book);
        setTitle(book.title);
        setAuthor(book.author);
        setDescription(book.description);
        setImage(book.image);
      }
    };

    fetchBook();
  }, [id]);

  const updateBook = async () => {
    if (!title || !author || !description || !image) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    const db = await SQLite.openDatabaseAsync("books.db");
    await db.runAsync(
      "UPDATE books SET title = ?, author = ?, description = ?, image = ? WHERE id = ?",
      [title, author, description, image, id]
    );

    Alert.alert("Success", "Book updated successfully!");
    navigation.goBack();
  };

  if (!book) {
    return (
      <View style={styles.container}>
        <Text>Loading book details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>✏️ Update Book</Text>

      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Author"
        value={author}
        onChangeText={setAuthor}
        style={styles.input}
      />

      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        style={[styles.input, styles.textArea]}
      />

      <TextInput
        placeholder="Image URL"
        value={image}
        onChangeText={setImage}
        style={styles.input}
      />

      <TouchableOpacity style={styles.updateButton} onPress={updateBook}>
        <Text style={styles.buttonText}>Update Book</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f6f9",
    alignItems: "center",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2c3e50",
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#bdc3c7",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  updateButton: {
    backgroundColor: "#3f7dcd",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    shadowColor: "#3f7dcd",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default UpdateBook;
