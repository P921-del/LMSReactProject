import React, { useContext, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { HiDotsHorizontal } from "react-icons/hi";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { onlyNumbers } from "../../Fuctions";
import { toast } from "react-toastify";
import PublicContext from "../PublicLayout/Context";
import { API_BASE_URL } from "../../Constants";
interface GetBookDto {
  id: string;
  bookCover: Uint8Array;
  bookTitle: string;
  bookCost: number;
  actualStock: number;
}
interface GetBookCopyDto {
  id: string;
  bookCover: Uint8Array;
  bookTitle: string;
  bookCost: number;
  actualStock: number;
  quantity: number;
}

export const ShopBookInventoryList = () => {
  useEffect(() => {
    localStorage.clear();
  }, []);
  const [allBooks, setAllBooks] = useState<GetBookDto[]>([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${API_BASE_URL}/Book/public/books`);
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
  const [allBooksCopy, setAllBooksCopy] = useState<GetBookCopyDto[]>([]);
  useEffect(() => {
    if (allBooks.length > 0) {
      const updated = allBooks.map((book) => ({ ...book, quantity: 1 }));
      setAllBooksCopy(updated);
    }
  }, [allBooks]);
  const [searchOverAllBooksTextOnInput, setSearchOverAllBooksTextOnInput] =
    useState<string>("");
  interface SubBookListProps {
    currentItems: GetBookCopyDto[];
  }

  interface PaginatedItemsProps {
    itemsPerPage: number;
  }

  useEffect(() => {
    async function SearchOverAllBooksUsingBookTitleAsync(value: string) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/Book/public/books/title=${value}`,
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
          setAllBooks(data);
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
    const [WindowWidth, setWindowWidth] = useState<number>(window.innerWidth);
    useEffect(() => {
      function handleResizing() {
        setWindowWidth(window.innerWidth);
      }
      window.addEventListener("resize", handleResizing);
      return () => window.removeEventListener("resize", handleResizing);
    }, []);
    console.log(props.currentItems);

    const publicContext = useContext(PublicContext);
    if (!publicContext)
      throw new Error(
        "ShopBookInventoryList Component must be within a PublicLayout"
      );
    useEffect(() => {
      console.log(publicContext.cart);
    }, []);
    function AddToCart(bookId: string) {
      if (!publicContext)
        throw new Error(
          "ShopBookInventoryList Component must be within a PublicLayout"
        );
      publicContext.setCart((prevCart) => {
        const found = prevCart.findIndex((item) => item.bookId === bookId);

        if (found !== -1) {
          const newQuantity = allBooksCopy.find(
            (book) => book.id === prevCart[found].bookId
          )?.quantity;
          if (newQuantity !== undefined) {
            const updatedItem = {
              ...prevCart[found],
              quantity: newQuantity,
            };

            return prevCart.map((item, index) =>
              index === found ? updatedItem : item
            );
          }
          return prevCart;
        } else {
          // Add new item
          const foundElement = allBooksCopy.find((item) => item.id === bookId);
          if (foundElement !== undefined)
            return [
              ...prevCart,
              {
                bookId: foundElement.id,
                bookTitle: foundElement.bookTitle,
                bookCover: foundElement.bookCover,
                bookCost: foundElement.bookCost,
                quantity: foundElement.quantity,
              },
            ];
          return prevCart;
        }
      });
    }

    function GoToBookDetailsPage(bookId: string) {
      window.location.assign(`/shop/${bookId}`);
    }

    return (
      <div className="w-[95%] mx-auto h-fit mb-10">
        {WindowWidth >= 1024 ? (
          <div className="w-[95%] mx-auto mt-10 flex flex-col items-center mb-8">
            <div className="w-full mb-4 flex justify-center items-center">
              {" "}
              <h3 className="text-black font-notoSansTeluguBold text-4xl">
                LATEST PRODUCTS
              </h3>
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
              placeholder="Search by Book Title"
              onChange={(event) =>
                setSearchOverAllBooksTextOnInput(event.currentTarget.value)
              }
              onKeyUp={(event) => {
                if (event.key === "Enter") {
                  setSearchOverAllBooksTextOnInput(event.currentTarget.value);
                }
              }}
            />
          </div>
        )}
        <div className="w-[70%] mx-auto grid gap-x-[10%] grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 mt-5">
          {allBooksCopy.map((book) => {
            return (
              <div
                key={book.id}
                className="border border-gray-600 rounded-sm pt-5"
              >
                <div className="w-[85%] mx-auto h-72 mb-2">
                  {/* FIXED: Base64 must include the actual string */}
                  <img
                    onClick={() => GoToBookDetailsPage(book.id)}
                    src={`data:image/png;base64,${book.bookCover}`}
                    alt={book.bookTitle + " Cover"}
                    className="w-full h-full object-contain hover:cursor-pointer"
                  />
                </div>

                {/* You forgot to close this div structure */}
                <div className="flex justify-center items-center mb-2">
                  <h3
                    onClick={() => GoToBookDetailsPage(book.id)}
                    className="font-notoSansTeluguMedium text-md text-gray-600 hover:cursor-pointer"
                  >
                    {book.bookTitle}
                  </h3>
                </div>

                <div className=" w-[90%] mx-auto border-[3px] border-gray-400 rounded-sm h-11 mb-5">
                  <input
                    className="w-full h-full pl-[5%] border-none focus:border-none rounded-sm"
                    value={book.quantity}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setAllBooksCopy((prevState) => {
                        const found = prevState.findIndex(
                          (item) => item.id === book.id
                        );
                        if (found === -1) return prevState;

                        return allBooksCopy.map((book, index) => {
                          if (found === index)
                            return {
                              ...book,
                              quantity: parseInt(event.target.value),
                            };
                          return book;
                        });
                      })
                    }
                    min={1}
                    max={10}
                    type="number"
                    onKeyDown={onlyNumbers}
                  />
                </div>
                <div>
                  <button
                    onClick={() => AddToCart(book.id)}
                    className="font-notoSansTeluguRegular text-md bg-blue-600 hover:bg-blue-700 text-white px-8 pt-3 pb-2 border rounded-md mb-5"
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            );
          })}
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
    const currentItems = allBooksCopy.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(allBooksCopy.length / props.itemsPerPage);

    // Invoke when user click to request another page.
    const handlePageClick = (event: { selected: number }) => {
      const newOffset =
        (event.selected * props.itemsPerPage) % allBooksCopy.length;
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
