import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { getCookie } from "../../../Fuctions";
import { IoMdArrowRoundBack } from "react-icons/io";
import { API_BASE_URL } from "../../../Constants";

interface EditPublisherDto {
  adminToken: string;
  Id: string | undefined;
  newName: string;
}

type Props = {
  publisherId: string | undefined;
  oldPublisherName: string;
};

export const EditPublisher = (props: Props) => {
  const ValidatePublisherName = async (value: string) => {
    try {
      const adminToken = getCookie("LMS");
      const response = await fetch(
        `${API_BASE_URL}/Publisher/CheckPublisherNameUniqueForUpdate/${props.publisherId}?adminToken=${adminToken}&publisher_name=${value}`,
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
  const editPublisherSchema = Yup.object().shape({
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

  const formik = useFormik({
    initialValues: {
      PublisherName: props.oldPublisherName,
    },
    enableReinitialize: true,
    validationSchema: editPublisherSchema,
    onSubmit: async () => {
      try {
        const adminToken = getCookie("LMS");
        const editPublisherDto: EditPublisherDto = {
          adminToken,
          Id: props.publisherId,
          newName: formik.values.PublisherName,
        };
        const response = await fetch(
          `${API_BASE_URL}/Publisher/update/${props.publisherId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(editPublisherDto),
          }
        );

        if (!response.ok) {
          Swal.fire({
            title: "Error Message",
            text: "Update is failed!.",
            icon: "error",
            confirmButtonColor: "#013d81",
          });
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          const data = await response.text();
          Swal.fire({
            title: "Success Message",
            text: "Publisher is updated successfully",
            icon: "success",
            confirmButtonColor: "black",
          });
          console.log("Success", data);
          formik.handleReset(() => formik.resetForm());
        }
      } catch (error) {
        Swal.fire({
          title: "Error Messaage",
          text: "Update is failed!.",
          icon: "error",
          confirmButtonColor: "#013d81",
        });
        console.error("Error", error);
      }
    },
  });
  const [editPublisherHeaderDivWidth, setEditPublisherHeaderDivWidth] =
    useState<number>(window.innerWidth);
  useEffect(() => {
    function handleResizing() {
      setEditPublisherHeaderDivWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResizing);
    return () => window.removeEventListener("resize", handleResizing);
  }, []);
  const editPublisherForm = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={editPublisherForm}
      onSubmit={formik.handleSubmit}
      className="pb-8 pt-2"
      style={
        editPublisherHeaderDivWidth >= 1023 &&
        editPublisherHeaderDivWidth <= 1400
          ? { width: `${editPublisherHeaderDivWidth * 0.6}px` }
          : { width: `${editPublisherHeaderDivWidth * 0.7}px` }
      }
    >
      <div className="flex justify-center items-center">
        <h2 className="text-black text-4xl">Update Publisher</h2>
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
      <div
        className="w-full h-14 flex justify-between pr-[5%] md:pr-[10%] ml-[10%] mt-10 items-center"
        style={
          editPublisherHeaderDivWidth <= 1023
            ? { width: `${editPublisherHeaderDivWidth}px`, paddingRight: "20%" }
            : editPublisherHeaderDivWidth >= 1023 &&
                editPublisherHeaderDivWidth <= 1400
              ? { width: `${editPublisherHeaderDivWidth * 0.6}px` }
              : { width: `${editPublisherHeaderDivWidth * 0.7}px` }
        }
      >
        <div
          onClick={() => formik.handleSubmit()}
          className="w-1/4 md:w-[17%] 2xl:w-[15%] h-full bg-cyan-400 hover:bg-cyan-500 hover:cursor-pointer text-gray-50 text-xl rounded-md flex justify-center items-center font-sans"
        >
          <h5 className="text-lg md:text-2xl lg:text-3xl 2xl:text-4xl text-white">
            Update
          </h5>
        </div>

        <div
          onClick={() => window.location.assign("/admin/publishers")}
          className="w-[28%] md:w-[20%] lg:w-[25%] xl:w-[20%] 2xl:w-[15%] h-full bg-gray-800 hover:bg-black hover:cursor-pointer text-gray-50 text-xl rounded-md flex justify-center items-center font-sans"
        >
          <div className="flex flex-row justify-between pl-0 md:pl-[3%] lg:pl-0 pr-[30%] md:pr-[15%] lg:pr-[13%] 2xl:pr-[20%] items-center w-[90%] mx-auto">
            <IoMdArrowRoundBack className="text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl text-white" />
            <h5 className="text-lg md:text-2xl lg:text-3xl 2xl:text-4xl text-white mb-1">
              Back
            </h5>
          </div>
        </div>
      </div>
    </form>
  );
};
