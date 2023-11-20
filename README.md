# Virtual-Library

## Project Overview

Virtual-Library is a dynamic web application designed to provide a personalized virtual library experience. It enables users to create accounts, manage their personal book collections, and interact with a vast collection of books through an external API. The backend is structured to offer distinct services for user management, library management, and book details retrieval.

## API Endpoints

### User Endpoints

- **GET `/users/:uid`**: Retrieve a user by their Firebase UID.
- **POST `/users`**: Create a new user.
- **PUT `/users/:uid`**: Update a user's data.
- **DELETE `/users/:uid`**: Delete a user.

### Library Endpoints (User's Personal Library)

- **GET `/users/:uid/library`**: Retrieve the library of a specific user.
- **POST `/users/:uid/library/:bookId`**: Add a book to the user's library. _(Integration with external book API pending)_
- **DELETE `/users/:uid/library/:bookId`**: Remove a book from the user's library.

### Book Endpoints

- **GET `/books`**: Retrieve a list of books from the external book API. _(Details to be added upon API selection)_
- **GET `/books/:bookId`**: Get details of a specific book from the external book API. _(Details to be added upon API selection)_

## Technologies

- Node.js
- Express
- MongoDB
- TypeScript
- React (planned for future development)

## Future Development

- Integration with an external book API to enrich the library with a broader range of books and detailed information.
- Development of a React frontend for a more interactive and engaging user experience.
