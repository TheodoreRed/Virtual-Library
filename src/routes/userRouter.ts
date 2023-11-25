import express from "express";
import { getClient } from "../db";
import User from "../models/User";
import libraryRouter from "./libraryRouter";

const usersRouter = express.Router();

export const errorResponse = (error: any, res: any): void => {
  // Log the error for server-side troubleshooting.
  console.error("Error:", error);

  // Inform the client that an internal server error occurred.
  res.status(500).json({ message: `Internal Server Error` });
};

// GET a user by ID
usersRouter.get("/:uid", async (req, res) => {
  const uid = req.params.uid;
  try {
    const client = await getClient();

    // find user with mongo command
    const user = await client.db().collection<User>("users").findOne({ uid });

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
usersRouter.put("/:uid", async (req, res) => {
  const uid = req.params.uid;
  const replacementUser: User = req.body;

  try {
    const client = await getClient();

    const result = await client
      .db()
      .collection<User>("users")
      .replaceOne({ uid }, replacementUser);

    if (!result.matchedCount) {
      return res
        .status(404)
        .json({ message: `User with ID: ${uid} not found` });
    }
    res.status(200).json({ message: `Successfully replaced user` });
  } catch (error) {
    errorResponse(error, res);
  }
});

// PATCH to update a user
usersRouter.patch("/:uid", async (req, res) => {
  const uid = req.params.uid;
  const updates = req.body;
  delete updates._id;

  try {
    const client = await getClient();

    const result = await client
      .db()
      .collection<User>("users")
      .updateOne({ uid }, { $set: updates });

    if (!result.matchedCount) {
      return res
        .status(404)
        .json({ message: `User with ID: ${uid} not found` });
    }

    res.status(200).json({ message: `Successfully updated user` });
  } catch (error) {
    errorResponse(error, res);
  }
});

// DELETE to delete user
usersRouter.delete("/:uid", async (req, res) => {
  const uid = req.params.uid;

  try {
    const client = await getClient();

    const result = await client
      .db()
      .collection<User>("users")
      .deleteOne({ uid });
    if (!result.deletedCount) {
      return res.status(404).json({ message: `ID: ${uid} not found!` });
    }
    res.sendStatus(204);
  } catch (error) {
    errorResponse(error, res);
  }
});

// Nested libraryRouter
usersRouter.use("/:uid/library", libraryRouter);

export default usersRouter;
