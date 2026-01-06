import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { getCookie, onlyNumbers } from "../../../Fuctions";
import { IoIosArrowDown } from "react-icons/io";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { API_BASE_URL } from "../../../Constants";
const MAX_FILE_SIZE = 102400; // 100KB
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];
interface GetAuthorDto {
  id: string;
  name: string;
}
interface GetPublisherDto {
  id: string;
  name: string;
}
// const ValidateBookUserName = async (value: string) => {
//   try {
//     const adminToken = getCookie("LMS");
//     const response = await fetch(
//       `${API_BASE_URL}/Book/CheckBookUserNameUniqueForCreate?adminToken=${adminToken}&book_username=${value}`,
//       {
//         method: "GET",
//       }
//     );
//     if (!response.ok) {
//       throw new Error("API request failed");
//     }
//     if (response.status === 200) {
//       return true; // BookUsername is unique
//     } else {
//       return false; // BookUsername is not unique
//     }
//   } catch (error) {
//     console.error("Error checking book username uniqueness:", error);
//     return false; // Default to not unique
//   }
// };

export const ValidateFileSize = (value: any) => {
  return value && value.size <= MAX_FILE_SIZE;
};
export const ValidateFileExentension = (value: any) => {
  return value && SUPPORTED_FORMATS.includes(value.type);
};
const AddBookSchema = Yup.object().shape({
  bookCover: Yup.mixed()
    .required("Required")
    .test("bookCover", "File is too large!.", ValidateFileSize)
    .test("bookCover", "Unsupported Format!.", ValidateFileExentension),
  bookName: Yup.string()
    .min(10, "Too Short!")
    .max(70, "Too Long!")
    .required("Required"),
  /* .test("userName", "UserName is already exists!", ValidateBookUserName) */
  language: Yup.string().required("Required"),
  edition: Yup.string().required("Required"),
  genre: Yup.string().required("Required"),
  cost: Yup.string().required("Required"),
  borrowCost: Yup.string().required("Required"),
  pages: Yup.string().required("Required"),
  publishDate: Yup.date()
    .required("Publish Date is required!.")
    .max(new Date(), "Date cannot be in the future!."),

  currentStock: Yup.number().required("Required"),
  actualStock: Yup.number().required("Required"),
  description: Yup.string().required("Required"),
  authorIds: Yup.boolean().required("Required"),
  publisherIds: Yup.boolean().required("Required"),
});

