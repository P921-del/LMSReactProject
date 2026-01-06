import React, { useEffect, useState } from "react";
import { AuthorInventoryList } from "../../../Components/Admin/Author/AuthorInventoryList";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Constants";

interface GetAuthorDto {
  id: string;
  name: string;
}
export const AuthorInventoryListPage = () => {
  const [allAuthors, setAllAuthors] = useState<GetAuthorDto[]>([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${API_BASE_URL}/Author/authors`);
        if (!response.ok) {
          toast.error("Fetching authors'data Failed!", {
            position: "top-right",
          });
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          const data = await response.json();
          setAllAuthors(data);
          console.log("Fetched data:", data);
        }
      } catch (error) {
        toast.error("Fetching authors'data Failed!", {
          position: "top-right",
        });
        console.error("Error fetching authors'data:", error);
      }
    }
    fetchData();
  }, []);
  if (allAuthors.length === 0) {
    return <p>Loading authors...</p>;
  } else {
    return (
      <AuthorInventoryList
        allAuthors={allAuthors}
        setAllAuthors={setAllAuthors}
      />
    );
  }
};
