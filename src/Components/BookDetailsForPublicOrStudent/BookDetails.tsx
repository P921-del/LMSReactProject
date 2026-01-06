import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../Constants";
import { getCookie } from "../../Fuctions";
import { toast } from "react-toastify";
import { IoPerson } from "react-icons/io5";
import { FaCaretUp } from "react-icons/fa";
import Swal from "sweetalert2";
type Props = {
  bookId: string | undefined;
};
export interface GetBookDto {
  id: string;
  bookCover: Uint8Array;
  bookTitle: string;
  bookCost: number;
  description: string;
  actualStock: number;
}
interface LeaveCommentDto {
  studentToken: string;
  bookId: string;
  comment: string;
}
interface GetReportDto {
  id: string;
  createdAt: string;
  userId: string;
  userFullName: string;
  userComment: string;
}
export default function BookDetails({ bookId }: Props) {
  const [book, setBook] = useState<GetBookDto>({
    id: "",
    bookCover: new Uint8Array(),
    bookTitle: "",
    bookCost: 0,
    description: "",
    actualStock: 0,
  });
  const [commentTextAreaValue, setCommentTextAreaValue] = useState<string>("");
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/Book/public/books/${bookId !== undefined ? bookId : null}`,
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
          setBook(data);
        } else {
          console.error("Error Finding book");
        }
      } catch (error) {
        console.error("Error Finding book:", error);
      }
    }
    fetchData();
  }, []);
  const [comments, setComments] = useState<GetReportDto[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/ReportBook/reports/${bookId !== undefined ? bookId : ""}?studentToken=${getCookie("LMS")}`,
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
          setComments(data);
        } else {
          console.error("Error Finding book");
        }
      } catch (error) {
        console.error("Error Finding book:", error);
      }
    }
    fetchData();
  }, []);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/Auth/me/${getCookie("LMS")}`,
          {
            method: "POST",
          }
        );
        if (!response.ok) {
          throw new Error("API request failed");
        }
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setUserId(data.userId);
        } else {
          console.error("Error Finding book");
        }
      } catch (error) {
        console.error("Error Finding book:", error);
      }
    }
    fetchData();
  }, []);
  async function handleAddCommentButton() {
    try {
      const leaveCommentDto: LeaveCommentDto = {
        studentToken: getCookie("LMS"),
        bookId: book.id,
        comment: commentTextAreaValue,
      };
      const response = await fetch(`${API_BASE_URL}/ReportBook/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leaveCommentDto),
      });

      if (!response.ok) {
        toast.error("Message is not Sent!", {
          position: "top-right",
        });
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const data = await response.json();
        toast.success("Message Sent!", {
          position: "top-right",
        });
        console.log("Success", data.message);
        setCommentTextAreaValue("");
        window.location.reload();
      }
    } catch (error) {
      toast.error("Message is not Sent!", {
        position: "top-right",
      });
      console.error("Error", error);
    }
  }

  async function DeleteComment(commentId: string) {
    try {
      Swal.fire({
        title: "Are you sure you delete this comment?",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancellation",
        icon: "warning",
        confirmButtonColor: "#ed1014",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const studentToken = getCookie("LMS");
          const response = await fetch(
            `${API_BASE_URL}/ReportBook/delete/${commentId}?studentToken=${studentToken}`,
            {
              method: "DELETE",
            }
          );

          if (!response.ok) {
            Swal.fire({
              title: "Error Message",
              text: "Delete operation failed!",
              icon: "error",
              confirmButtonColor: "#1c398e",
            });
            throw new Error(`HTTP error! status: ${response.status}`);
          } else {
            const data = await response.json();
            Swal.fire({
              title: "Congratulations",
              text: "This comment has been successfully deleted!",
              icon: "success",
              confirmButtonColor: "#1c398e",
            });
            console.log(data.message);
            try {
              const secondResponse = await fetch(
                `${API_BASE_URL}/ReportBook/reports?studentToken=${studentToken}`
              );
              if (!secondResponse.ok) {
                toast.error("Failed to retrieve comments' data!", {
                  position: "top-right",
                });
                throw new Error(`HTTP error! status: ${secondResponse.status}`);
              } else {
                const data = await secondResponse.json();
                setComments(data);
                console.log("Data fetched:", data);
                window.scrollTo(0, 0);
              }
            } catch (error) {
              toast.error("Failed to retrieve comments' data!", {
                position: "top-right",
              });
              console.error("Failed to retrieve comments' data!", error);
            }
          }
        }
      });
    } catch (error) {
      Swal.fire({
        title: "رسالة خطأ",
        text: "عملية الحذف فشلت!.",
        icon: "error",
        confirmButtonColor: "#013d81",
      });
      console.error("Error", error);
    }
  }
  async function UpdateComment(
    commentId: string,
    bookId: string,
    comment: string
  ) {
    try {
      const studentToken = getCookie("LMS");
      const response = await fetch(
        `${API_BASE_URL}/ReportBook/update/${commentId}?studentToken=${studentToken}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([
            { op: "replace", path: "/studentToken", value: studentToken },
            { op: "replace", path: "/bookId", value: bookId },
            { op: "replace", path: "/comment", value: comment },
          ]),
        }
      );

      if (!response.ok) {
        Swal.fire({
          title: "Error Message",
          text: "Update operation failed!",
          icon: "error",
          confirmButtonColor: "#1c398e",
        });
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const data = await response.json();
        Swal.fire({
          title: "Congratulations",
          text: "This comment has been successfully updated!",
          icon: "success",
          confirmButtonColor: "#1c398e",
        });
        console.log(data.message);
      }
    } catch (error) {
      Swal.fire({
        title: "رسالة خطأ",
        text: "عملية التعديل فشلت!.",
        icon: "error",
        confirmButtonColor: "#013d81",
      });
      console.error("Error", error);
    }
  }

  return (
    <div>
      {" "}
      <div className="w-full mb-4 flex justify-center items-center pt-5">
        {" "}
        <h3 className="text-black font-notoSansTeluguBold text-2xl space-x-0.5">
          View Details{" "}
          <h3 style={{ display: "inline" }} className="text-blue-600">
            For Item
          </h3>{" "}
          Here.
        </h3>
      </div>
      <div className="flex flex-row gap-x-[5%] px-[10%]">
        <img
          src={"data:image/png;base64," + book.bookCover}
          className="rounded-md w-[40%] h-72"
        />
        <div className="pt-8">
          <h3 className="text-left font-notoSansTeluguBold text-lg text-black mb-5">
            {book.bookTitle}
          </h3>
          <p className="font-notoSansTeluguBold text-base text-gray-700 mb-5">
            {book.description}
          </p>
          <div className="w-full pr-[30%] flex flex-row gap-x-[20%] items-start">
            {" "}
            {book.actualStock > 0 && (
              <span className="font-notoSansTeluguBold text-green-600">
                Available
              </span>
            )}
            <span className="font-notoSansTeluguBold text-gray-800 flex flex-col gap-y-4">
              <span>Cost</span>
              <span className="text-blue-700">{book.bookCost}</span>
            </span>
          </div>
        </div>
      </div>
      {getCookie("LMS") !== "" && (
        <div className="mt-5 flex flex-col">
          <div className="w-[80%] mx-auto pb-3 border-b border-gray-300 font-notoSansTeluguBold text-xl mb-6">
            {" "}
            <h3 className="flex flex-row gap-x-0.5">
              <h3 style={{ display: "inline" }}>
                {comments.length > 5 ? 5 : comments.length}
              </h3>
              <h3 style={{ display: "inline" }}>Comments</h3>
            </h3>
          </div>
          <div className="w-[80%] mx-auto h-fit rounded-sm bg-slate-50 flex flex-col gap-y-3.5 px-6 py-5 mb-5">
            <h3 className="font-notoSansTeluguBold text-base text-slate-700 text-left">
              add Comments
            </h3>
            <textarea
              placeholder="enter your comment"
              className="w-full h-32 bg-gray-200 placeholder:font-notoSansTeluguRegular placeholder:text-gray-700 text-slate-800 pl-2 pt-2 rounded-sm"
              value={commentTextAreaValue}
              onChange={(event) => setCommentTextAreaValue(event.target.value)}
            />
            <div className="flex justify-start items-center">
              {" "}
              <button
                onClick={() => handleAddCommentButton()}
                type="button"
                className="bg-blue-700 hover:bg-[#283d51] text-gray-50 space-x-2 px-7 py-2 rounded-md hover:cursor-pointer"
              >
                add Comment
              </button>
            </div>
          </div>
          <div className="w-[80%] mx-auto pb-3 border-b border-gray-300 font-notoSansTeluguBold text-xl mb-6">
            {" "}
            <h3 className="flex flex-row gap-x-1">
              <h3 style={{ display: "inline" }}>User</h3>
              <h3 style={{ display: "inline" }}>Comments</h3>
            </h3>
          </div>
          <div className="w-[80%] mx-auto h-fit rounded-sm bg-slate-50 flex flex-col gap-y-3.5 px-6 py-5 mb-5">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="flex flex-col gap-y-5 items-start"
              >
                {" "}
                <div className="flex flex-row gap-x-2">
                  <div className="rounded-full bg-[#ced2d4] flex justify-center items-center w-14 h-14">
                    <IoPerson className="text-blue-700 text-3xl" />
                  </div>
                  <div className="flex flex-col pt-1">
                    <h3 className="font-notoSansTeluguBold text-sm h-fit m-0 p-0">
                      {comment.userFullName}
                    </h3>
                    <h3 className="text-left text-gray-500">
                      {comment.createdAt.replace(/\//g, "-")}
                    </h3>
                  </div>
                </div>
                <div className="relative -translate-x-[4.5%]">
                  <FaCaretUp className="text-[#eceeeb] text-2xl absolute -top-[27%] left-[7%]" />
                  <div className="w-[90%] mx-auto bg-[#eceeeb] h-fit rounded-sm">
                    <p className="py-2 px-0.5">{comment.userComment}</p>
                  </div>
                </div>
                {comment.userId === userId ? (
                  <div className="w-full flex-col gap-y-3 hidden">
                    <textarea
                      value={comment.userComment}
                      rows={1}
                      onKeyDown={(
                        event: React.KeyboardEvent<HTMLTextAreaElement>
                      ) => {
                        const key = event.key;
                        if (key === "Enter") {
                          event.currentTarget.rows =
                            event.currentTarget.rows + 1;
                        }
                        if (
                          key === "Backspace" &&
                          event.currentTarget.value === "" &&
                          event.currentTarget.rows > 1
                        ) {
                          event.currentTarget.rows =
                            event.currentTarget.rows - 1;
                        }
                      }}
                      className="resize-none w-[66%] ml-[0.2%] mr-auto border-0 border-b-2 focus:border-0 focus:border-b-4 focus:outline-0 focus:ring-0 border-gray-800 h-fit transition-all duration-300"
                    />
                    <div className="flex flex-row gap-x-2.5">
                      <button
                        onClick={(
                          event: React.MouseEvent<HTMLButtonElement>
                        ) => {
                          const showedCommentDiv =
                            event.currentTarget.parentElement?.parentElement
                              ?.parentElement?.children[1];
                          const EditCommentDiv =
                            event.currentTarget.parentElement?.parentElement;
                          if (showedCommentDiv?.classList.contains("hidden")) {
                            showedCommentDiv?.classList.remove("hidden");
                            // showedCommentDiv?.classList.add("flex");
                          }
                          if (!EditCommentDiv?.classList.contains("hidden")) {
                            EditCommentDiv?.classList.remove("flex");
                            EditCommentDiv?.classList.add("hidden");
                          }
                          const textAreaElement = EditCommentDiv
                            ?.children[0] as HTMLTextAreaElement;
                          const paragraphText = showedCommentDiv?.children[1]
                            .children[0] as HTMLParagraphElement;
                          paragraphText.innerText = textAreaElement.value;
                          UpdateComment(
                            comment.id,
                            bookId !== undefined ? bookId : "",
                            comment.userComment
                          );
                        }}
                        className="bg-blue-600 text-white text-sm font-notoSansTeluguLight rounded-full hover:cursor-pointer hover:bg-blue-700 px-5 pt-3 py-2 space-x-0.5 flex justify-center items-center"
                        type="button"
                      >
                        Save
                      </button>
                      <button
                        onClick={(
                          event: React.MouseEvent<HTMLButtonElement>
                        ) => {
                          const showedCommentDiv =
                            event.currentTarget.parentElement?.parentElement
                              ?.parentElement?.children[1];
                          const EditCommentDiv =
                            event.currentTarget.parentElement?.parentElement;
                          if (showedCommentDiv?.classList.contains("hidden")) {
                            showedCommentDiv?.classList.remove("hidden");
                            // showedCommentDiv?.classList.add("flex");
                          }
                          if (!EditCommentDiv?.classList.contains("hidden")) {
                            EditCommentDiv?.classList.remove("flex");
                            EditCommentDiv?.classList.add("hidden");
                          }
                        }}
                        className="bg-blue-600 text-white text-sm font-notoSansTeluguLight rounded-full hover:cursor-pointer hover:bg-blue-700 px-5 pt-3 py-2 space-x-0.5 flex justify-center items-center"
                        type="button"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}
                {comment.userId === userId && (
                  <div className="flex flex-row gap-x-2.5">
                    <button
                      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                        const showedCommentDiv =
                          event.currentTarget.parentElement?.parentElement
                            ?.children[1];
                        const EditCommentDiv =
                          event.currentTarget.parentElement?.parentElement
                            ?.children[2];
                        if (!showedCommentDiv?.classList.contains("hidden")) {
                          // showedCommentDiv?.classList.remove("flex");
                          showedCommentDiv?.classList.add("hidden");
                        }
                        if (EditCommentDiv?.classList.contains("hidden")) {
                          EditCommentDiv?.classList.remove("hidden");
                          EditCommentDiv?.classList.add("flex");
                        }
                      }}
                      className="bg-yellow-500 text-white text-sm font-notoSansTeluguLight rounded-sm hover:cursor-pointer hover:bg-yellow-600 px-5 pt-3 py-2 space-x-0.5 flex justify-center items-center"
                      type="button"
                    >
                      Edit Comment
                    </button>
                    <button
                      onClick={() => DeleteComment(comment.id)}
                      className="bg-red-400 text-white text-sm font-notoSansTeluguLight rounded-sm hover:cursor-pointer hover:bg-red-500 px-5 pt-3 py-2 space-x-0.5 flex justify-center items-center"
                      type="button"
                    >
                      Delete Comment
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
