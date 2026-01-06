import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { HiDotsHorizontal } from "react-icons/hi";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router";
import { getCookie } from "../../../Fuctions";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { GetBookDto } from "../../../routes/Admin/Books/BookInventoryListPage";
import { API_BASE_URL } from "../../../Constants";

interface Props {
  allBooks: GetBookDto[];
  setAllBooks: React.Dispatch<React.SetStateAction<GetBookDto[]>>;
}

export const BookInventoryList = (mainProps: Props) => {
  const [searchOverAllBooksTextOnInput, setSearchOverAllBooksTextOnInput] =
    useState<string>("");
  interface SubBookListProps {
    currentItems: GetBookDto[];
  }

  interface PaginatedItemsProps {
    itemsPerPage: number;
  }

  useEffect(() => {
    async function SearchOverAllBooksUsingBookTitleAsync(value: string) {
      try {
        const adminToken = getCookie("LMS");
        const response = await fetch(
          `${API_BASE_URL}/Book/books/admin/title?adminToken=${adminToken}&title=${value}`,
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
          mainProps.setAllBooks(data);
        } else {
          console.error("Error Finding book");
        }
      } catch (error) {
        console.error("Error Finding book:", error);
      }
    }
    SearchOverAllBooksUsingBookTitleAsync(searchOverAllBooksTextOnInput);
  }, [searchOverAllBooksTextOnInput]);

  const SubBookList = (props: SubBookListProps) => {
    const [subBookListHeaderDivWidth, setSubBookListHeaderDivWidth] =
      useState<number>(window.innerWidth);
    const [WindowWidth, setWindowWidth] = useState<number>(window.innerWidth);
    useEffect(() => {
      function handleResizing() {
        setSubBookListHeaderDivWidth(window.innerWidth);
        setWindowWidth(window.innerWidth);
      }
      window.addEventListener("resize", handleResizing);
      return () => window.removeEventListener("resize", handleResizing);
    }, []);
    console.log(props.currentItems);
    const navigate = useNavigate();

    async function DeleteBook(bookId: string) {
      try {
        Swal.fire({
          title: "Do you want to delete this book?",
          showCancelButton: true,
          confirmButtonText: "Delete",
          icon: "warning",
          confirmButtonColor: "#ed1014",
        }).then(async (result) => {
          if (result.isConfirmed) {
            const adminToken = getCookie("LMS");
            const response = await fetch(
              `${API_BASE_URL}/Book/delete/${bookId}?adminToken=${adminToken}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (!response.ok) {
              Swal.fire({
                title: "Error Message",
                text: "Delete is failed!.",
                icon: "error",
                confirmButtonColor: "#013d81",
              });
              throw new Error(`HTTP error! status: ${response.status}`);
            } else {
              const data = await response.text();
              Swal.fire({
                title: "Success Message",
                text: "Book is deleted successfully",
                icon: "success",
                confirmButtonColor: "black",
              });
              try {
                const secondResponse = await fetch(
                  `${API_BASE_URL}/Book/books`
                );
                if (!secondResponse.ok) {
                  toast.error("Fetching books'data Failed!", {
                    position: "top-right",
                  });
                  throw new Error(
                    `HTTP error! status: ${secondResponse.status}`
                  );
                } else {
                  const data = await secondResponse.json();
                  mainProps.setAllBooks(data);
                  console.log("Fetched data:", data);
                }
              } catch (error) {
                toast.error("Fetching books'data Failed!", {
                  position: "top-right",
                });
                console.error("Error fetching books'data:", error);
              }
              console.log("Success", data);
            }
          }
        });
      } catch (error) {
        Swal.fire({
          title: "Error Messaage",
          text: "Delete is failed!.",
          icon: "error",
          confirmButtonColor: "#013d81",
        });
        console.error("Error", error);
      }
    }
    return (
      <div
        style={
          WindowWidth >= 1000 && WindowWidth <= 1400
            ? { width: `${WindowWidth * 0.7}px` }
            : WindowWidth > 1400 && WindowWidth <= 2048
              ? { width: `${WindowWidth * 0.8}px` }
              : { width: `${subBookListHeaderDivWidth}px` }
        }
      >
        {WindowWidth >= 1024 ? (
          <div className="w-[95%] mx-auto mt-10 flex flex-col items-center mb-8">
            <div className="w-full mb-4 border-b-2 border-b-gray-300 flex justify-start">
              {" "}
              <h2 className="font-sans font-semibold text-3xl text-black">
                Book List
              </h2>
            </div>

            <div className="w-[80%] h-12 mx-auto bg-[#f6f8fa] rounded-xl flex justify-start items-center">
              <div
                tabIndex={0}
                className="flex flex-row justify-start items-center h-full w-[5%] bg-transparent rounded-tl-xl rounded-bl-xl hover:cursor-pointer"
                onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                  const searchInput = event.currentTarget.parentElement
                    ?.children[1] as HTMLInputElement;
                  searchInput.focus();
                }}
              >
                <IoSearch className="text-3xl ml-[3px]" />
              </div>
              <input
                value={searchOverAllBooksTextOnInput}
                className="h-full w-[95%] pl-[1%]"
                placeholder="Search by Title"
                onChange={(event) => {
                  setSearchOverAllBooksTextOnInput(event.currentTarget.value);
                }}
                onKeyUp={(event) => {
                  if (event.key === "Enter") {
                    setSearchOverAllBooksTextOnInput(event.currentTarget.value);
                  }
                }}
              />
            </div>
          </div>
        ) : (
          <div className="mt-10 flex justify-start pl-[4%] items-center">
            <h3 className="mb-4 font-notoSansTeluguBold text-5xl text-black">
              Books
            </h3>
          </div>
        )}
        {WindowWidth >= 1024 ? null : (
          <div className="mt-10 mb-8 w-[80%] h-12 mx-auto bg-[#f6f8fa] rounded-xl flex justify-start items-center">
            <div
              tabIndex={0}
              className="flex flex-row justify-start items-center h-full w-[5%] bg-transparent rounded-tl-xl rounded-bl-xl hover:cursor-pointer"
              onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                const searchInput = event.currentTarget.parentElement
                  ?.children[1] as HTMLInputElement;
                searchInput.focus();
              }}
            >
              <IoSearch className="text-3xl ml-[3px]" />
            </div>
            <input
              className="h-full w-[95%] pl-[3%]"
              placeholder="Search by Email"
              onKeyUp={(event) => {
                if (event.key === "Enter") {
                  setSearchOverAllBooksTextOnInput(event.currentTarget.value);
                }
              }}
            />
          </div>
        )}
        <div className="w-[95%] mx-auto mt-5 ">
          {WindowWidth >= 1024 ? (
            <div className="w-full flex flex-row bg-white h-10 border-l-2 border-l-gray-300 border-t-2 border-t-gray-300">
              <h4 className="w-fit p-5 h-10 flex justify-start items-center border-r-4 border-r-gray-100">
                <span className="font-sans font-bold text-xl text-black">
                  ID
                </span>
              </h4>
              <div className="min-w-[96%] h-10 bg-white border-r-4 border-r-gray-100"></div>
            </div>
          ) : null}
          {WindowWidth < 1024 ? (
            <div className="w-full flex flex-col gap-y-4 shadow-xl">
              {props.currentItems &&
                props.currentItems.map((item: GetBookDto, index: number) => (
                  <div
                    key={item.id}
                    className={
                      "flex flex-col border-2 border-gray-200 rounded-xl pl-[4%] pt-6"
                    }
                  >
                    <div className="bg-white flex justify-start items-center border-r-2 border-r-gray-300 mb-3">
                      <h3 className="font-notoSansTeluguBold text-2xl">
                        {" "}
                        {index + 1}
                      </h3>
                    </div>
                    <div className="w-[95%] bg-white font-notoSansTeluguRegular text-xl flex flex-row justify-start items-center gap-x-[20%]">
                      <h3>{item.bookTitle}</h3>
                      <h3>{item.edition}</h3>
                    </div>
                    <div className="w-[95%] bg-white font-notoSansTeluguRegular text-xl flex flex-row justify-start items-center gap-x-[15%]">
                      <h3>Full Name</h3>
                      <h3>{item.genre}</h3>
                    </div>
                    <div className="w-[95%] bg-white font-notoSansTeluguRegular text-xl flex flex-row justify-start items-center gap-x-[12%]">
                      <h3>Date of Birth</h3>
                      <h3>{item.language}</h3>
                    </div>

                    <div className="w-[95%] bg-white font-notoSansTeluguRegular text-xl flex flex-row justify-start items-center gap-x-[20%]">
                      <h3>Email</h3>
                      <h3>{item.currentStock}</h3>
                    </div>
                    <div className="w-[95%] bg-white font-notoSansTeluguRegular text-xl flex flex-row justify-start items-center gap-x-[22%]">
                      <h3>City</h3>
                      <h3>{item.actualStock}</h3>
                    </div>
                    <div className="w-[95%] bg-white font-notoSansTeluguRegular text-xl flex flex-row justify-start items-center gap-x-[23%]">
                      <h3>Pin</h3>
                      <h3>{item.bookBorrowCost}</h3>
                    </div>
                    <div className="w-[95%] bg-white font-notoSansTeluguRegular text-xl flex flex-row justify-start items-center gap-x-[12%]">
                      <h3>Full Address</h3>
                      <h3>{item.bookCost}</h3>
                    </div>

                    <div className="w-[95%] mt-2 pr-[10%] ml-auto mb-5  flex flex-row justify-end items-center gap-x-[6%] h-12 text-white text-2xl">
                      <span
                        onClick={() =>
                          navigate(`/admin/books/update-book/${item.id}`)
                        }
                        className="w-9 h-9 rounded-sm flex justify-center items-center transition-all duration-300 bg-blue-600 hover:bg-blue-700 hover:w-10 hover:h-10 hover:cursor-pointer pb-1"
                      >
                        <MdEdit className="text-lg" />
                      </span>

                      <span
                        onClick={() => DeleteBook(item.id)}
                        className="w-9 h-9 rounded-sm flex justify-center items-center transition-all duration-300 bg-red-600 hover:bg-red-700 hover:w-10 hover:h-10 hover:cursor-pointer pb-0.5"
                      >
                        <MdDelete className="text-lg" />
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          ) : null}
          {WindowWidth >= 1024 ? (
            <div className="flex flex-col gap-y-0">
              {props.currentItems &&
                props.currentItems.map((item: GetBookDto, index: number) => (
                  <div
                    key={item.id}
                    className={
                      "w-full flex flex-row gap-x-0 h-fit bg-white border-2 border-gray-300"
                    }
                  >
                    <div className="pt-2 w-[5%] bg-white border-r-4 border-r-gray-100">
                      <h3>{index + 1}</h3>
                    </div>
                    <div className="pl-[2%] pt-4 w-[75%] bg-white">
                      <h3 className="font-notoSansTeluguBold text-3xl flex flex-row justify-start mb-2">
                        <span style={{ fontSize: "32px", lineHeight: 1.2 }}>
                          {item.bookTitle}
                        </span>
                      </h3>
                      <p className="font-notoSansTeluguBold text-md flex flex-row justify-start w-fit">
                        <h6 className="text-gray-500 mr-1">Authors:</h6>
                        <h6 className="flex flex-row gap-x-1">
                          {item.authors.map((author, index) => {
                            if (index === item.authors.length - 1) {
                              return <h3 key={author.id}>{author.name}</h3>;
                            } else {
                              return (
                                <h3 key={author.id} className="space-x-1">
                                  {author.name + " "} -
                                </h3>
                              );
                            }
                          })}
                        </h6>
                      </p>
                      <p className="font-notoSansTeluguBold text-md flex flex-row justify-start w-fit mb-2">
                        <h6 className="text-gray-500 mr-1">Genre:</h6>
                        <h6>{item.genre}</h6>
                      </p>
                      <p className="font-notoSansTeluguBold text-md flex flex-row justify-start w-fit mb-2">
                        <h6 className="text-gray-500 mr-1">Language:</h6>
                        <h6>{item.language}</h6>
                      </p>
                      <p className="font-notoSansTeluguBold text-md flex flex-row justify-start w-fit">
                        <h6 className="text-gray-500 mr-1">Publishers:</h6>
                        <h6 className="flex flex-row gap-x-1">
                          {item.publishers.map((publisher, index) => {
                            if (index === item.publishers.length - 1) {
                              return (
                                <h3 key={publisher.id}>{publisher.name}</h3>
                              );
                            } else {
                              return (
                                <h3 key={publisher.id} className="space-x-1">
                                  {publisher.name + " "} -
                                </h3>
                              );
                            }
                          })}
                        </h6>
                      </p>
                      <div className="flex flex-row items-center h-7 mb-4">
                        <p className="font-notoSansTeluguBold text-md flex flex-row justify-start w-fit mb-2">
                          <h6 className="text-gray-500 mr-1">Publish Date:</h6>
                          <h6>{item.publishDate}</h6>
                        </p>
                        <div className="w-[3px] h-7 bg-gray-400 ml-2 mr-1"></div>
                        <p className="font-notoSansTeluguBold text-md flex flex-row justify-start w-fit mb-2">
                          <h6 className="text-gray-500 mr-2">Pages:</h6>
                          <h6>{item.noOfPages}</h6>
                        </p>
                      </div>
                      <p className="font-notoSansTeluguBold text-md flex flex-row justify-start w-fit mb-2">
                        <h6 className="text-gray-500 mr-1">Edition:</h6>
                        <h6>{item.edition}</h6>
                      </p>
                      <div className="flex flex-row items-center h-7 mb-4">
                        <p className="font-notoSansTeluguBold text-md flex flex-row justify-start w-fit mb-2">
                          <h6 className="text-gray-500 mr-1">Book Cost:</h6>
                          <h6>{item.bookCost}</h6>
                        </p>
                        <div className="w-[3px] h-7 bg-gray-400 ml-2 mr-1"></div>
                        <p className="font-notoSansTeluguBold text-md flex flex-row justify-start w-fit mb-2">
                          <h6 className="text-gray-500 mr-2">
                            Borrow Book Cost:
                          </h6>
                          <h6>{item.bookBorrowCost}</h6>
                        </p>
                      </div>
                      <div className="flex flex-row items-center h-7 mb-4">
                        <p className="font-notoSansTeluguBold text-md flex flex-row justify-start w-fit mb-2">
                          <h6 className="text-gray-500 mr-1">Actual Stock:</h6>
                          <h6>{item.actualStock}</h6>
                        </p>
                        <div className="w-[3px] h-7 bg-gray-400 ml-2 mr-1"></div>
                        <p className="font-notoSansTeluguBold text-md flex flex-row justify-start w-fit mb-2">
                          <h6 className="text-gray-500 mr-2">Current Stock:</h6>
                          <h6>{item.currentStock}</h6>
                        </p>
                      </div>
                      <p className="font-notoSansTeluguBold text-md flex flex-row justify-start w-fit mb-2">
                        <h6 className="font-cormorantBoldItalic text-lg text-gray-500 mr-1">
                          Description:
                        </h6>
                        <h6 className="font-cormorantBoldItalic text-lg">
                          {item.bookDescription}
                        </h6>
                      </p>
                    </div>
                    <div className=" bg-transparent w-[20%] pt-5 flex flex-col gap-y-4">
                      <div className="w-[85%] mx-auto h-72">
                        {" "}
                        <img
                          src={"data:image/png;base64," + item.bookCover}
                          className="w-full h-full"
                        />
                      </div>

                      <div className="w-[85%] mx-auto flex flex-row justify-center items-center gap-x-[10%] h-12 text-white text-2xl">
                        <span
                          onClick={() =>
                            navigate(`/admin/books/update-book/${item.id}`)
                          }
                          className="w-[30%] md:w-[20%] 2xl:w-[20%] h-[60%] md:h-1/2 rounded-sm flex justify-center items-center transition-all duration-300 bg-blue-600 hover:bg-blue-700 hover:2xl:w-[22%] hover:h-[65%] hover:cursor-pointer pb-1"
                        >
                          <MdEdit className="text-lg" />
                        </span>

                        <span
                          onClick={() => DeleteBook(item.id)}
                          className="w-[30%] md:w-[20%] 2xl:w-[20%] h-[60%] md:h-1/2 rounded-sm flex justify-center items-center transition-all duration-300 bg-red-600 hover:bg-red-700 hover:2xl:w-[22%] hover:h-[65%] hover:cursor-pointer pb-0.5"
                        >
                          <MdDelete className="text-lg" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  function PaginatedItems(props: PaginatedItemsProps) {
    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);

    // Simulate fetching items from another resources.
    // (This could be items from props; or items loaded in a local state
    // from an API endpoint with useEffect and useState)
    const endOffset = itemOffset + props.itemsPerPage;
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);
    const currentItems = mainProps.allBooks.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(mainProps.allBooks.length / props.itemsPerPage);

    // Invoke when user click to request another page.
    const handlePageClick = (event: { selected: number }) => {
      const newOffset =
        (event.selected * props.itemsPerPage) % mainProps.allBooks.length;
      console.log(
        `User requested page number ${event.selected}, which is offset ${newOffset}`
      );
      setItemOffset(newOffset);
    };

    return (
      <div className="mb-20">
        <SubBookList currentItems={currentItems} />
        <div className="w-full flex justify-center items-center mt-16">
          <div className="lg:w-[90%] lg:mx-auto">
            {" "}
            <ReactPaginate
              className="mb-5 w-[90%] md:w-full h-10 md:h-14 lg:h-16 xl:h-18 2xl:h-20 flex flex-row gap-x-4 justify-center font-sans font-semibold"
              activeClassName="bg-blue-600  text-white w-16 h-[90%] flex items-center justify-center hover:cursor-default hover:bg-blue-600 rounded-lg"
              activeLinkClassName="text-lg bg-blue-600 hover:bg-blue-600 text-white w-full flex items-center justify-center hover:cursor-default rounded-lg"
              pageClassName="bg-[#e7ebf0] w-16 h-[90%] flex items-center justify-center hover:bg-blue-600 hover:cursor-pointer rounded-lg"
              pageLinkClassName="text-xl md:text-xl lg:text-xl xl:text-2xl 2xl:text-2xl text-black hover:text-white w-full h-full flex items-center justify-center hover:cursor-pointer rounded-lg"
              breakClassName="w-16 h-[90%] bg-white flex items-center justify-center text-blue-600  hover:bg-gray-100  hover:cursor-pointer"
              breakLinkClassName="text-lg text-blue-600 w-full h-full flex items-center justify-center hover:cursor-pointer rounded-lg"
              previousClassName="w-16 h-[90%] bg-blue-600 flex items-center justify-center hover:cursor-pointer  hover:bg-blue-700 rounded-lg"
              previousLinkClassName="text-lg text-white flex items-center justify-center hover:cursor-pointer"
              nextClassName="w-16 h-[90%] bg-blue-600 flex items-center justify-center text-white hover:cursor-pointer hover:bg-blue-700 rounded-lg"
              nextLinkClassName="text-lg text-white flex items-center justify-center hover:cursor-pointer rounded-lg"
              disabledClassName="w-16 h-[90%] bg-red-600 flex items-center justify-center hover:bg-red-700 hover:cursor-not-allowed"
              disabledLinkClassName="text-lg text-white w-full h-[90%] flex items-center justify-center text-white bg-red-700 hover:bg-red-700 hover:cursor-not-allowed rounded-lg"
              breakLabel={<HiDotsHorizontal className="text-lg" />}
              nextLabel={
                <FaAngleRight className="text-lg md:text-3xl lg:text-2xl xl:text-3xl 2xl:text-4xl" />
              }
              onPageChange={handlePageClick}
              onClick={handlePageClick}
              eventListener="onClick"
              pageRangeDisplayed={3}
              pageCount={pageCount}
              previousLabel={
                <FaAngleLeft className="text-lg md:text-3xl lg:text-2xl xl:text-3xl 2xl:text-4xl" />
              }
              renderOnZeroPageCount={null}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PaginatedItems itemsPerPage={4} />
    </div>
  );
};
