import express, { Request } from "express";
import { getClient } from "../db";
import User from "../models/User";
import { errorResponse } from "./userRouter";

const libraryRouter = express.Router({ mergeParams: true }); // To access params from the parent router

interface UserParams {
  uid: string;
  bookId?: string;
}

libraryRouter.get("/", async (req: Request<UserParams>, res) => {
  // Get the userId from the path param
  const uid = req.params.uid;

  try {
    // connect to MongoDB client
    const client = await getClient();

    // Get the User we need
    const user: User | null = await client
      .db()
      .collection<User>("users")
      .findOne({ uid });

    if (user) {
      // If the user exists return their library
      res.status(200).json(user.library);
    }
  } catch (error) {
    errorResponse(error, res);
  }
});

libraryRouter.post("/:bookId", async (req: Request<UserParams>, res) => {
  const uid = req.params.uid;
  const bookId = req.params.bookId;

  try {
    const client = await getClient();

    // Validate user
    const user = await client.db().collection<User>("users").findOne({ uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Make a callto Google API
    const book = null;
    if (book) {
      // Add book to user's library
      await client
        .db()
        .collection<User>("users")
        .updateOne({ uid }, { $push: { library: book } });
      res.status(201).json({ message: "Book added to library", book });
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    errorResponse(error, res);
  }
});

libraryRouter.delete("/:userId/library/:bookId", async (req, res) => {
  // Code to remove a book from a user's library
});

export default libraryRouter;
