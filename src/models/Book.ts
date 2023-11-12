import { ObjectId } from "mongodb";

export default interface Book {
  _id?: ObjectId;
  title: string;
  author: string;
  publishedDate: Date;
  genre: string;
  coverImageUrl: string;
  quantity: number;
  ISBN?: string;
  summary?: string;
  language?: string;
  pageCount?: number;
  publisher?: string;
  ratings?: number;
}
