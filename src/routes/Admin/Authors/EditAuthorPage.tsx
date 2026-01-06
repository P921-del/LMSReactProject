import React, { useEffect, useState } from "react";
import { EditAuthor } from "../../../Components/Admin/Author/EditAuthor";
import { useParams } from "react-router";
import { API_BASE_URL } from "../../../Constants";
export const EditAuthorPage = () => {
  const { authorId } = useParams();
  const [authorName, setAuthorName] = useState<string>("");
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/Author/authors/${authorId}`,
          {
            method: "GET",
          }
        );
        if (!response.ok) {
          throw new Error("API request failed");
        }
        if (response.ok) {
          const data = await response.json();
          setAuthorName(data.name);
        } else {
          console.error("Error Finding author");
        }
      } catch (error) {
        console.error("Error Finding author:", error);
      }
    }
    fetchData();
  });
  if (authorName === "") return <p>loading Update Author Page</p>;
  else return <EditAuthor authorId={authorId} oldAuthorName={authorName} />;
};
