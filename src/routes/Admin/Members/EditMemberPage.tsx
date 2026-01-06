import React, { useEffect, useState } from "react";
import { EditMember } from "../../../Components/Admin/Member/EditMember";
import { useParams } from "react-router";
import { getCookie } from "../../../Fuctions";
import { API_BASE_URL } from "../../../Constants";

interface GetMemberDto {
  city: string;
  contactNumber: string;
  dateOfBirth: string;
  email: string;
  fullAddress: string;
  fullName: string;
  id: string;
  isActive: boolean;
  pin: string;
  state: string;
  userName: string;
}

export const EditMemberPage = () => {
  const { memberId } = useParams();
  const [member, setMember] = useState<GetMemberDto>({
    city: "",
    contactNumber: "",
    dateOfBirth: "",
    email: "",
    fullAddress: "",
    fullName: "",
    id: "",
    isActive: false,
    pin: "",
    state: "",
    userName: "",
  });
  useEffect(() => {
    async function fetchData() {
      try {
        const adminToken = getCookie("LMS");
        const response = await fetch(
          `${API_BASE_URL}/Member/members/${memberId}?adminToken=${adminToken}`,
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
          setMember(data);
        } else {
          console.error("Error Finding member");
        }
      } catch (error) {
        console.error("Error Finding member:", error);
      }
    }
    fetchData();
  });
  if (member === null) return <p>loading Update Member Page</p>;
  else return <EditMember {...member} />;
};
