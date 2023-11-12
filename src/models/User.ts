import { ObjectId } from "mongodb";
import Book from "./Book";

export default interface User {
  _id?: ObjectId;
  username: string;
  password: string;
  registeredAt: Date;
  library: Book[];
  email?: string;
}
