import express from "express";
import { getClient } from "../db";
import { errorResponse } from "./userRouter";
import GoogleBook from "../models/GoogleBook";
import axios from "axios";

const booksRouter = express.Router();

// GET - Retrieve books with a query search
booksRouter.get("/", async (req, res) => {
  const query: string = req.query.search as string;

  if (!query) {
    return res.status(400).send("No search query provided");
  }

  try {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        query
      )}`
    );
    res.status(200).json(response.data.items);
  } catch (error) {
    console.error(`Error: ${error}`);
    errorResponse(error, res);
  }
});

// GET - Get details of a specific book
booksRouter.get("/:bookId", async (req, res) => {
  // Code to retrieve a specific book's details from a free book API
});

export default booksRouter;