export const AddBook = () => {
  const addBookFormRef = useRef<HTMLFormElement>(null);
  const fileBookCoverInputRef = useRef<HTMLInputElement>(null);
  const [selectedAuthors, setSelectedAuthors] = useState<GetAuthorDto[]>([]);
  const [selectedPublishers, setSelectedPublishers] = useState<
    GetPublisherDto[]
  >([]);
  const formik = useFormik({
    initialValues: {
      bookCover: null,
      bookName: "",
      language: "",
      edition: "First",
      genre: "",
      cost: "",
      borrowCost: "",
      publishDate: "2010-08-03",
      pages: "",
      currentStock: "",
      actualStock: "",
      description: "",
      authorIds: true,
      publisherIds: true,
    },
    validationSchema: AddBookSchema,
    onSubmit: async () => {
      try {
        const adminToken = getCookie("LMS");

        const formData = new FormData(
          addBookFormRef.current !== null ? addBookFormRef.current : undefined
        );
        formData.append("adminToken", adminToken);
        formData.append(
          "bookCover",
          formik.values.bookCover !== null ? formik.values.bookCover : ""
        );
        formData.append("bookTitle", formik.values.bookName);
        formData.append("language", formik.values.language);
        formData.append("edition", formik.values.edition);
        formData.append("genre", formik.values.genre);
        formData.append("bookCost", formik.values.cost);
        formData.append("noOfPages", formik.values.pages);
        formData.append("actualStock", formik.values.actualStock);
        formData.append("publishDate", formik.values.publishDate);
        formData.append("currentStock", formik.values.currentStock);
        formData.append("bookBorrowCost", formik.values.borrowCost);
        formData.append("bookDescription", formik.values.description);
        selectedAuthors.forEach((a) => formData.append("authors_Ids", a.id));
        selectedPublishers.forEach((p) =>
          formData.append("publishers_Ids", p.id)
        );
        const response = await fetch(`${API_BASE_URL}/Book/create`, {
          method: "POST",
          body: formData,
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
            text: "Book is added successfully",
            icon: "success",
            confirmButtonColor: "black",
          });
          console.log("Success", data);

          formik.setFieldValue("bookCover", null);
          if (fileBookCoverInputRef.current) {
            fileBookCoverInputRef.current.value = "";
          }
          formik.resetForm();
          setSelectedAuthors([]);
          setSelectedPublishers([]);
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
  const [addBookHeaderDivWidth, setAddBookHeaderDivWidth] = useState<number>(
    window.innerWidth
  );
  useState<number>(window.innerWidth);
  useEffect(() => {
    function handleResizing() {
      setAddBookHeaderDivWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResizing);
    return () => window.removeEventListener("resize", handleResizing);
  }, []);

  const [inputDescription, setinputDescription] =
    useState<string>("No file chosen");
  const [chooseButtonText, setChooseButtonText] =
    useState<string>("Choose file");
  useState<boolean>(false);
  useEffect(() => {
    if (formik.values.bookCover !== null) {
      setinputDescription("File is chosen");
      setChooseButtonText("Rechoose file");
    } else {
      setinputDescription("No file is chosen");
      setChooseButtonText("Choose file");
    }
  }, [formik.values.bookCover]);
  const [allAuthors, setAllAuthors] = useState<GetAuthorDto[]>([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://localhost:5133/api/Author/authors"
        );
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
  const [openAllAuthorsDropDownList, setOpenAllAuthorsDropDownList] =
    useState<boolean>(false);
  const selectedAuthorsRef = useRef<HTMLDivElement>(null);

  const [allPublishers, setAllPublishers] = useState<GetPublisherDto[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://localhost:5133/api/Publisher/publishers"
        );
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
  const [openAllPublishersDropDownList, setOpenAllPublishersDropDownList] =
    useState<boolean>(false);
  const selectedPublishersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formik.isSubmitting && selectedAuthors.length === 0)
      formik.setFieldError("authorIds", "Please, select just one author!.");
  }, [selectedAuthors, formik]);
  useEffect(() => {
    if (formik.isSubmitting && selectedPublishers.length === 0)
      formik.setFieldError(
        "publisherIds",
        "Please, select just one publisher!."
      );
  }, [selectedPublishers, formik]);
  return (
    <form
      ref={addBookFormRef}
      onSubmit={(event) => {
        event.preventDefault();
        formik.handleSubmit();
      }}
      className="w-[70%] mx-auto lg:mx-0 md:h-[650px] border-l-0 lg:border-l-2 border-l-blue-600"
      style={{
        width: `${addBookHeaderDivWidth * 0.7}px`,
        marginBottom: "50px",
      }}
    >
      <h2
        style={{
          fontSize: "20px",
          textAlign: "initial",
          marginTop: "10px",
          marginLeft: "50px",
          marginBottom: "10px",
        }}
      >
        Add Book
      </h2>
      <div
        className={addBookHeaderDivWidth <= 1000 ? "h-[1820px]" : "h-[1200px]"}
        style={{
          width: "98%",
          paddingTop: "20px",
          marginLeft: "auto",
          borderStyle: "solid",
          borderWidth: "medium",
          borderColor: "#c7c9c9ff",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src="/public/ebook.png" width={"128px"} height={"128px"} />
        </div>
        <h3
          style={{
            fontSize: "20px",
            textAlign: "center",
            margin: 0,
            marginBottom: "10px",
          }}
        >
          Book Add
        </h3>
        <div className="z-0 hover:cursor-pointer relative w-[90%] mx-auto bg-transparent flex gap-x-2 items-center h-11 px-4 border-2 border-gray-600 rounded-sm">
          <div
            onClick={(event: React.MouseEvent<HTMLInputElement>) => {
              const inputFile = event.currentTarget.parentElement
                ?.children[3] as HTMLInputElement;
              inputFile.click();
            }}
            className="w-[30%] lg:w-[20%] xl:w-[15%] 2xl:w-[10%] h-[90%] my-auto border-2 border-gray-500 rounded-sm bg-[#ebebeb] hover:cursor-pointer flex justify-center items-center"
          >
            <h3 className="font-notoSansTeluguRegular text-base text-black">
              {chooseButtonText}
            </h3>
          </div>
          <h6>{inputDescription}</h6>
          <div
            onClick={() => {
              formik.setFieldValue("bookCover", null);
              if (fileBookCoverInputRef.current) {
                fileBookCoverInputRef.current.value = "";
              }
            }}
            className="z-10 absolute right-5 w-[14%] lg:w-[9%] xl:w-[8%] 2xl:w-[5%] h-[90%] my-auto border-2 border-gray-500 rounded-sm bg-[#ebebeb] hover:cursor-pointer flex justify-center items-center"
          >
            <h3 className="font-notoSansTeluguRegular text-base text-black">
              Reset
            </h3>
          </div>
          <input
            id="bookCover"
            name="bookCover"
            className=" hidden"
            ref={fileBookCoverInputRef}
            style={{
              width: "20px",
              paddingBlock: "6px",
              paddingRight: "10px",
              paddingLeft: "12px",
              flexGrow: 1,
              fontSize: "16px",
              lineHeight: 1.5 / 1,
              color: "#101828",
              borderRadius: "4px",
              outlineWidth: "1px",
              outlineOffset: "1px",
              outlineColor: "#d1d5dc",
            }}
            type="file"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const file = event.currentTarget.files?.[0];
              if (!file) {
                formik.setFieldError("bookCover", undefined);
                return;
              }
              if (file.size > MAX_FILE_SIZE) {
                formik.setFieldError("bookCover", "File is too large!.");
              }
              if (SUPPORTED_FORMATS.includes(file.type)) {
                formik.setFieldError("bookCover", "Unsupported Format!.");
              }
              formik.setFieldValue(
                "bookCover",
                event.currentTarget.files?.[0] || null
              );
            }}
            onBlur={formik.handleBlur}
          />
        </div>
        <div className="flex justify-start w-[90%] mx-auto">
          {formik.touched.bookCover && formik.errors.bookCover && (
            <span style={{ color: "red" }}>{formik.errors.bookCover}</span>
          )}
        </div>

        <div
          className="w-[98%] md:w-[93%] h-24 mx-auto"
          style={{
            backgroundColor: "transparent",
            display: "flex",
            flexDirection: "column",
            columnGap: "5px",
            paddingInline: "15px",
            marginTop: "15px",
          }}
        >
          <label
            htmlFor="bookName"
            style={{
              textAlign: "left",
              fontFamily: "sans-serif",
              fontStyle: "unset",
              fontSize: "16px",
              lineHeight: 1.5 / 1,
            }}
          >
            Book Name
          </label>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              columnGap: "2px",
              borderRadius: "20px",
              outlineWidth: "1px",
              outlineOffset: "1px",
              outlineColor: "#d1d5dc",
              marginTop: "5px",
            }}
          >
            <input
              id="bookName"
              name="bookName"
              className="userNameInput h-11 border-2 border-gray-500"
              style={{
                minWidth: 0,
                paddingBlock: "6px",
                paddingRight: "10px",
                paddingLeft: "12px",
                flexGrow: 1,
                fontSize: "16px",
                lineHeight: 1.5 / 1,
                color: "#101828",
                borderRadius: "4px",
                outlineWidth: "1px",
                outlineOffset: "1px",
                outlineColor: "#d1d5dc",
              }}
              type="text"
              placeholder="Book Name"
              value={formik.values.bookName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onFocus={(e) => {
                var parent = e.currentTarget.parentElement;
                if (parent != null) {
                  parent.style.outlineWidth = "2px";
                  parent.style.outlineOffset = "2px";
                  parent.style.outlineColor = "#4f39f6";
                }
              }}
            />
            {formik.touched.bookName && formik.errors.bookName && (
              <span style={{ color: "red", textAlign: "left" }}>
                {formik.errors.bookName}
              </span>
            )}
          </div>
        </div>
        <div className="w-[91%] mx-auto grid grid-cols-1 bg-transparent h-[600px] md:h-52 md:gap-y-0 md:grid-cols-3 md:grid-rows-2 gap-x-2 md:mb-0 md:my-10">
          <div className="bg-white flex flex-col gap-y-[3%]">
            <label
              htmlFor="language"
              className="flex justify-start"
              style={{
                fontFamily: "sans-serif",
                fontStyle: "unset",
                fontSize: "16px",
                lineHeight: 1.5 / 1,
              }}
            >
              <span>Language</span>
            </label>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                columnGap: "2px",
                borderRadius: "20px",
                outlineWidth: "1px",
                outlineOffset: "1px",
                outlineColor: "#d1d5dc",
                marginTop: "5px",
              }}
            >
              <select
                id="language"
                name="language"
                value={formik.values.language}
                onChange={formik.handleChange}
                className="h-11 border-2 border-gray-500"
                style={{
                  minWidth: 0,
                  paddingBlock: "6px",
                  paddingRight: "10px",
                  paddingLeft: "12px",
                  flexGrow: 1,
                  fontSize: "16px",
                  lineHeight: 1.5 / 1,
                  color: "#101828",
                  borderRadius: "4px",
                  outlineWidth: "1px",
                  outlineOffset: "1px",
                  outlineColor: "#d1d5dc",
                }}
                onFocus={(e) => {
                  var parent = e.currentTarget.parentElement;
                  if (parent != null) {
                    parent.style.outlineWidth = "2px";
                    parent.style.outlineOffset = "2px";
                    parent.style.outlineColor = "#4f39f6";
                  }
                }}
              >
                <option value="" selected={true}>
                  Select
                </option>
                <option value="arabic">Arabic</option>
                <option value="english">English</option>
              </select>
              {formik.touched.language && formik.errors.language && (
                <span style={{ color: "red", textAlign: "left" }}>
                  {formik.errors.language}
                </span>
              )}
            </div>
          </div>
          <div className="bg-white">
            {" "}
            <label
              htmlFor="edition"
              className="flex justify-start"
              style={{
                fontFamily: "sans-serif",
                fontStyle: "unset",
                fontSize: "16px",
                lineHeight: 1.5 / 1,
              }}
            >
              <span>Edition</span>
            </label>
            <div
              className="w-full"
              style={{
                display: "flex",
                flexDirection: "column",
                columnGap: "2px",
                borderRadius: "20px",
                outlineWidth: "1px",
                outlineOffset: "1px",
                outlineColor: "#d1d5dc",
                marginTop: "5px",
              }}
            >
              <input
                id="edition"
                name="edition"
                className="h-11 border-2 border-gray-500 w-[99%] mr-auto"
                style={{
                  paddingBlock: "6px",
                  paddingRight: "10px",
                  paddingLeft: "12px",
                  flexGrow: 1,
                  fontSize: "16px",
                  lineHeight: 1.5 / 1,
                  color: "#101828",
                  borderRadius: "4px",
                  outlineWidth: "1px",
                  outlineOffset: "1px",
                  outlineColor: "#d1d5dc",
                }}
                type="text"
                placeholder="Edition"
                value={formik.values.edition}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.edition && formik.errors.edition && (
                <span style={{ color: "red", textAlign: "left" }}>
                  {formik.errors.edition}
                </span>
              )}
            </div>
          </div>
          <div className="bg-white md:h-48">
            {" "}
            <label
              htmlFor="genre"
              className="flex justify-start"
              style={{
                fontFamily: "sans-serif",
                fontStyle: "unset",
                fontSize: "16px",
                lineHeight: 1.5 / 1,
              }}
            >
              Genre
            </label>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                columnGap: "2px",
                borderRadius: "20px",
                outlineWidth: "1px",
                outlineOffset: "1px",
                outlineColor: "#d1d5dc",
                marginTop: "5px",
              }}
            >
              <textarea
                id="genre"
                name="genre"
                value={formik.values.genre}
                className="h-50 md:h-36 border-2 border-gray-500"
                style={{
                  minWidth: 0,
                  paddingBlock: "6px",
                  paddingRight: "10px",
                  paddingLeft: "12px",
                  flexGrow: 1,
                  fontSize: "16px",
                  lineHeight: 1.5 / 1,
                  color: "#101828",
                  borderRadius: "4px",
                  outlineWidth: "1px",
                  outlineOffset: "1px",
                  outlineColor: "#d1d5dc",
                }}
                placeholder="Genre"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.genre && formik.errors.genre && (
                <span style={{ color: "red", textAlign: "left" }}>
                  {formik.errors.genre}
                </span>
              )}
            </div>
          </div>
          <div className="bg-white">
            {" "}
            <label
              htmlFor="cost"
              className="flex justify-start"
              style={{
                fontFamily: "sans-serif",
                fontStyle: "unset",
                fontSize: "16px",
                lineHeight: 1.5 / 1,
              }}
            >
              <span>Book Cost</span>
            </label>
            <div
              className="w-full"
              style={{
                display: "flex",
                flexDirection: "column",
                columnGap: "2px",
                borderRadius: "20px",
                outlineWidth: "1px",
                outlineOffset: "1px",
                outlineColor: "#d1d5dc",
                marginTop: "5px",
              }}
            >
              <input
                id="cost"
                name="cost"
                className="h-11 border-2 border-gray-500 w-[99%] mr-auto"
                style={{
                  paddingBlock: "6px",
                  paddingRight: "10px",
                  paddingLeft: "12px",
                  flexGrow: 1,
                  fontSize: "16px",
                  lineHeight: 1.5 / 1,
                  color: "#101828",
                  borderRadius: "4px",
                  outlineWidth: "1px",
                  outlineOffset: "1px",
                  outlineColor: "#d1d5dc",
                }}
                type="text"
                placeholder="Book Cost (per unit)"
                value={formik.values.cost}
                onKeyDown={onlyNumbers}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.cost && formik.errors.cost && (
                <span style={{ color: "red", textAlign: "left" }}>
                  {formik.errors.cost}
                </span>
              )}
            </div>
          </div>
          <div className="bg-white">
            {" "}
            <label
              htmlFor="pages"
              className="flex justify-start"
              style={{
                fontFamily: "sans-serif",
                fontStyle: "unset",
                fontSize: "16px",
                lineHeight: 1.5 / 1,
              }}
            >
              <span>Pages</span>
            </label>
            <div
              className="w-full"
              style={{
                display: "flex",
                flexDirection: "column",
                columnGap: "2px",
                borderRadius: "20px",
                outlineWidth: "1px",
                outlineOffset: "1px",
                outlineColor: "#d1d5dc",
                marginTop: "5px",
              }}
            >
              <input
                id="pages"
                name="pages"
                className="h-11 border-2 border-gray-500 w-[99%] mr-auto"
                style={{
                  paddingBlock: "6px",
                  paddingRight: "10px",
                  paddingLeft: "12px",
                  flexGrow: 1,
                  fontSize: "16px",
                  lineHeight: 1.5 / 1,
                  color: "#101828",
                  borderRadius: "4px",
                  outlineWidth: "1px",
                  outlineOffset: "1px",
                  outlineColor: "#d1d5dc",
                }}
                type="text"
                placeholder="Pages"
                value={formik.values.pages}
                onKeyDown={onlyNumbers}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.pages && formik.errors.pages && (
                <span style={{ color: "red", textAlign: "left" }}>
                  {formik.errors.pages}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="w-[91%] mx-auto grid grid-cols-1 gap-y-2 mb-3 md:mb-0 h-[280px] md:h-28 md:gap-y-0 md:grid-cols-3 grid-rows-1 gap-x-5 bg-transparent">
          <div className="bg-white">
            {" "}
            <label
              htmlFor="actualStock"
              className="flex justify-start"
              style={{
                fontFamily: "sans-serif",
                fontStyle: "unset",
                fontSize: "16px",
                lineHeight: 1.5 / 1,
              }}
            >
              <span>Actual Stock</span>
            </label>
            <div
              className="w-full"
              style={{
                display: "flex",
                flexDirection: "column",
                columnGap: "2px",
                borderRadius: "20px",
                outlineWidth: "1px",
                outlineOffset: "1px",
                outlineColor: "#d1d5dc",
                marginTop: "5px",
              }}
            >
              <input
                id="actualStock"
                name="actualStock"
                className="h-11 border-2 border-gray-500 w-[99%] mr-auto"
                style={{
                  paddingBlock: "6px",
                  paddingRight: "10px",
                  paddingLeft: "12px",
                  flexGrow: 1,
                  fontSize: "16px",
                  lineHeight: 1.5 / 1,
                  color: "#101828",
                  borderRadius: "4px",
                  outlineWidth: "1px",
                  outlineOffset: "1px",
                  outlineColor: "#d1d5dc",
                }}
                type="text"
                placeholder="Actual Stock"
                value={formik.values.actualStock}
                onKeyDown={onlyNumbers}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.actualStock && formik.errors.actualStock && (
                <span style={{ color: "red", textAlign: "left" }}>
                  {formik.errors.actualStock}
                </span>
              )}
            </div>
          </div>
          <div className="bg-white">
            {" "}
            <label
              htmlFor="publishDate"
              className="flex justify-start"
              style={{
                fontFamily: "sans-serif",
                fontStyle: "unset",
                fontSize: "16px",
                lineHeight: 1.5 / 1,
              }}
            >
              <span>Publish Date</span>
            </label>
            <div
              className="w-full"
              style={{
                display: "flex",
                flexDirection: "column",
                columnGap: "2px",
                borderRadius: "20px",
                outlineWidth: "1px",
                outlineOffset: "1px",
                outlineColor: "#d1d5dc",
                marginTop: "5px",
              }}
            >
              <input
                id="publishDate"
                name="publishDate"
                className="h-11 border-2 border-gray-500 w-[99%] mr-auto"
                style={{
                  paddingBlock: "6px",
                  paddingRight: "10px",
                  paddingLeft: "12px",
                  flexGrow: 1,
                  fontSize: "16px",
                  lineHeight: 1.5 / 1,
                  color: "#101828",
                  borderRadius: "4px",
                  outlineWidth: "1px",
                  outlineOffset: "1px",
                  outlineColor: "#d1d5dc",
                }}
                type="date"
                placeholder="Publish Date"
                value={formik.values.publishDate}
                onKeyDown={onlyNumbers}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.publishDate && formik.errors.publishDate && (
                <span style={{ color: "red", textAlign: "left" }}>
                  {formik.errors.publishDate}
                </span>
              )}
            </div>
          </div>
          <div className="bg-white">
            {" "}
            <label
              htmlFor="currentStock"
              className="flex justify-start"
              style={{
                fontFamily: "sans-serif",
                fontStyle: "unset",
                fontSize: "16px",
                lineHeight: 1.5 / 1,
              }}
            >
              <span>Current Stock</span>
            </label>
            <div
              className="w-full"
              style={{
                display: "flex",
                flexDirection: "column",
                columnGap: "2px",
                borderRadius: "20px",
                outlineWidth: "1px",
                outlineOffset: "1px",
                outlineColor: "#d1d5dc",
                marginTop: "5px",
              }}
            >
              <input
                id="currentStock"
                name="currentStock"
                className="h-11 border-2 border-gray-500 w-[99%] mr-auto"
                style={{
                  paddingBlock: "6px",
                  paddingRight: "10px",
                  paddingLeft: "12px",
                  flexGrow: 1,
                  fontSize: "16px",
                  lineHeight: 1.5 / 1,
                  color: "#101828",
                  borderRadius: "4px",
                  outlineWidth: "1px",
                  outlineOffset: "1px",
                  outlineColor: "#d1d5dc",
                }}
                type="text"
                placeholder="Current Stock"
                value={formik.values.currentStock}
                onKeyDown={onlyNumbers}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.currentStock && formik.errors.currentStock && (
                <span style={{ color: "red", textAlign: "left" }}>
                  {formik.errors.currentStock}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="w-[91%] mx-auto grid grid-cols-1 md:grid-cols-2 grid-rows-1 gap-x-5 bg-transparent h-48 mb-3 md:mb-0 md:h-28">
          <div className="bg-white">
            {" "}
            <label
              htmlFor="borrowCost"
              className="flex justify-start"
              style={{
                fontFamily: "sans-serif",
                fontStyle: "unset",
                fontSize: "16px",
                lineHeight: 1.5 / 1,
              }}
            >
              <span>Borrow Cost</span>
            </label>
            <div
              className="w-full"
              style={{
                display: "flex",
                flexDirection: "column",
                columnGap: "2px",
                borderRadius: "20px",
                outlineWidth: "1px",
                outlineOffset: "1px",
                outlineColor: "#d1d5dc",
                marginTop: "5px",
              }}
            >
              <input
                id="borrowCost"
                name="borrowCost"
                className="h-11 border-2 border-gray-500 w-[99%] mr-auto"
                style={{
                  paddingBlock: "6px",
                  paddingRight: "10px",
                  paddingLeft: "12px",
                  flexGrow: 1,
                  fontSize: "16px",
                  lineHeight: 1.5 / 1,
                  color: "#101828",
                  borderRadius: "4px",
                  outlineWidth: "1px",
                  outlineOffset: "1px",
                  outlineColor: "#d1d5dc",
                }}
                type="text"
                placeholder="Borrow Cost"
                value={formik.values.borrowCost}
                onKeyDown={onlyNumbers}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.borrowCost && formik.errors.borrowCost && (
                <span style={{ color: "red", textAlign: "left" }}>
                  {formik.errors.borrowCost}
                </span>
              )}
            </div>
          </div>
          <div className="bg-white">
            {" "}
            <label
              htmlFor="description"
              className="flex justify-start"
              style={{
                fontFamily: "sans-serif",
                fontStyle: "unset",
                fontSize: "16px",
                lineHeight: 1.5 / 1,
              }}
            >
              <span>Book Description</span>
            </label>
            <div
              className="w-full"
              style={{
                display: "flex",
                flexDirection: "column",
                columnGap: "2px",
                borderRadius: "20px",
                outlineWidth: "1px",
                outlineOffset: "1px",
                outlineColor: "#d1d5dc",
                marginTop: "5px",
              }}
            >
              <input
                id="description"
                name="description"
                className="h-11 border-2 border-gray-500 w-[99%] mr-auto"
                style={{
                  paddingBlock: "6px",
                  paddingRight: "10px",
                  paddingLeft: "12px",
                  flexGrow: 1,
                  fontSize: "16px",
                  lineHeight: 1.5 / 1,
                  color: "#101828",
                  borderRadius: "4px",
                  outlineWidth: "1px",
                  outlineOffset: "1px",
                  outlineColor: "#d1d5dc",
                }}
                type="text"
                placeholder="Book Description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.actualStock && formik.errors.actualStock && (
                <span style={{ color: "red", textAlign: "left" }}>
                  {formik.errors.description}
                </span>
              )}
            </div>
          </div>
        </div>
        {/*Start Authors Section */}
        <div className="relative w-[90%] mx-auto bg-white flex flex-col gap-y-[3%] mb-2">
          <label
            className="flex justify-start"
            style={{
              fontFamily: "sans-serif",
              fontStyle: "unset",
              fontSize: "16px",
              lineHeight: 1.5 / 1,
            }}
          >
            <span>Authors</span>
          </label>
          <div
            onClick={() => setOpenAllAuthorsDropDownList((prev) => !prev)}
            className="relative border-2 border-gray-600 rounded-sm min-h-14"
            style={{
              outlineWidth: "1px",
              outlineOffset: "1px",
              outlineColor: "#d1d5dc",
              marginTop: "5px",
            }}
          >
            <div
              className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-3 gap-y-5 pl-2 pt-2 pb-2 w-[90%] md:w-[80%]"
              ref={selectedAuthorsRef}
            >
              {selectedAuthors.map((selectedAuthor) => (
                <div
                  className="h-fit w-fit px-2 py-1 flex flex-row items-center gap-x-1 bg-[#f8f9f9] border-2 border-gray-600 rounded-sm"
                  key={selectedAuthor.id}
                >
                  <h3 className="text-[12px] md:text-sm lg:text-md xl:text-lg 2xl:text-xl flex space-x-2">
                    {selectedAuthor.name}
                  </h3>
                  <IoClose
                    onClick={() => {
                      let filtered = selectedAuthors.filter(
                        (item) => item.id !== selectedAuthor.id
                      );
                      setSelectedAuthors(filtered);
                    }}
                    className="text-[#dcdee1] text-xl lg:text-2xl xl:text-2xl 2xl:text-3xl hover:cursor-pointer"
                  />
                </div>
              ))}
            </div>
            <IoIosArrowDown className="text-black text-2xl absolute right-[3%] top-[25%]" />
          </div>
          {allAuthors.length === 0 ? (
            <p>Loading authors...</p>
          ) : allAuthors.length > 0 && openAllAuthorsDropDownList === true ? (
            <div className="z-20 absolute left-0 top-[100%] h-42 w-full overflow-auto border-2 border-gray-600 rounded-sm pl-[5%]">
              {allAuthors.map((author, index) =>
                index === 0 ? (
                  <div
                    onClick={() => {
                      const findauthor: GetAuthorDto | undefined =
                        selectedAuthors.find((item) => item.id === author.id);
                      if (findauthor === undefined) {
                        setSelectedAuthors([
                          ...selectedAuthors,
                          { id: author.id, name: author.name },
                        ]);
                      }
                    }}
                    className="hover:bg-blue-600 hover:cursor-pointer bg-blue-600"
                    key={author.id}
                  >
                    <h3 className="text-[12px] md:text-sm lg:text-md xl:text-lg 2xl:text-xl text-black font-notoSansTeluguRegular text-xl">
                      {author.name}
                    </h3>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      const findauthor: GetAuthorDto | undefined =
                        selectedAuthors.find((item) => item.id === author.id);
                      if (findauthor === undefined) {
                        setSelectedAuthors([
                          ...selectedAuthors,
                          { id: author.id, name: author.name },
                        ]);
                      }
                    }}
                    className="hover:bg-blue-600 hover:cursor-pointer bg-white"
                    key={author.id}
                  >
                    <h3 className="text-[12px] md:text-sm lg:text-md xl:text-lg 2xl:text-xl text-black font-notoSansTeluguRegular text-xl">
                      {author.name}
                    </h3>
                  </div>
                )
              )}
            </div>
          ) : null}
        </div>

        {formik.touched.authorIds && formik.errors.authorIds && (
          <span style={{ color: "red", textAlign: "left" }}>
            {formik.errors.authorIds}
          </span>
        )}
        {/*End Authors Section */}
        {/*Start Publishers Section */}
        <div className="relative w-[90%] mx-auto bg-white flex flex-col gap-y-[3%] mb-2">
          <label
            className="flex justify-start"
            style={{
              fontFamily: "sans-serif",
              fontStyle: "unset",
              fontSize: "16px",
              lineHeight: 1.5 / 1,
            }}
          >
            <span>Publishers</span>
          </label>
          <div
            onClick={() => setOpenAllPublishersDropDownList((prev) => !prev)}
            className="relative border-2 border-gray-600 rounded-sm min-h-14"
            style={{
              outlineWidth: "1px",
              outlineOffset: "1px",
              outlineColor: "#d1d5dc",
              marginTop: "5px",
            }}
          >
            <div
              className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-3 gap-y-5 pl-2 pt-2 pb-2 w-[90%] md:w-[80%]"
              ref={selectedPublishersRef}
            >
              {selectedPublishers.map((selectedPublisher) => (
                <div
                  className="h-fit w-fit px-2 py-1 flex flex-row items-center gap-x-1 bg-[#f8f9f9] border-2 border-gray-600 rounded-sm"
                  key={selectedPublisher.id}
                >
                  <h3 className="text-[12px] md:text-sm lg:text-md xl:text-lg 2xl:text-xl flex space-x-2">
                    {selectedPublisher.name}
                  </h3>
                  <IoClose
                    onClick={() => {
                      let filtered = selectedPublishers.filter(
                        (item) => item.id !== selectedPublisher.id
                      );
                      setSelectedPublishers(filtered);
                    }}
                    className="text-[#dcdee1] text-xl lg:text-2xl xl:text-2xl 2xl:text-3xl hover:cursor-pointer"
                  />
                </div>
              ))}
            </div>
            <IoIosArrowDown className="text-black text-2xl absolute right-[3%] top-[25%]" />
          </div>
          {allPublishers.length === 0 ? (
            <p>Loading Publishers...</p>
          ) : allPublishers.length > 0 &&
            openAllPublishersDropDownList === true ? (
            <div className="absolute left-0 top-[100%] h-42 w-full overflow-auto border-2 border-gray-600 rounded-sm pl-[5%]">
              {allPublishers.map((publisher, index) =>
                index === 0 ? (
                  <div
                    onClick={() => {
                      const findPublisher: GetPublisherDto | undefined =
                        selectedPublishers.find(
                          (item) => item.id === publisher.id
                        );
                      if (findPublisher === undefined) {
                        setSelectedPublishers([
                          ...selectedPublishers,
                          { id: publisher.id, name: publisher.name },
                        ]);
                      }
                    }}
                    className="hover:bg-blue-600 hover:cursor-pointer bg-blue-600"
                    key={publisher.id}
                  >
                    <h3 className="text-[12px] md:text-sm lg:text-md xl:text-lg 2xl:text-xl text-black font-notoSansTeluguRegular text-xl">
                      {publisher.name}
                    </h3>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      const findPublisher: GetPublisherDto | undefined =
                        selectedPublishers.find(
                          (item) => item.id === publisher.id
                        );
                      if (findPublisher === undefined) {
                        setSelectedPublishers([
                          ...selectedPublishers,
                          { id: publisher.id, name: publisher.name },
                        ]);
                      }
                    }}
                    className="hover:bg-blue-600 hover:cursor-pointer bg-white"
                    key={publisher.id}
                  >
                    <h3 className="text-[12px] md:text-sm lg:text-md xl:text-lg 2xl:text-xl text-black font-notoSansTeluguRegular text-xl">
                      {publisher.name}
                    </h3>
                  </div>
                )
              )}
            </div>
          ) : null}
        </div>

        {formik.touched.publisherIds && formik.errors.publisherIds && (
          <span style={{ color: "red", textAlign: "left" }}>
            {formik.errors.publisherIds}
          </span>
        )}
        {/*End Publishers Section */}

        <div
          className="w-full mt-5 md:w-[30%] xl:w-[25%] 2xl:w-[20%] md:ml-[4%]"
          style={{
            backgroundColor: "transparent",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            columnGap: "5px",
            height: "50px",
            paddingInline: "15px",
            marginBottom: "5px",
          }}
        >
          <button
            type="submit"
            style={{
              width: "100%",
              height: "50px",
              color: "#edf2f0",
              fontSize: "20px",
              lineHeight: 1.5 / 1,
              backgroundColor: "#177b36",
              textAlign: "center",
              padding: 0,
            }}
          >
            Add
          </button>
        </div>
      </div>
    </form>
  );
};

