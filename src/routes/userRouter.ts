import express from "express";
import { getClient } from "../db";
import Book from "../models/Book";
import { ObjectId } from "mongodb";
import User from "../models/User";

const usersRouter = express.Router();

export const errorResponse = (error: any, res: any): void => {
  // Log the error for server-side troubleshooting.
  console.log("FAIL", error);

  // Inform the client that an internal server error occurred.
  res.status(500).json({ message: `Internal Server Error ${error}` });
};

// Endpoints

// GET a user by ID
usersRouter.get("/:id", async (req, res) => {
  const _id = new ObjectId(req.params.id);
  try {
    const client = await getClient();

    // find user with mongo command
    const user = await client.db().collection<User>("users").findOne({ _id });

    if (!user) {
      // if users not found 404
      return res.status(404).send("User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    errorResponse(error, res);
  }
});

// POST to create a new user
usersRouter.post("/", async (req, res) => {
  const newUser: User = req.body;
  try {
    const client = await getClient();
    await client.db().collection<User>("users").insertOne(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    errorResponse(error, res);
  }
});

// PUT to replace a user
usersRouter.put("/:id", async (req, res) => {
  const _id: ObjectId = new ObjectId(req.params.id);
  const replacementUser: User = req.body;
  try {
    const client = await getClient();

    const result = await client
      .db()
      .collection<User>("users")
      .replaceOne({ _id }, replacementUser);

    if (!result.matchedCount) {
      return res.status(404).json({ message: `ID: ${_id} not found!` });
    }
    res
      .status(200)
      .json([replacementUser, { message: `Successfully replaced user` }]);
  } catch (error) {
    errorResponse(error, res);
  }
});

// DELETE to delete user
usersRouter.delete("/:id", async (req, res) => {
  const _id: ObjectId = new ObjectId(req.params.id);

  try {
    const client = await getClient();

    const result = await client
      .db()
      .collection<User>("users")
      .deleteOne({ _id });
    if (!result.deletedCount) {
      res.status(404).json({ message: `ID: ${_id} not found!` });
    }
    res.sendStatus(204);
  } catch (error) {
    errorResponse(error, res);
  }
});

export default usersRouter;
