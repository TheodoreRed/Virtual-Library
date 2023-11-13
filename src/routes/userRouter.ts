import express from "express";
import bcrypt from "bcrypt";
import { getClient } from "../db";
import { ObjectId } from "mongodb";
import User from "../models/User";

const usersRouter = express.Router();

export const errorResponse = (error: any, res: any): void => {
  if (error.code === 11000) {
    // MongoDB duplicate key error code
    return res.status(409).json({ message: "Username already exists" });
  }

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
  const hashedPassword = await bcrypt.hash(newUser.password, 10); // 10 is the salt rounds
  newUser.password = hashedPassword;

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
  delete replacementUser._id;

  // Validation
  if (
    !replacementUser.username ||
    !replacementUser.password ||
    !replacementUser.email
  ) {
    return res
      .status(400)
      .json({ message: "Username, password, and email are required" });
  }

  // Hash password
  if (replacementUser.password) {
    replacementUser.password = await bcrypt.hash(replacementUser.password, 10);
  }

  try {
    const client = await getClient();

    if (replacementUser.username) {
      const existingUser = await client
        .db()
        .collection<User>("users")
        .findOne({ username: replacementUser.username });
      if (existingUser && existingUser._id.toString() !== _id.toString()) {
        return res.status(409).json({ message: "Username already exists" });
      }
    }

    const result = await client
      .db()
      .collection<User>("users")
      .replaceOne({ _id }, replacementUser);

    if (!result.matchedCount) {
      return res.status(404).json({ message: `ID: ${_id} not found!` });
    }

    // Exclude password from the response
    const { password, ...userHidingData } = replacementUser;
    res.status(200).json({
      user: userHidingData,
      message: `Successfully replaced user`,
    });
  } catch (error) {
    errorResponse(error, res);
  }
});

// PATCH to update a user
usersRouter.patch("/:id", async (req, res) => {
  const _id = new ObjectId(req.params.id);
  const updates = req.body;
  delete updates._id;

  // Hash password if it's being updated
  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }

  try {
    const client = await getClient();

    if (updates.username) {
      const existingUser = await client
        .db()
        .collection<User>("users")
        .findOne({ username: updates.username });
      if (existingUser && existingUser._id.toString() !== _id.toString()) {
        return res.status(409).json({ message: "Username already exists" });
      }
    }

    const result = await client
      .db()
      .collection<User>("users")
      .updateOne({ _id }, { $set: updates });

    if (!result.matchedCount) {
      return res
        .status(404)
        .json({ message: `User with ID: ${_id} not found` });
    }

    res.status(200).json({ message: `Successfully updated user` });
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
