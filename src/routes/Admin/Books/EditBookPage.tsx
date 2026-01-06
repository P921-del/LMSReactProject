import React, { useEffect, useState } from "react";
import { EditBook } from "../../../Components/Admin/Book/EditBook";
import { useParams } from "react-router";
import { getCookie } from "../../../Fuctions";
import { GetBookDto } from "./BookInventoryListPage";
import { API_BASE_URL } from "../../../Constants";

export const EditBookPage = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState<GetBookDto>({
    id: "",
    bookCover: new Uint8Array(),
    bookTitle: "",
    language: "",
    edition: "",
    genre: "",
    bookCost: "",
    noOfPages: 0,
    actualStock: 0,
    publishDate: "",
    currentStock: 0,
    bookBorrowCost: "",
    bookDescription: "",
    authors: [],
    publishers: [],
  });
  useEffect(() => {
    async function fetchData() {
      try {
        const adminToken = getCookie("LMS");
        const response = await fetch(
          `${API_BASE_URL}/Book/books/${bookId !== undefined ? bookId : null}?adminToken=${adminToken}`,
          {
            method: "GET",
          }
        );
        if (!response.ok) {
          throw new Error("API request failed");
        }
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setBook(data);
        } else {
          console.error("Error Finding book");
        }
      } catch (error) {
        console.error("Error Finding book:", error);
      }
    }
    fetchData();
  });
  if (book === null) return <p>loading Update Book Page</p>;
  else return <EditBook {...book} />;
};
