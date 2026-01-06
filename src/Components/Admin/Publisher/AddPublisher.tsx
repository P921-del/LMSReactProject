import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { getCookie } from "../../../Fuctions";
import { API_BASE_URL } from "../../../Constants";
const ValidatePublisherName = async (value: string) => {
  try {
    const adminToken = getCookie("LMS");
    const response = await fetch(
      `${API_BASE_URL}/Publisher/CheckPublisherNameUniqueForCreate?adminToken=${adminToken}&publisher_name=${value}`,
      {
        method: "GET",
      }
    );
    if (!response.ok) {
      throw new Error("API request failed");
    }
    if (response.status === 200) {
      return true; // Publishername is unique
    } else {
      return false; // Publishername is not unique
    }
  } catch (error) {
    console.error("Error checking publisher name uniqueness:", error);
    return false; // Default to not unique
  }
};
const AddPublisherSchema = Yup.object().shape({
  PublisherName: Yup.string()
    .min(10, "Too Short!")
    .max(70, "Too Long!")
    .required("Required")
    .test(
      "PublisherName",
      "Publisher Name is already exists!",
      ValidatePublisherName
    ),
});

interface AddPublisherDto {
  adminToken: string;
  Name: string;
}
export const AddPublisher = () => {
  const formik = useFormik({
    initialValues: {
      PublisherName: "",
    },
    validationSchema: AddPublisherSchema,
    onSubmit: async () => {
      try {
        const adminToken = getCookie("LMS");
        const addPublisherDto: AddPublisherDto = {
          adminToken,
          Name: formik.values.PublisherName,
        };
        const response = await fetch(`${API_BASE_URL}/Publisher/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(addPublisherDto),
        });

        if (!response.ok) {
          Swal.fire({
            title: "Error Message",
            text: "Creation is failed!.",
            icon: "error",
            confirmButtonColor: "#013d81",
          });
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          const data = await response.text();
          Swal.fire({
            title: "Success Message",
            text: "Publisher is added successfully",
            icon: "success",
            confirmButtonColor: "black",
          });
          console.log("Success", data);
          formik.handleReset(() => formik.resetForm());
        }
      } catch (error) {
        Swal.fire({
          title: "Error Messaage",
          text: "Creation is failed!.",
          icon: "error",
          confirmButtonColor: "#013d81",
        });
        console.error("Error", error);
      }
    },
  });
  const [addPublisherHeaderDivWidth, setAddPublisherHeaderDivWidth] =
    useState<number>(window.innerWidth);
  useEffect(() => {
    function handleResizing() {
      setAddPublisherHeaderDivWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResizing);
    return () => window.removeEventListener("resize", handleResizing);
  }, []);
  const addPublisherForm = useRef<HTMLFormElement>(null);
  return (
    <form
      ref={addPublisherForm}
      onSubmit={formik.handleSubmit}
      className="pb-8 pt-2"
    >
      <div
        className="flex justify-center items-center"
        style={{ width: `${addPublisherHeaderDivWidth * 0.7}px` }}
      >
        {" "}
        <h2 className="text-black text-4xl">Add Publisher</h2>
      </div>
      <div className="mt-10 flex flex-col ml-[10%] gap-y-1.5">
        <input
          className="h-11 w-96 py-2 pr-2.5 pl-3 grow text-lg text-black placeholder:text-gray-500 rounded-xl border-none shadow-xl shadow-gray-400 focus:bg-[#e6f0fd] focus:border-none"
          name="PublisherName"
          id="PublisherName"
          value={formik.values.PublisherName}
          type="text"
          placeholder="Publisher Name"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.PublisherName && formik.errors.PublisherName && (
          <span style={{ color: "red", textAlign: "left" }}>
            {formik.errors.PublisherName}
          </span>
        )}
      </div>
      <div className="w-full h-14 flex justify-start ml-[10%] mt-10 items-center">
        <div
          onClick={() => formik.handleSubmit()}
          className="w-[17%] h-full bg-[#1e9545] hover:bg-[#187736] hover:cursor-pointer text-gray-50 text-xl lg:text-2xl rounded-md flex justify-center items-center font-sans"
        >
          <h3>Add</h3>
        </div>
      </div>
    </form>
  );
};
