import express from "express";
import { getClient } from "../db";
import { errorResponse } from "./userRouter";

const booksRouter = express.Router();

// GET - Retrieve all books
booksRouter.get("/", async (req, res) => {
  // Code to retrieve books from the free book API
});

// GET - Get details of a specific book
booksRouter.get("/:bookId", async (req, res) => {
  // Code to retrieve a specific book's details from a free book API
});

export default booksRouter;
