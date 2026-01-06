import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { HiDotsHorizontal } from "react-icons/hi";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useNavigate } from "react-router";
import { getCookie } from "../../../Fuctions";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Constants";

interface GetPublisherDto {
  id: string;
  name: string;
}
interface Props {
  allPublishers: GetPublisherDto[];
  setAllPublishers: React.Dispatch<React.SetStateAction<GetPublisherDto[]>>;
}

export const PublisherInventoryList = (mainProps: Props) => {
  interface SubPublisherListProps {
    currentItems: GetPublisherDto[];
  }

  interface PaginatedItemsProps {
    itemsPerPage: number;
  }

  const SubPublisherList = (props: SubPublisherListProps) => {
    const [subPublisherListHeaderDivWidth, setSubPublisherListHeaderDivWidth] =
      useState<number>(window.innerWidth);
    const [WindowWidth, setWindowWidth] = useState<number>(window.innerWidth);
    useEffect(() => {
      function handleResizing() {
        setSubPublisherListHeaderDivWidth(window.innerWidth);
        setWindowWidth(window.innerWidth);
      }
      window.addEventListener("resize", handleResizing);
      return () => window.removeEventListener("resize", handleResizing);
    }, []);
    console.log(props.currentItems);
    const navigate = useNavigate();

    async function DeletePublisher(publisherId: string) {
      try {
        Swal.fire({
          title: "Do you want to delete this publisher?",
          showCancelButton: true,
          confirmButtonText: "Delete",
          icon: "warning",
          confirmButtonColor: "#ed1014",
        }).then(async (result) => {
          if (result.isConfirmed) {
            const adminToken = getCookie("LMS");
            const response = await fetch(
              `${API_BASE_URL}/Publisher/delete/${publisherId}?adminToken=${adminToken}`,
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
                text: "Publisher is deleted successfully",
                icon: "success",
                confirmButtonColor: "black",
              });
              try {
                const secondResponse = await fetch(
                  `${API_BASE_URL}/Publisher/publishers`
                );
                if (!secondResponse.ok) {
                  toast.error("Fetching publishers'data Failed!", {
                    position: "top-right",
                  });
                  throw new Error(
                    `HTTP error! status: ${secondResponse.status}`
                  );
                } else {
                  const data = await secondResponse.json();
                  mainProps.setAllPublishers(data);
                  console.log("Fetched data:", data);
                }
              } catch (error) {
                toast.error("Fetching publishers'data Failed!", {
                  position: "top-right",
                });
                console.error("Error fetching publishers'data:", error);
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
              : { width: `${subPublisherListHeaderDivWidth}px` }
        }
      >
        <div className="mt-10 border-b-2 border-b-gray-200 flex justify-center ml-0 items-center">
          <h2 className="mb-4 font-sans font-semibold text-3xl text-black">
            Publisher List
          </h2>
        </div>
        <div
          className="w-[90%] mx-auto lg:w-[80%] lg:mx-auto xl:w-[50%] mt-5 border-x-2 border-x-gray-300"
          style={
            WindowWidth >= 1000 && WindowWidth <= 1400
              ? { width: `${WindowWidth * 0.7}px` }
              : WindowWidth > 1400 && WindowWidth <= 2048
                ? { width: `${WindowWidth * 0.8}px` }
                : { width: `${subPublisherListHeaderDivWidth}px` }
          }
        >
          <div
            className="flex flex-row w-full md:w-[40%] lg:w-full bg-[#cdeaf3] h-10"
            style={
              WindowWidth >= 1000 && WindowWidth <= 1400
                ? { width: `${WindowWidth * 0.7}px` }
                : WindowWidth > 1400 && WindowWidth <= 2048
                  ? {
                      width: `${WindowWidth * 0.8 * 0.8}px`,
                      marginInline: "auto",
                    }
                  : {
                      width: `${subPublisherListHeaderDivWidth * 0.8}px`,
                      marginInline: "auto",
                    }
            }
          >
            <h4
              className="w-[80%] md:w-[85%] h-10 flex justify-start items-center pl-[3%] border-r-4 border-r-gray-200"
              style={
                WindowWidth < 1000
                  ? { width: `${WindowWidth * 0.8 * 0.8}px` }
                  : WindowWidth >= 1000 && WindowWidth <= 1400
                    ? {
                        width: `${WindowWidth * 0.7 * 0.8 * 0.8}px`,
                        marginInline: "auto",
                      }
                    : WindowWidth > 1400 && WindowWidth <= 2000
                      ? {
                          width: `${WindowWidth * 0.8 * 0.8 * 0.9}px`,
                          marginInline: "auto",
                        }
                      : { width: `${subPublisherListHeaderDivWidth}px` }
              }
            >
              <span className="font-sans font-bold text-xl text-black">
                Publisher Name
              </span>
            </h4>
            <div
              className="w-[20%] md:w-[15%] h-10"
              style={
                WindowWidth < 1000
                  ? { width: `${WindowWidth * 0.8 * 0.2}px` }
                  : WindowWidth >= 1000 && WindowWidth <= 2000
                    ? {
                        width: `${WindowWidth * 0.7 * 0.8 * 0.2}px`,
                        marginInline: "auto",
                      }
                    : WindowWidth > 1400 && WindowWidth <= 2000
                      ? {
                          width: `${WindowWidth * 0.8 * 0.8 * 0.1}px`,
                          marginInline: "auto",
                        }
                      : { width: `${subPublisherListHeaderDivWidth}px` }
              }
            ></div>
          </div>

          <div
            className="flex flex-col"
            style={
              WindowWidth < 1000
                ? { width: `${WindowWidth * 0.8}px`, marginInline: "auto" }
                : WindowWidth >= 1000 && WindowWidth <= 1400
                  ? { width: `${WindowWidth * 0.7}px` }
                  : WindowWidth > 1400 && WindowWidth <= 2048
                    ? {
                        width: `${WindowWidth * 0.8 * 0.8}px`,
                        marginInline: "auto",
                      }
                    : {}
            }
          >
            {props.currentItems &&
              props.currentItems.map((item: GetPublisherDto) => (
                <div
                  key={item.id}
                  className={"md:w-[40%] flex flex-row w-full h-12"}
                  style={
                    WindowWidth < 1000
                      ? {
                          width: `${WindowWidth * 0.8}px`,
                          marginInline: "auto",
                        }
                      : WindowWidth >= 1000 && WindowWidth <= 1400
                        ? { width: `${WindowWidth * 0.7}px` }
                        : WindowWidth > 1400 && WindowWidth <= 2048
                          ? {
                              width: `${WindowWidth * 0.8 * 0.8}px`,
                              marginInline: "auto",
                            }
                          : { width: `${subPublisherListHeaderDivWidth}px` }
                  }
                >
                  <div
                    className=" border-b-2 border-b-gray-300 bg-white font-semibold w-[80%] md:w-[85%] h-12 flex justify-start items-center pl-[3%] border-r-4 border-r-gray-200"
                    style={
                      WindowWidth < 1000
                        ? { width: `${WindowWidth * 0.8 * 0.8}px` }
                        : WindowWidth >= 1000 && WindowWidth <= 1400
                          ? {
                              width: `${WindowWidth * 0.7 * 0.8 * 0.8}px`,
                              marginInline: "auto",
                            }
                          : WindowWidth > 1400 && WindowWidth <= 2100
                            ? {
                                width: `${WindowWidth * 0.8 * 0.8 * 0.9}px`,
                                marginInline: "auto",
                              }
                            : { width: `${subPublisherListHeaderDivWidth}px` }
                    }
                  >
                    <span>{item.name}</span>
                  </div>
                  <div
                    className="border-b-2 border-b-gray-300 w-[20%] md:w-[15%] lg:w-[15%] flex flex-row justify-center items-center gap-x-[10%] h-12 text-white text-2xl"
                    style={
                      WindowWidth < 1000
                        ? { width: `${WindowWidth * 0.8 * 0.2}px` }
                        : WindowWidth >= 1000 && WindowWidth <= 1400
                          ? {
                              width: `${WindowWidth * 0.7 * 0.8 * 0.2}px`,
                              marginInline: "auto",
                            }
                          : WindowWidth > 1400 && WindowWidth <= 2100
                            ? {
                                width: `${WindowWidth * 0.8 * 0.8 * 0.1}px`,
                                marginInline: "auto",
                              }
                            : { width: `${subPublisherListHeaderDivWidth}px` }
                    }
                  >
                    <span
                      onClick={() =>
                        navigate(
                          `/admin/publishers/update-publisher/${item.id}`
                        )
                      }
                      className="w-[30%] md:w-[20%] 2xl:w-[20%] h-[60%] md:h-1/2 rounded-sm flex justify-center items-center bg-blue-600 pb-1"
                    >
                      <MdEdit className="text-lg" />
                    </span>

                    <span
                      onClick={() => DeletePublisher(item.id)}
                      className="w-[30%] md:w-[20%] 2xl:w-[20%] h-[60%] md:h-1/2 rounded-sm flex justify-center items-center bg-red-600 pb-0.5"
                    >
                      <MdDelete className="text-lg" />
                    </span>
                  </div>
                </div>
              ))}
          </div>
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
    const currentItems = mainProps.allPublishers.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(
      mainProps.allPublishers.length / props.itemsPerPage
    );

    // Invoke when user click to request another page.
    const handlePageClick = (event: { selected: number }) => {
      const newOffset =
        (event.selected * props.itemsPerPage) % mainProps.allPublishers.length;
      console.log(
        `User requested page number ${event.selected}, which is offset ${newOffset}`
      );
      setItemOffset(newOffset);
    };
    return (
      <>
        <SubPublisherList currentItems={currentItems} />
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
      </>
    );
  }

  return (
    <div>
      <PaginatedItems itemsPerPage={4} />
    </div>
  );
};
