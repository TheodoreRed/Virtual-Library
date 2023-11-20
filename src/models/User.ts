import Book from "./Book";

export default interface User {
  uid: string; // Unique identifier from Firebase
  displayName?: string; // User's display name (optional)
  photoURL?: string; // URL of the user's profile picture (optional)
  registeredAt?: Date; // Date when the user registered (optional)
  library: Book[]; // Array of books in the user's library
}
