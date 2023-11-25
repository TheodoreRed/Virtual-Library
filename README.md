# Virtual-Library Backend

## Overview

This repository contains the backend for Virtual-Library, a dynamic web application for managing user accounts and personal book collections. The backend handles user authentication, library management, and provides endpoints for frontend interaction.

## API Endpoints

### User Endpoints

- `GET /users/:uid`: Retrieve a user by their Firebase UID.
- `POST /users`: Create a new user.
- `PUT /users/:uid`: Update a user's data.
- `DELETE /users/:uid`: Delete a user.

### Library Endpoints (User's Personal Library)

- `GET /users/:uid/library`: Retrieve the library of a specific user.
- `POST /users/:uid/library/:bookId`: Add a book to the user's library.
- `DELETE /users/:uid/library/:bookId`: Remove a book from the user's library.

## Technologies

- Node.js
- Express
- MongoDB
- TypeScript

## Installation and Setup

- ```bash
  git clone https://github.com/TheodoreRed/Virtual-Library.git
  cd Virtual-Library
  ```
- ```
  npm install
  ```
