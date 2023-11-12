import { MongoClient } from "mongodb";
import dotenv from "dotenv";

// Execute the config function from dotenv to load environment variables
dotenv.config();

// Retrieve the MongoDB connection URI from environment variables or use an empty string if not defined
const uri: string = process.env.URI || "";

// Create a new MongoClient instance with the MongoDB URI
const client: MongoClient = new MongoClient(uri);

export const getClient = async () => {
  // Connect to the MongoDB client, awaiting the connection to be established
  await client.connect();
  return client;
};
