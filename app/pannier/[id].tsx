import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  TextInput,
  FlatList,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { BookList } from "@/data/book";
import BookItem from "@/compoenets/bookItem";
import { BookContext, BookProvider } from "@/context/bookContext";
import * as SQLite from "expo-sqlite";
import PannierBookItem from "@/compoenets/pannierBookItem";
import { ca } from "react-native-paper-dates";

const Pannier = () => {
  const { id } = useLocalSearchParams();
  const context = useContext(BookContext);
  // @ts-ignore
  const { bookedBooks, dispatch } = context;

  const [quantity, setQuantity] = useState("1");
  const [bookedList, setBookedList] = useState([]);
  const router = useRouter();
  const navigation = useNavigation();
  //

  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      const db = await SQLite.openDatabaseAsync("books.db");
      const book = await db.getFirstAsync("SELECT * FROM books WHERE id = ?", [
        id,
      ]);
      setBook(book);
    };
    const fetchBookedBooks = async () => {
      const db = await SQLite.openDatabaseAsync("books.db");
      const bookedBooks = await db.getAllAsync("SELECT * FROM bookedBooks");
      setBookedList(bookedBooks);
    };
    fetchBookedBooks();

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
  const fetchSpecificBook = async (id: string) => {
    console.log("🔍 Fetching book with id:", id);

    const db = await SQLite.openDatabaseAsync("books.db");

    try {
      const book = await db.getFirstAsync(
        "SELECT * FROM bookedBooks WHERE id = ?",
        [parseInt(id)]
      );
      console.log("✅ Found book:", book);
      return book;
    } catch (error) {
      console.error("❌ Error fetching book:", error);
      return null;
    }
  };
  const handelAddBookToPannierSqlite = async () => {
    const db = await SQLite.openDatabaseAsync("books.db");
    console.log("book", id);
    // const dleeteallbooked = await db.runAsync("DELETE FROM bookedBooks");

    const existingBook = await fetchSpecificBook(id);
    if (existingBook) {
      console.log("existingBook", existingBook);
      try {
        await db.runAsync("UPDATE bookedBooks SET quantite = ? WHERE id = ?", [
          existingBook.quantite + parseInt(quantity),
          id,
        ]);
      } catch (e) {
        console.log(e);
      }

      router.replace(`/pannier/${id}`);
      return;
    } else if (!existingBook) {
      try {
        await db.runAsync(
          "INSERT INTO bookedBooks (id,title, author, createdAt, description, image,quantite) VALUES (?,?, ?, ?, ?, ?,?)",
          [
            id,
            book.title,
            book.author,
            book.createdAt,
            book.description,
            book.image,
            quantity,
          ]
        );
      } catch (e) {
        console.log(e);
      }
    }
    router.replace(`/pannier/${id}`);
  };

  // const handleBook = () => {
  //   const newBooking = { ...book };
  //   console.log(newBooking, { id: bookedBooks.length + 1, quantity: quantity });
  //   dispatch({ type: "ADD_TO_PANNIER", payload: newBooking });
  //   console.log(bookedBooks.length);
  //   //dispatch({ type: "ADD_TO_PANNIER", payload: newBooking });
  // };

  if (!book) {
    return (
      <View style={styles.container}>
        <Text>Book not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <Image source={{ uri: book.image }} style={styles.image} /> */}
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.description}>{book.title}</Text>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
      />

      <Pressable
        style={styles.updateButton}
        onPress={handelAddBookToPannierSqlite}
      >
        <Text style={styles.buttonText}>Add to Booking List</Text>
      </Pressable>
      <View style={{ marginTop: 20 }}>
        <FlatList
          data={bookedList}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <Text
              style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}
            >
              Book List
            </Text>
          )}
          renderItem={({ item }) => <PannierBookItem book={item} />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  pressablestyle: {
    backgroundColor: "orange",
    borderRadius: 20,
    alignItems: "center",
    padding: 10,
    marginTop: 10,
  },
  viewListButton: {
    backgroundColor: "blue",
    borderRadius: 20,
    alignItems: "center",
    padding: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  author: {
    fontSize: 18,
    color: "#666",
    marginBottom: 10,
  },
  createdAt: {
    fontSize: 16,
    color: "#888",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    width: "100%",
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
});

export default Pannier;
