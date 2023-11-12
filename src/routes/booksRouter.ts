import express from "express";
import { getClient } from "../db";
import Book from "../models/Book";
import { ObjectId } from "mongodb";
import User from "../models/User";
import { errorResponse } from "./userRouter";

const booksRouter = express.Router();

// return the collection of books
booksRouter.get("/", async (req, res) => {
  try {
    const client = await getClient();
    const bookCollection = await client.db().collection<Book>("books").find();
    if (!bookCollection) {
      res.status(404).json({ message: `Book collection not found` });
    }
    res.status(200).json(bookCollection);
  } catch (error) {
    errorResponse(error, res);
  }
});

// Get - Returns a specific book from a user's library
booksRouter.get("/:userId/library/:bookId", async (req, res) => {
  const _id: ObjectId = new ObjectId(req.params.userId);
  const bookId: ObjectId = new ObjectId(req.params.bookId);

  try {
    const client = await getClient();

    const user: User | null = await client
      .db()
      .collection<User>("users")
      .findOne({ _id });

    if (user) {
      // If the user is found
      const book: Book | null = await client
        .db()
        .collection<Book>("users")
        .findOne({ _id, "library._id": bookId });

      if (book) {
        // if the book is found
        res.status(200).json(book);
      } else {
        res.status(404).json({ message: `Error with bookId: ${bookId}` });
      }
    } else {
      res.status(404).json({ message: `Error with userID: ${_id}` });
    }
  } catch (error) {
    errorResponse(error, res);
  }
});

// POST - Adds a book to a users library
booksRouter.post("/:userId/library", async (req, res) => {
  const _id: ObjectId = new ObjectId(req.params.userId);
  const newBook: Book = req.body;

  try {
    const client = await getClient();

    const user: User | null = await client
      .db()
      .collection<User>("users")
      .findOne({ _id });
    if (user) {
      // if user exists proceed
      const book: Book | null = await client
        .db()
        .collection<Book>("books")
        .findOne({
          title: newBook.title,
          author: newBook.author,
        });

      if (book) {
        // book exists increment quantity by 1
        await client
          .db()
          .collection<Book>("books")
          .updateOne(book, { $inc: { quantity: 1 } });
      } else {
        // newBook doesnt exist add it to the `books` collection
        newBook.quantity = 1;
        await client.db().collection<Book>("books").insertOne(newBook);
      }

      await client
        .db()
        .collection<User>("users")
        .updateOne(_id, { $push: { library: newBook } });
      res.status(201).json(newBook);
    } else {
      res.status(404).json({ message: `Error with userID: ${_id}` });
    }
  } catch (error) {
    errorResponse(error, res);
  }
});

// PUT - Replace a book in user's library
booksRouter.put("/:userId/library/:bookId", async (req, res) => {
  const _id: ObjectId = new ObjectId(req.params.userId);
  const bookId: ObjectId = new ObjectId(req.params.bookId);

  const replacementBook: Book = req.body;
  try {
    const client = await getClient();

    const user: User | null = await client
      .db()
      .collection<User>("users")
      .findOne({ _id });

    if (user) {
      const book: Book | null = await client
        .db()
        .collection<Book>("books")
        .findOne({
          title: replacementBook.title,
          author: replacementBook.author,
        });

      if (book) {
        // book exists increment quantity by 1
        await client
          .db()
          .collection<Book>("books")
          .updateOne(book, { $inc: { quantity: 1 } });
      } else {
        // newBook doesnt exist add it to the `books` collection
        replacementBook.quantity = 1;
        await client.db().collection<Book>("books").insertOne(replacementBook);
      }

      await client
        .db()
        .collection<User>("users")
        .updateOne({ _id, "library._id": bookId }, replacementBook);

      res.status(200).json(replacementBook);
    } else {
      res.status(404).json({ message: `Error with userID: ${_id}` });
    }
  } catch (error) {
    errorResponse(error, res);
  }
});

booksRouter.delete("/:userId/library/:bookId", async (req, res) => {
  const _id: ObjectId = new ObjectId(req.params.userId);
  const bookId: ObjectId = new ObjectId(req.params.bookId);

  try {
    const client = await getClient();

    const user: User | null = await client
      .db()
      .collection<User>("users")
      .findOne({ _id });

    if (user) {
      const book: Book | null = await client
        .db()
        .collection<Book>("books")
        .findOne(bookId);

      if (book) {
        // book exists decrement quantity by 1
        await client
          .db()
          .collection<Book>("books")
          .updateOne(book, { $inc: { quantity: -1 } });
      } else {
        res.status(404).json({ message: `Error with bookId: ${bookId}` });
      }

      await client.db().collection<User>("users").deleteOne({});

      res.sendStatus(204);
    } else {
      res.status(404).json({ message: `Error with userID: ${_id}` });
    }
  } catch (error) {
    errorResponse(error, res);
  }
});

export default booksRouter;
