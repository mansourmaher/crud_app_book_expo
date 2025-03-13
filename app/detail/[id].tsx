import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import * as SQLite from "expo-sqlite";

const DetailPage = () => {
  const { id } = useLocalSearchParams();
  const [book, setBook] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchBook = async () => {
      const db = await SQLite.openDatabaseAsync("books.db");
      const book = await db.getFirstAsync("SELECT * FROM books WHERE id = ?", [
        id,
      ]);
      setBook(book);
    };
    fetchBook();
  }, [id]);

  useEffect(() => {
    if (book) {
      navigation.setOptions({
        title: book.title,
        headerBackTitleVisible: true,
      });
    }
  }, [book, navigation]);

  const deleteBook = async () => {
    
    Alert.alert(
      "Delete Book",
      "Are you sure you want to delete this book?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const db = await SQLite.openDatabaseAsync("books.db");
              await db.runAsync("DELETE FROM books WHERE id = ?", [id]);
            } catch (e) {
              console.log(e);
            }

            // Navigate back to the previous screen or book list
            router.replace("/(tabs)");
          },
        },
      ],
      { cancelable: true }
    );
  };
  const handelMoveToPannier = () => {
    router.replace(`/pannier/${id}`);
  };

  if (!book) {
    return (
      <View style={styles.container}>
        <Text>Book not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: book.image }} style={styles.image} />

      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.author}>By {book.author}</Text>
      <Text style={styles.createdAt}>📅 Published on {book.createdAt}</Text>

      <Text style={styles.description}>{book.description}</Text>

      <TouchableOpacity
        style={styles.updateButton}
        onPress={() => router.replace(`/update/${book.id}`)}
      >
        <Text style={styles.buttonText}>✏️ Update Book</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={deleteBook}>
        <Text style={styles.buttonText}>🗑️ Delete Book</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.pannierBuuton}
        onPress={handelMoveToPannier}
      >
        <Text style={styles.buttonText}>🛒 Add to pannier</Text>
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
  image: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: 10,
  },
  author: {
    fontSize: 18,
    color: "#3f7dcd",
    fontWeight: "500",
    marginBottom: 8,
  },
  createdAt: {
    fontSize: 16,
    color: "#636e72",
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#2d3436",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  updateButton: {
    backgroundColor: "#3f7dcd",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
    shadowColor: "#3f7dcd",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
    shadowColor: "#e74c3c",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  pannierBuuton: {
    backgroundColor: "#00FF00",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
    shadowColor: "#3f7dcd",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginTop: 10,
  },
});

export default DetailPage;
