import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Link, router } from "expo-router";

import * as SQLite from "expo-sqlite";

const PannierBookItem = ({ book }: any) => {
  const handelremoveFromPnnaier = async () => {
    console.log("book to remove", book);
    try {
      const db = await SQLite.openDatabaseAsync("books.db");
      await db.runAsync("DELETE FROM bookedBooks WHERE id = ?", [book.id]);
    } catch (err) {
      console.log("error", err);
      return;
    }

    alert("book removed from pannier");
    router.replace(`/pannier/${book.id}`);
  };
  return (
    <View style={styles.card}>
      <Image source={{ uri: book.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{book.title}</Text>

        <View style={{ flexDirection: "row" }}>
          <Text style={styles.qunatityStyle}>Quantite: {book.quantite}</Text>
        </View>

        <TouchableOpacity
          onPress={handelremoveFromPnnaier}
          style={styles.deleteBuuton}
        >
          <Text style={styles.delettext}>Remove from pannier</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    borderColor: "yellow",
    borderWidth: 1,
    width: "auto",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: 10,
    padding: 10,
  },
  qunatityStyle: {
    color: "green",
    fontWeight: "bold",
    fontSize: 15,
  },
  delettext: {
    color: "white",
    fontWeight: "bold",
  },
  deleteBuuton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    width: "auto",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  image: {
    width: 100,
    height: 150,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
  pressed: {
    opacity: 0.8,
  },
});

export default PannierBookItem;
