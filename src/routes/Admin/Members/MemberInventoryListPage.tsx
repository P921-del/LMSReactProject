import React, { useEffect, useState } from "react";
import { MemberInventoryList } from "../../../Components/Admin/Member/MemberInventoryList";
import { toast } from "react-toastify";
import { getCookie } from "../../../Fuctions";
import { API_BASE_URL } from "../../../Constants";

export interface GetMemberDto {
  id: string;
  userName: string;
  isActive: boolean;
  dateOfBirth: string;
  state: string;
  contactNumber: string;
  city: string;
  fullName: string;
  email: string;
  pin: string;
  fullAddress: string;
}
export const MemberInventoryListPage = () => {
  const [allMembers, setAllMembers] = useState<GetMemberDto[]>([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const adminToken = getCookie("LMS");
        const response = await fetch(
          `${API_BASE_URL}/Member/members?adminToken=${adminToken}`
        );
        if (!response.ok) {
          toast.error("Fetching members'data Failed!", {
            position: "top-right",
          });
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          const data = await response.json();
          setAllMembers(data);
          console.log("Fetched data:", data);
        }
      } catch (error) {
        toast.error("Fetching members'data Failed!", {
          position: "top-right",
        });
        console.error("Error fetching members'data:", error);
      }
    }
    fetchData();
  }, []);
  if (allMembers.length === 0) {
    return <p>Loading members...</p>;
  } else {
    return (
      <MemberInventoryList
        allMembers={allMembers}
        setAllMembers={setAllMembers}
      />
    );
  }
};
