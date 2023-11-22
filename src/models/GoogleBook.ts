import { ObjectId } from "mongodb";

export default interface GoogleBook {
  _id?: ObjectId;
  kind: string; // Type of item (e.g., 'books#volume')
  id: string; // Unique identifier for the book within the Google Books API
  etag: string; // ETag of the item for caching purposes
  selfLink: string; // URL to this specific book's resource

  // Detailed information about the book
  volumeInfo: {
    title: string;
    authors: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    industryIdentifiers: Array<{
      // Array of industry standard identifiers like ISBN
      type: string; // Type of identifier (e.g., 'ISBN_13', 'ISBN_10')
      identifier: string; // The identifier value
    }>;
    pageCount?: number;
    categories?: string[]; // Genres of the book (optional)
    averageRating?: number; // Average rating from Google Books users
    imageLinks?: {
      smallThumbnail?: string; // Link to a small thumbnail image of the book cover
      thumbnail?: string; // Link to a larger thumbnail image of the book cover
    };
  };
  // Information about the sale and availability of the book
  saleInfo: {
    country: string; // Country in which the sale information is applicable
    saleability: string; // Saleability status of the book (e.g., 'FOR_SALE', 'NOT_FOR_SALE')
    isEbook: boolean; // Indicates if the book is available in eBook format
  };
  accessInfo: {
    country: string; // Country in which the access information is applicable
    viewability: string; // Level of access available (e.g., 'PARTIAL', 'ALL_PAGES')
    epub: {
      isAvailable: boolean; // Indicates if an ePub version is available
    };
    pdf: {
      isAvailable: boolean; // Indicates if a PDF version is available
    };
    webReaderLink: string; // Link to read the book on Google's web reader
  };
}
