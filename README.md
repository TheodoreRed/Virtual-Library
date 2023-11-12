# Virtual-Library

## Project Overview

Virtual-Library is an evolving web application designed to offer a personalized virtual library experience. It allows users to sign up, log in, and curate their individual book collections. The project now includes robust backend services focusing on foundational user and book management features.

## API Endpoints

### User Endpoints

- **GET `/users/:id`**: Retrieve a user by their ID.
- **POST `/users`**: Create a new user.
- **PUT `/users/:id`**: Replace a user's data with new data.
- **DELETE `/users/:id`**: Delete a user by their ID.

### Book Endpoints (Nested under Users)

- **GET `/users/books`**: Retrieve the collection of all books.
- **GET `/users/:userId/library/:bookId`**: Get a specific book from a user's library.
- **POST `/users/:userId/library`**: Add a book to a user's library.
- **PUT `/users/:userId/library/:bookId`**: Replace a book in a user's library.
- **DELETE `/users/:userId/library/:bookId`**: Remove a book from a user's library.
## Future Development

After establishing the core API, the next phase will involve building a React application for a more interactive and user-friendly interface.

## Current State

The project is in its initial development phase with the following features:

- User account creation, update, and deletion functionality.
- Capability for users to add, update, delete, and manage books in their personal library.
- Efficient handling of book and user data using MongoDB.
- Initial setup of a MongoDB database for storing user and book information.

## Technologies

- Node.js
- Express
- MongoDB
- TypeScript
- React (planned for future development)
