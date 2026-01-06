import React, { useEffect, useState } from "react";
import { BookInventoryList } from "../../../Components/Admin/Book/BookInventoryList";
import { toast } from "react-toastify";
import { getCookie } from "../../../Fuctions";
import { API_BASE_URL } from "../../../Constants";
export interface GetAuthorDto {
  id: string;
  name: string;
}
export interface GetPublisherDto {
  id: string;
  name: string;
}
export interface GetBookDto {
  id: string;
  bookCover: Uint8Array;
  bookTitle: string;
  language: string;
  edition: string;
  genre: string;
  bookCost: string;
  noOfPages: number;
  actualStock: number;
  publishDate: string;
  currentStock: number;
  bookBorrowCost: string;
  bookDescription: string;
  authors: GetAuthorDto[];
  publishers: GetPublisherDto[];
}
export const BookInventoryListPage = () => {
  const [allBooks, setAllBooks] = useState<GetBookDto[]>([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const adminToken = getCookie("LMS");
        const response = await fetch(
          `${API_BASE_URL}/Book/books?adminToken=${adminToken}`
        );
        if (!response.ok) {
          toast.error("Fetching books'data Failed!", {
            position: "top-right",
          });
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          const data = await response.json();
          setAllBooks(data);
          console.log("Fetched data:", data);
        }
      } catch (error) {
        toast.error("Fetching books'data Failed!", {
          position: "top-right",
        });
        console.error("Error fetching books'data:", error);
      }
    }
    fetchData();
  }, []);

  if (allBooks.length === 0) {
    return (
      <div className="h-96 w-full relative">
        <img
          className="h-full w-full bg-cover"
          src={"/public/no_book_in_library.jpg"}
          alt="no_books_image"
        />
        <h3 className="absolute top-[40%] left-[40%] text-white text-4xl font-openSansRegular">
          No Books Found
        </h3>
      </div>
    );
  } else {
    return <BookInventoryList allBooks={allBooks} setAllBooks={setAllBooks} />;
  }
};
