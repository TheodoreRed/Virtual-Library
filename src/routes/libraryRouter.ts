import express, { Request, Response } from "express";
import { getClient } from "../db";
import User from "../models/User";
import { errorResponse } from "./userRouter";
import GoogleBook from "../models/GoogleBook";
import axios from "axios";

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

export const getBookById = (bookId: string): Promise<GoogleBook> => {
  return axios
    .get(
      `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(
        bookId
      )}`
    )
    .then((res) => res.data);
};

libraryRouter.post(
  "/:bookId",
  async (req: Request<UserParams>, res: Response) => {
    const { uid, bookId } = req.params;

    if (!bookId) {
      return res.status(400).json({ message: "Book ID is required" });
    }

    try {
      const client = await getClient();

      // Validate user
      const user = await client.db().collection<User>("users").findOne({ uid });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const book: GoogleBook = await getBookById(bookId);

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
  }
);

libraryRouter.delete("/:bookId", async (req: Request<UserParams>, res) => {
  const { uid, bookId } = req.params;

  if (!bookId) {
    return res.status(400).json({ message: "Book ID is required" });
  }

  try {
    const client = await getClient();

    const response = await client
      .db()
      .collection("users")
      .updateOne({ uid }, { $pull: { library: { id: bookId } } });

    if (!response.modifiedCount) {
      return res
        .status(404)
        .json({ message: "Book not found in user's library" });
    }
    res.status(200).json({ message: "Book removed from library" });
  } catch (error) {
    errorResponse(error, res);
  }
});

export default libraryRouter;