/*

   <form
      ref={addBookForm}
      onSubmit={formik.handleSubmit}
      className="pb-8 pt-2"
    >
      <div
        className="flex justify-center items-center"
        style={{ width: `${addBookHeaderDivWidth * 0.7}px` }}
      >
        {" "}
        <h2 className="text-blue-400 text-4xl">ADD AUTHOR</h2>
      </div>
      <div className="mt-10 flex flex-col ml-[10%] gap-y-1.5">
        <input
          className="h-11 w-96 py-2 pr-2.5 pl-3 grow text-lg text-black placeholder:text-gray-500 rounded-xl border-none shadow-xl shadow-gray-400 focus:bg-[#e6f0fd] focus:border-none"
          name="BookName"
          id="BookName"
          value={formik.values.BookName}
          type="text"
          placeholder="Book Name"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.BookName && formik.errors.BookName && (
          <span style={{ color: "red", textAlign: "left" }}>
            {formik.errors.BookName}
          </span>
        )}
      </div>
      <div className="w-full h-14 flex justify-start ml-[10%] mt-10 items-center">
        <div
          onClick={() => formik.handleSubmit()}
          className="w-[17%] h-full bg-[#1e9545] hover:bg-[#187736] hover:cursor-pointer text-gray-50 text-xl rounded-md flex justify-center items-center font-sans"
        >
          <span>Submit</span>
        </div>
      </div>
    </form>

*/
