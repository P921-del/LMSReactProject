import React, { useEffect, useState } from "react";
import { PublisherInventoryList } from "../../../Components/Admin/Publisher/PublisherInventoryList";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Constants";

interface GetPublisherDto {
  id: string;
  name: string;
}
export const PublisherInventoryListPage = () => {
  const [allPublishers, setAllPublishers] = useState<GetPublisherDto[]>([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${API_BASE_URL}/Publisher/publishers`);
        if (!response.ok) {
          toast.error("Fetching publishers'data Failed!", {
            position: "top-right",
          });
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          const data = await response.json();
          setAllPublishers(data);
          console.log("Fetched data:", data);
        }
      } catch (error) {
        toast.error("Fetching publishers'data Failed!", {
          position: "top-right",
        });
        console.error("Error fetching publishers'data:", error);
      }
    }
    fetchData();
  }, []);
  if (allPublishers.length === 0) {
    return <p>Loading publishers...</p>;
  } else {
    return (
      <PublisherInventoryList
        allPublishers={allPublishers}
        setAllPublishers={setAllPublishers}
      />
    );
  }
};
