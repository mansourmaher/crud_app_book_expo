import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import React from "react";
import { Link } from "expo-router";

const BookItem = ({ book }: any) => {
  return (
    <Link href={`/detail/${book.id}`} asChild>
      <Pressable>
        {({ pressed }) => (
          <View style={[styles.card, pressed && styles.pressed]}>
            <Image source={{ uri: book.image }} style={styles.image} />
            <View style={styles.content}>
              <Text style={styles.title}>{book.title}</Text>
              <Text style={styles.description} numberOfLines={3}>
                {book.description}
              </Text>
              {book.quantity > 0 && <Text>Quantite {book.quantity}</Text>}
            </View>
          </View>
        )}
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: 10,
    padding: 10,
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

export default BookItem;
