import React, { useEffect, useState } from "react";
import { EditBorrowedBook } from "../../../Components/Admin/BorrowedBook/EditBorrowedBook";
import { useParams } from "react-router";
import { getCookie } from "../../../Fuctions";
import { API_BASE_URL } from "../../../Constants";

interface GetBorrowedBookDto {
  borrowBookId: string;
  memberId: string;
  memberName: string;
  bookId: string;
  bookTitle: string;
  issueDate: string;
  dueDate: string;
}

export const EditBorrowedBookPage = () => {
  const { borrowedbookId } = useParams();
  const [borrowedbook, setBorrowedBook] = useState<GetBorrowedBookDto>({
    borrowBookId: "",
    memberId: "",
    memberName: "",
    bookId: "",
    bookTitle: "",
    issueDate: "",
    dueDate: "",
  });
  useEffect(() => {
    async function fetchData() {
      try {
        const adminToken = getCookie("LMS");
        const response = await fetch(
          `${API_BASE_URL}/BorrowBook/borrows/${borrowedbookId !== undefined ? borrowedbookId : null}?adminToken=${adminToken}`,
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
          setBorrowedBook(data);
        } else {
          console.error("Error Finding borrowedbook");
        }
      } catch (error) {
        console.error("Error Finding borrowedbook:", error);
      }
    }
    fetchData();
  });
  if (borrowedbook === null) return <p>loading Update BorrowedBook Page</p>;
  else return <EditBorrowedBook {...borrowedbook} />;
};
