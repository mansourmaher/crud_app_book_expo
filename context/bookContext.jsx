import React, { createContext, useReducer } from "react";

const initialState = {
  bookedBooks: [],
};

export const BookContext = createContext(initialState);

const bookReducer = (state: any, action: any) => {
  switch (action.type) {
    case "ADD_TO_PANNIER":
      if (
        state.bookedBooks.find((book: any) => book.id === action.payload.id)
      ) {
        return state;
      }
      return { ...state, bookedBooks: [...state.bookedBooks, action.payload] };
  }
};

export const BookProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(bookReducer, initialState);

  return (
    // @ts-ignore
    <BookContext.Provider value={{ bookedBooks: state.bookedBooks, dispatch }}>
      {children}
    </BookContext.Provider>
  );
};
