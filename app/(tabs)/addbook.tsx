import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  Platform,
  TouchableOpacity,
} from "react-native";
import { TextInput, Button, Card, Text } from "react-native-paper";
import * as SQLite from "expo-sqlite";
import { DatePickerModal } from "react-native-paper-dates";
import { router } from "expo-router";

//  import DateTimePicker from "@react-native-community/datetimepicker";

const randomImage = [
  "https://covers.openlibrary.org/b/id/9876543-L.jpg",
  "https://covers.openlibrary.org/b/id/8765432-L.jpg",
  "https://covers.openlibrary.org/b/id/7654321-L.jpg",
  "https://covers.openlibrary.org/b/id/6543210-L.jpg",
  "https://covers.openlibrary.org/b/id/5432109-L.jpg",
  "https://covers.openlibrary.org/b/id/4321098-L.jpg",
  "https://covers.openlibrary.org/b/id/3210987-L.jpg",
  "https://covers.openlibrary.org/b/id/2109876-L.jpg",
  "https://covers.openlibrary.org/b/id/1098765-L.jpg",
  "https://covers.openlibrary.org/b/id/9988776-L.jpg",
  "https://covers.openlibrary.org/b/id/8877665-L.jpg",
  "https://covers.openlibrary.org/b/id/7766554-L.jpg",
  "https://covers.openlibrary.org/b/id/6655443-L.jpg",
  "https://covers.openlibrary.org/b/id/5544332-L.jpg",
  "https://covers.openlibrary.org/b/id/4433221-L.jpg",
  "https://covers.openlibrary.org/b/id/3322110-L.jpg",
  "https://covers.openlibrary.org/b/id/2211009-L.jpg",
  "https://covers.openlibrary.org/b/id/1100998-L.jpg",
  "https://covers.openlibrary.org/b/id/0099887-L.jpg",
  "https://covers.openlibrary.org/b/id/9988776-L.jpg",
];

export default function AddBook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [createdAt, setCreatedAt] = useState(new Date());
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [books, setBooks] = useState([]);
  const [date, setDate] = useState(null);
  const [open, setOpen] = useState(false);
  //   const [showDatePicker, setShowDatePicker] = useState(false);

  const addBook = async () => {
    const imagetoadd =
      randomImage[Math.floor(Math.random() * randomImage.length)];
    const db = await SQLite.openDatabaseAsync("books.db");

    if (!title || !author || !createdAt || !description ) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }
    console.log(createdAt.toISOString().split("T")[0]);
    const addNew = await db.runAsync(
      "INSERT INTO books (title, author, createdAt, description, image) VALUES (?, ?, ?, ?, ?)",
      [
        title,
        author,
        createdAt.toISOString().split("T")[0],
        description,
        imagetoadd,
      ]
    );
    setTitle("");
    setAuthor("");
    setCreatedAt(new Date());
    setDescription("");
    setImage("");
    addNew;
    Alert.alert("Success", "Book added successfully!");
    router.replace("/(tabs)");
    console.log(addNew);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>📖 Add New Book</Text>

      <TextInput
        style={styles.input}
        placeholder="Book Title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Author Name"
        value={author}
        onChangeText={setAuthor}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity style={styles.addButton} onPress={addBook}>
        <Text style={styles.buttonText}>Add Book</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f9",
    padding: 20,
    alignItems: "center",
  },
  headerText: {
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
  addButton: {
    backgroundColor: "#3f7dcd",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
