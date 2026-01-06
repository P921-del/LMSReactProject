import React, { useEffect, useRef, /* useRef, */ useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { getCookie, onlyNumbers } from "../../../Fuctions";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "../../../Constants";
import { GetBookDto } from "../../../routes/Admin/Books/BookInventoryListPage";
import { GetMemberDto } from "../../../routes/Admin/Members/MemberInventoryListPage";
type Props = {
  borrowBookId: string;
  memberId: string;
  memberName: string;
  bookId: string;
  bookTitle: string;
  issueDate: string;
  dueDate: string;
};

export const EditBorrowedBook = (props: Props) => {
  const adminToken = getCookie("LMS");
  console.log(adminToken);

  const editBorrowedBookSchema = Yup.object().shape({
    MemberId: Yup.string().required("Required"),
    BookId: Yup.string().required("Required"),
    issueDate: Yup.date()
      .required("Issue date is required!.")
      .max(new Date(), "Issue date cannot be in the future!."),
    dueDate: Yup.date()
      .required("Due date is required!.")
      .min(Yup.ref("issueDate"), "Due date cannot be before the issue date!."),
  });
  const formik = useFormik({
    initialValues: {
      MemberId: props.memberId,
      BookId: props.bookId,
      issueDate: props.issueDate,
      dueDate: props.dueDate,
    },
    enableReinitialize: true,
    validationSchema: editBorrowedBookSchema,
    onSubmit: async () => {
      try {
        const adminToken = getCookie("LMS");

        const formData = new FormData(
          editBorrowedBookFormRef.current !== null
            ? editBorrowedBookFormRef.current
            : undefined
        );
        formData.append("adminToken", adminToken);

        formData.append("borrowBookId", props.borrowBookId);
        formData.append("MemberId", formik.values.MemberId);
        formData.append("BookId", formik.values.BookId);
        formData.append("IssueDate", formik.values.issueDate);
        formData.append("DueDate", formik.values.dueDate);
        console.log(formData);
        const response = await fetch(`${API_BASE_URL}/BorrowBook/update`, {
          method: "PUT",
          body: formData,
        });

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
            text: "BorrowedBook is updated successfully",
            icon: "success",
            confirmButtonColor: "black",
          });
          console.log("Success", data);
          formik.handleReset(() => formik.resetForm());
          window.location.assign("/admin/borrowedbooks");
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

  const [editBorrowedBookHeaderDivWidth, seteditBorrowedBookHeaderDivWidth] =
    useState<number>(window.innerWidth);
  useState<number>(window.innerWidth);
  useEffect(() => {
    function handleResizing() {
      seteditBorrowedBookHeaderDivWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResizing);
    return () => window.removeEventListener("resize", handleResizing);
  }, []);

  const [allMembers, setAllMembers] = useState<GetMemberDto[]>([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/Member/members?adminToken=${getCookie("LMS")}`
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
  const [openAllMembersDropDownList, setOpenAllMembersDropDownList] =
    useState<boolean>(false);

  const [allBooks, setAllBooks] = useState<GetBookDto[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/Book/books?adminToken=${getCookie("LMS")}`
        );
        if (!response.ok) {
          toast.error("Fetching books'data Failed!", {
            position: "top-right",
          });
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          const data = await response.json();
          setAllBooks(data);
          console.log("Fetched data:", data);
        }
      } catch (error) {
        toast.error("Fetching books'data Failed!", {
          position: "top-right",
        });
        console.error("Error fetching books'data:", error);
      }
    }
    fetchData();
  }, []);
  const [openAllBooksDropDownList, setOpenAllBooksDropDownList] =
    useState<boolean>(false);
  const editBorrowedBookFormRef = useRef<HTMLFormElement>(null);
  const MemberEmailInput = useRef<HTMLInputElement>(null);
  const BookTitleInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (
      MemberEmailInput.current !== null &&
      BookTitleInput.current !== null &&
      MemberEmailInput.current.value === "" &&
      BookTitleInput.current.value === ""
    ) {
      MemberEmailInput.current.value = props.memberName;
      BookTitleInput.current.value = props.bookTitle;
    }
  }, [props.bookTitle, props.memberName]);
  return (
    <form
      ref={editBorrowedBookFormRef}
      onSubmit={(event) => {
        event.preventDefault();
        formik.handleSubmit();
      }}
      className="w-[70%] mx-auto lg:mx-0 md:h-[650px] border-l-0 lg:border-l-2 border-l-blue-600"
      style={{
        width: `${editBorrowedBookHeaderDivWidth * 0.7}px`,
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
        Update BorrowedBook
      </h2>
      <div
        className={
          editBorrowedBookHeaderDivWidth <= 1000 ? "h-[1000px]" : "h-[650px]"
        }
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
          <img src="/public/books.png" width={"128px"} height={"128px"} />
        </div>
        <h3
          style={{
            fontSize: "20px",
            textAlign: "center",
            margin: 0,
            marginBottom: "10px",
          }}
        >
          Book Issuing
        </h3>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 grid-rows-1 gap-x-5 bg-transparent h-48 mb-3 md:mb-0 md:h-28">
          <div className="bg-white">
            {/*Start Members Section */}
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
                <span>Members</span>
              </label>
              <div
                onClick={() => setOpenAllMembersDropDownList((prev) => !prev)}
                className="h-12"
                style={{
                  outlineWidth: "1px",
                  outlineOffset: "1px",
                  outlineColor: "#d1d5dc",
                  marginTop: "5px",
                }}
              >
                <input
                  ref={MemberEmailInput}
                  className="pl-[3%] py-2 border-2 border-gray-600 rounded-sm h-full w-full"
                  type="text"
                  autoComplete="nope"
                  placeholder="Member Email"
                />
              </div>
              <AnimatePresence>
                {allMembers.length === 0 ? (
                  <p>Loading members...</p>
                ) : (
                  allMembers.length > 0 &&
                  openAllMembersDropDownList === true && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="z-20 absolute left-0 top-full h-42 w-full overflow-auto border-2 border-gray-600 rounded-sm pl-[5%]"
                    >
                      <div className="flex justify-end items-center pr-[3%] h-8">
                        <IoClose
                          className="text-2xl md:text-2xl text-gray-600 hover:cursor-pointer hover:md:text-3xl"
                          onClick={() => setOpenAllMembersDropDownList(false)}
                        />
                      </div>
                      {allMembers.map((member, index) =>
                        index === 0 ? (
                          <div
                            onClick={(e) => {
                              const searchedInput = e.currentTarget
                                .parentElement?.parentElement?.children[1]
                                .children[0] as HTMLInputElement;
                              searchedInput.value = member.email;
                              formik.setFieldValue("MemberId", member.id);
                              setOpenAllMembersDropDownList(false);
                            }}
                            className="hover:bg-blue-600 hover:cursor-pointer bg-blue-600"
                            key={member.id}
                          >
                            <h3 className="text-[12px] md:text-sm lg:text-md xl:text-lg 2xl:text-xl text-black font-notoSansTeluguRegular text-xl">
                              {member.email}
                            </h3>
                          </div>
                        ) : (
                          <div
                            onClick={(e) => {
                              const searchedInput = e.currentTarget
                                .parentElement?.parentElement?.children[1]
                                .children[0] as HTMLInputElement;
                              searchedInput.value = member.email;
                              formik.setFieldValue("MemberId", member.id);
                              setOpenAllMembersDropDownList(false);
                            }}
                            className="hover:bg-blue-600 hover:cursor-pointer bg-white"
                            key={member.id}
                          >
                            <h3 className="text-[12px] md:text-sm lg:text-md xl:text-lg 2xl:text-xl text-black font-notoSansTeluguRegular text-xl">
                              {member.email}
                            </h3>
                          </div>
                        )
                      )}
                    </motion.div>
                  )
                )}
              </AnimatePresence>
            </div>

            {formik.touched.MemberId && formik.errors.MemberId && (
              <span style={{ color: "red", textAlign: "left" }}>
                {formik.errors.MemberId}
              </span>
            )}
            {/*End Members Section */}
          </div>
          <div className="bg-white">
            {/*Start Books Section */}
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
                <span>Books</span>
              </label>
              <div
                onClick={() => setOpenAllBooksDropDownList((prev) => !prev)}
                className="h-12"
                style={{
                  outlineWidth: "1px",
                  outlineOffset: "1px",
                  outlineColor: "#d1d5dc",
                  marginTop: "5px",
                }}
              >
                <input
                  ref={BookTitleInput}
                  className="pl-[3%] py-2 border-2 border-gray-600 rounded-sm h-full w-full"
                  type="text"
                  autoComplete="nope"
                  placeholder="Book Title"
                />
              </div>
              <AnimatePresence>
                {allBooks.length === 0 ? (
                  <p>Loading books...</p>
                ) : (
                  allBooks.length > 0 &&
                  openAllBooksDropDownList === true && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="z-20 absolute left-0 top-full h-42 w-full overflow-auto border-2 border-gray-600 rounded-sm pl-[5%]"
                    >
                      <div className="flex justify-end items-center pr-[3%] h-8">
                        <IoClose
                          className="text-2xl md:text-2xl text-gray-600 hover:cursor-pointer hover:md:text-3xl"
                          onClick={() => setOpenAllBooksDropDownList(false)}
                        />
                      </div>
                      {allBooks.map((book, index) =>
                        index === 0 ? (
                          <div
                            onClick={(e) => {
                              const searchedInput = e.currentTarget
                                .parentElement?.parentElement?.children[1]
                                .children[0] as HTMLInputElement;
                              searchedInput.value = book.bookTitle;
                              formik.setFieldValue("BookId", book.id);
                              setOpenAllBooksDropDownList(false);
                            }}
                            className="hover:bg-blue-600 hover:cursor-pointer bg-blue-600"
                            key={book.id}
                          >
                            <h3 className="text-[12px] md:text-sm lg:text-md xl:text-lg 2xl:text-xl text-black font-notoSansTeluguRegular text-xl">
                              {book.bookTitle}
                            </h3>
                          </div>
                        ) : (
                          <div
                            onClick={(e) => {
                              const searchedInput = e.currentTarget
                                .parentElement?.parentElement?.children[1]
                                .children[0] as HTMLInputElement;
                              searchedInput.value = book.bookTitle;
                              formik.setFieldValue("BookId", book.id);
                              setOpenAllBooksDropDownList(false);
                            }}
                            className="hover:bg-blue-600 hover:cursor-pointer bg-white"
                            key={book.id}
                          >
                            <h3 className="text-[12px] md:text-sm lg:text-md xl:text-lg 2xl:text-xl text-black font-notoSansTeluguRegular text-xl">
                              {book.bookTitle}
                            </h3>
                          </div>
                        )
                      )}
                    </motion.div>
                  )
                )}
              </AnimatePresence>
            </div>

            {formik.touched.BookId && formik.errors.BookId && (
              <span style={{ color: "red", textAlign: "left" }}>
                {formik.errors.BookId}
              </span>
            )}
            {/*End Books Section */}
          </div>
        </div>
        <div className="w-full grid px-[2%] gap-x-[6%] grid-cols-1 md:grid-cols-2 grid-rows-1 bg-transparent h-48 mb-3 md:mb-0 md:h-28">
          <div className="bg-white">
            {" "}
            <label
              htmlFor="issueDate"
              className="flex justify-start"
              style={{
                fontFamily: "sans-serif",
                fontStyle: "unset",
                fontSize: "16px",
                lineHeight: 1.5 / 1,
              }}
            >
              <span>Issue Date</span>
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
                id="issueDate"
                name="issueDate"
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
                value={formik.values.issueDate}
                onKeyDown={onlyNumbers}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.issueDate && formik.errors.issueDate && (
                <span style={{ color: "red", textAlign: "left" }}>
                  {formik.errors.issueDate}
                </span>
              )}
            </div>
          </div>
          <div className="bg-white">
            {" "}
            <label
              htmlFor="dueDate"
              className="flex justify-start"
              style={{
                fontFamily: "sans-serif",
                fontStyle: "unset",
                fontSize: "16px",
                lineHeight: 1.5 / 1,
              }}
            >
              <span>Due Date</span>
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
                id="dueDate"
                name="dueDate"
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
                value={formik.values.dueDate}
                onKeyDown={onlyNumbers}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.dueDate && formik.errors.dueDate && (
                <span style={{ color: "red", textAlign: "left" }}>
                  {formik.errors.dueDate}
                </span>
              )}
            </div>
          </div>
        </div>
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
            className="bg-blue-600 hover:bg-blue-700 rounded-sm"
            type="submit"
            style={{
              width: "100%",
              height: "50px",
              color: "#edf2f0",
              fontSize: "20px",
              lineHeight: 1.5 / 1,
              textAlign: "center",
              padding: 0,
            }}
          >
            Issue
          </button>
        </div>
      </div>
    </form>
  );
};
