import React, { useEffect, useState } from "react";
import { EditPublisher } from "../../../Components/Admin/Publisher/EditPublisher";
import { useParams } from "react-router";
import { API_BASE_URL } from "../../../Constants";
export const EditPublisherPage = () => {
  const { publisherId } = useParams();
  const [publisherName, setPublisherName] = useState<string>("");
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/Publisher/publishers/${publisherId}`,
          {
            method: "GET",
          }
        );
        if (!response.ok) {
          throw new Error("API request failed");
        }
        if (response.ok) {
          const data = await response.json();
          setPublisherName(data.name);
        } else {
          console.error("Error Finding publisher");
        }
      } catch (error) {
        console.error("Error Finding publisher:", error);
      }
    }
    fetchData();
  });
  if (publisherName === "") return <p>loading Update Publisher Page</p>;
  else
    return (
      <EditPublisher
        publisherId={publisherId}
        oldPublisherName={publisherName}
      />
    );
};
