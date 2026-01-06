import React, { useEffect, useState } from "react";
import { BorrowedBookInventoryList } from "../../../Components/Admin/BorrowedBook/BorrowedBookInventoryList";
import { toast } from "react-toastify";
import { getCookie } from "../../../Fuctions";
import { API_BASE_URL } from "../../../Constants";
export interface GetBorrowedBookDto {
  borrowBookId: string;
  memberName: string;
  bookTitle: string;
  issueDate: string;
  dueDate: string;
}
export const BorrowedBookInventoryListPage = () => {
  const [allBorrowedBooks, setAllBorrowedBooks] = useState<
    GetBorrowedBookDto[]
  >([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const adminToken = getCookie("LMS");
        const response = await fetch(
          `${API_BASE_URL}/BorrowBook/borrows?adminToken=${adminToken}`
        );
        if (!response.ok) {
          toast.error("Fetching borrowedbooks'data Failed!", {
            position: "top-right",
          });
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          const data = await response.json();
          setAllBorrowedBooks(data);
          console.log("Fetched data:", data);
        }
      } catch (error) {
        toast.error("Fetching borrowedbooks'data Failed!", {
          position: "top-right",
        });
        console.error("Error fetching borrowedbooks'data:", error);
      }
    }
    fetchData();
  }, []);
  useEffect(() => {
    console.log(allBorrowedBooks);
  }, [allBorrowedBooks, setAllBorrowedBooks]);
  if (allBorrowedBooks.length === 0) {
    return (
      <div className="h-96 w-full relative">
        <img
          className="h-full w-full bg-cover"
          src={"/no_borrowedbook_in_library.jpg"}
          alt="no_borrowedbooks_image"
        />
        <h3 className="absolute top-[40%] left-[40%] text-white text-4xl font-openSansRegular">
          No BorrowedBooks Found
        </h3>
      </div>
    );
  } else {
    return (
      <BorrowedBookInventoryList
        allBorrowedBooks={allBorrowedBooks}
        setAllBorrowedBooks={setAllBorrowedBooks}
      />
    );
  }
};
