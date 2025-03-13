import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BookList } from "../../data/book";
import { SafeAreaView } from "react-native-safe-area-context";
import BookItem from "@/compoenets/bookItem";
import * as SQLite from "expo-sqlite";
import { Link } from "expo-router";

export default function HomeScreen() {
  const [books, setBooks] = useState(null);
  useEffect(() => {
    async function setupDatabase() {
      const db = await SQLite.openDatabaseAsync("books.db");

      async function createTable() {
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY NOT NULL,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            createdAt TEXT NOT NULL,
            description TEXT NOT NULL,
            image TEXT NOT NULL
          );
        `);
      }
      async function createTableBookedBooks() {
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS bookedBooks (
            id INTEGER PRIMARY KEY NOT NULL,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            createdAt TEXT NOT NULL,
            description TEXT NOT NULL,
            image TEXT NOT NULL,
            quantite INTEGER NOT NULL
          );
        `);
      }
      async function seeWichQuiriesIsRuuning() {
        const tt = await db.execAsync(`
          SELECT * FROM sqlite_master;
        `);
      }
      await createTableBookedBooks();

      await createTable();
      await seeWichQuiriesIsRuuning();

      const insertData = async () => {
        await db.runAsync(
          "INSERT INTO books (title, author, createdAt, description, image) VALUES (?, ?, ?, ?, ?)",
          [
            "Book1",
            "Author1",
            "2021-05-01",
            "Description1",
            "https://picsum.photos/200/300",
          ]
        );
        await db.runAsync(
          "INSERT INTO books (title, author, createdAt, description, image) VALUES (?, ?, ?, ?, ?)",
          [
            "Book2",
            "Author2",
            "2021-05-02",
            "Description2",
            "https://picsum.photos/200/300",
          ]
        );
      };

      // await insertData();

      const fetchData = async () => {
        const allRows = await db.getAllAsync("SELECT * FROM books");

        setBooks(allRows);
      };

      await fetchData();
    }

    setupDatabase();
  }, [books]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>📚 Book List</Text>
      </View>

      <FlatList
        data={books}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.bookItem}>
            <Image source={{ uri: item.image }} style={styles.bookImage} />
            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle}>{item.title}</Text>
              <Text style={styles.bookAuthor}>by {item.author}</Text>
              <Link href={`/detail/${item.id}`} asChild>
                <TouchableOpacity style={styles.detailsButton}>
                  <Text style={styles.buttonText}>View Details</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  listContainer: {
    paddingBottom: 20,
  },
  bookItem: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  bookImage: {
    width: 70,
    height: 100,
    borderRadius: 8,
    marginRight: 15,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#34495e",
  },
  bookAuthor: {
    fontSize: 14,
    color: "#7f8c8d",
    marginVertical: 5,
  },
  detailsButton: {
    backgroundColor: "#3498db",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
