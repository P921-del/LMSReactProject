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
import { API_BASE_URL } from "../../../Constants";

interface GetMemberDto {
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
interface Props {
  allMembers: GetMemberDto[];
  setAllMembers: React.Dispatch<React.SetStateAction<GetMemberDto[]>>;
}

export const MemberInventoryList = (mainProps: Props) => {
  interface SubMemberListProps {
    currentItems: GetMemberDto[];
  }

  interface PaginatedItemsProps {
    itemsPerPage: number;
  }

  async function SearchOverAllMembersUsingMemberEmailAsync(value: string) {
    try {
      const adminToken = getCookie("LMS");
      const response = await fetch(
        `${API_BASE_URL}/Member/members/email/?adminToken=${adminToken}&email=${value}`,
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
        mainProps.setAllMembers(data);
      } else {
        console.error("Error Finding member");
      }
    } catch (error) {
      console.error("Error Finding member:", error);
    }
  }
  const SubMemberList = (props: SubMemberListProps) => {
    const [subMemberListHeaderDivWidth, setSubMemberListHeaderDivWidth] =
      useState<number>(window.innerWidth);
    const [WindowWidth, setWindowWidth] = useState<number>(window.innerWidth);
    useEffect(() => {
      function handleResizing() {
        setSubMemberListHeaderDivWidth(window.innerWidth);
        setWindowWidth(window.innerWidth);
      }
      window.addEventListener("resize", handleResizing);
      return () => window.removeEventListener("resize", handleResizing);
    }, []);
    console.log(props.currentItems);
    const navigate = useNavigate();

    async function DeleteMember(memberId: string) {
      try {
        Swal.fire({
          title: "Do you want to delete this member?",
          showCancelButton: true,
          confirmButtonText: "Delete",
          icon: "warning",
          confirmButtonColor: "#ed1014",
        }).then(async (result) => {
          if (result.isConfirmed) {
            const adminToken = getCookie("LMS");
            const response = await fetch(
              `${API_BASE_URL}/Member/delete/${memberId}?adminToken=${adminToken}`,
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
                text: "Member is deleted successfully",
                icon: "success",
                confirmButtonColor: "black",
              });
              try {
                const secondResponse = await fetch(
                  `${API_BASE_URL}/Member/members`
                );
                if (!secondResponse.ok) {
                  toast.error("Fetching members'data Failed!", {
                    position: "top-right",
                  });
                  throw new Error(
                    `HTTP error! status: ${secondResponse.status}`
                  );
                } else {
                  const data = await secondResponse.json();
                  mainProps.setAllMembers(data);
                  console.log("Fetched data:", data);
                }
              } catch (error) {
                toast.error("Fetching members'data Failed!", {
                  position: "top-right",
                });
                console.error("Error fetching members'data:", error);
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
              : { width: `${subMemberListHeaderDivWidth}px` }
        }
      >
        {WindowWidth >= 1024 ? (
          <div className="mt-10 border-b-2 border-b-gray-200 flex justify-start pl-[2%] items-center">
            <h2 className="mb-4 font-sans font-semibold text-3xl text-black">
              Member List
            </h2>
          </div>
        ) : (
          <div className="mt-10 flex justify-start pl-[4%] items-center">
            <h3 className="mb-4 font-notoSansTeluguBold text-5xl text-black">
              Users
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
                  SearchOverAllMembersUsingMemberEmailAsync(
                    event.currentTarget.value
                  );
                }
              }}
            />
          </div>
        )}
        <div className="w-[95%] mx-auto mt-5 ">
          {WindowWidth >= 1024 ? (
            <div className="w-full flex flex-row bg-[#0065f4] h-10">
              <h4 className="w-[10%] h-10 flex justify-start items-center pl-[1.5%] border-r-4 border-r-gray-200">
                <span className="font-sans font-bold text-xl text-white">
                  Name
                </span>
              </h4>
              <h4 className="w-[7%] h-10 flex justify-start items-center pl-[0.5%] border-r-4 border-r-gray-200">
                <span className="font-sans font-bold text-xl text-white">
                  DOB
                </span>
              </h4>
              <h4 className="w-[10%] h-10 flex justify-start items-center pl-[1%] border-r-4 border-r-gray-200">
                <span className="font-sans font-bold text-xl text-white">
                  Contact
                </span>
              </h4>
              <h4 className="lg:w-[30%] xl:w-[23%] h-10 flex justify-start items-center pl-[1%] border-r-4 border-r-gray-200">
                <span className="font-sans font-bold text-xl text-white">
                  Email
                </span>
              </h4>
              <h4 className="w-[8%] h-10 flex justify-start items-center pl-[1%] border-r-4 border-r-gray-200">
                <span className="font-sans font-bold text-xl text-white">
                  State
                </span>
              </h4>
              <h4 className="w-[10%] h-10 flex justify-start items-center pl-[1.5%] border-r-4 border-r-gray-200">
                <span className="font-sans font-bold text-xl text-white">
                  City
                </span>
              </h4>
              <h4 className="lg:hidden xl:w-[7%] h-10 xl:flex justify-start items-center pl-[0.3%] border-r-4 border-r-gray-200">
                <span className="font-sans font-bold text-xl text-white">
                  PinCode
                </span>
              </h4>
              <h4 className="w-[15%] h-10 flex justify-start items-center pl-[0.8%] border-r-4 border-r-gray-200">
                <span className="font-sans font-bold text-xl text-white">
                  FullAddress
                </span>
              </h4>
              <div className="w-[10%] h-10 bg-red-500"></div>
            </div>
          ) : null}

          <div className="w-full flex flex-col gap-y-4 shadow-xl">
            {props.currentItems &&
              WindowWidth < 1024 &&
              props.currentItems.map((item: GetMemberDto) => (
                <div
                  key={item.id}
                  className={
                    "flex flex-col border-2 border-gray-200 rounded-xl pl-[4%] pt-6"
                  }
                >
                  <div className="bg-white flex justify-start items-center mb-3">
                    <h3 className="font-notoSansTeluguBold text-2xl">
                      {" "}
                      {item.userName}
                    </h3>
                  </div>
                  <div className="w-[95%] bg-white font-notoSansTeluguRegular text-xl flex flex-row justify-start items-center gap-x-[20%]">
                    <h3>{item.state}</h3>
                    <h3>{item.contactNumber}</h3>
                  </div>
                  <div className="w-[95%] bg-white font-notoSansTeluguRegular text-xl flex flex-row justify-start items-center gap-x-[15%]">
                    <h3>Full Name</h3>
                    <h3>{item.fullName}</h3>
                  </div>
                  <div className="w-[95%] bg-white font-notoSansTeluguRegular text-xl flex flex-row justify-start items-center gap-x-[12%]">
                    <h3>Date of Birth</h3>
                    <h3>{item.dateOfBirth}</h3>
                  </div>

                  <div className="w-[95%] bg-white font-notoSansTeluguRegular text-xl flex flex-row justify-start items-center gap-x-[20%]">
                    <h3>Email</h3>
                    <h3>{item.email}</h3>
                  </div>
                  <div className="w-[95%] bg-white font-notoSansTeluguRegular text-xl flex flex-row justify-start items-center gap-x-[22%]">
                    <h3>City</h3>
                    <h3>{item.city}</h3>
                  </div>
                  <div className="w-[95%] bg-white font-notoSansTeluguRegular text-xl flex flex-row justify-start items-center gap-x-[23%]">
                    <h3>Pin</h3>
                    <h3>{item.pin}</h3>
                  </div>
                  <div className="w-[95%] bg-white font-notoSansTeluguRegular text-xl flex flex-row justify-start items-center gap-x-[12%]">
                    <h3>Full Address</h3>
                    <h3>{item.fullAddress}</h3>
                  </div>

                  <div className="w-[95%] mt-2 pr-[10%] ml-auto mb-5  flex flex-row justify-end items-center gap-x-[6%] h-12 text-white text-2xl">
                    <span
                      onClick={() =>
                        navigate(`/admin/members/update-member/${item.id}`)
                      }
                      className="w-9 h-9 rounded-sm flex justify-center items-center transition-all duration-300 bg-blue-600 hover:bg-blue-700 hover:w-10 hover:h-10 hover:cursor-pointer pb-1"
                    >
                      <MdEdit className="text-lg" />
                    </span>

                    <span
                      onClick={() => DeleteMember(item.id)}
                      className="w-9 h-9 rounded-sm flex justify-center items-center transition-all duration-300 bg-red-600 hover:bg-red-700 hover:w-10 hover:h-10 hover:cursor-pointer pb-0.5"
                    >
                      <MdDelete className="text-lg" />
                    </span>
                  </div>
                </div>
              ))}
            {props.currentItems &&
              WindowWidth >= 1024 &&
              props.currentItems.map((item: GetMemberDto) => (
                <div key={item.id} className={"w-full flex flex-row h-12"}>
                  <div className="w-[10%] pl-[1.5%] border-b-2 border-b-gray-300 bg-white font-semibold h-12 flex justify-start items-center border-r-4 border-r-gray-200">
                    <span>
                      {" "}
                      {item.userName.length <= 5
                        ? item.userName
                        : item.userName.slice(0, 5) + "..."}
                    </span>
                  </div>
                  <div className="w-[7%] p-[1%] border-b-2 border-b-gray-300 bg-white font-semibold h-12 flex justify-start items-center border-r-4 border-r-gray-200">
                    <span>{item.dateOfBirth}</span>
                  </div>
                  <div className="w-[10%] pl-[1%] border-b-2 border-b-gray-300 bg-white font-semibold h-12 flex justify-start items-center border-r-4 border-r-gray-200">
                    <span>{item.contactNumber}</span>
                  </div>
                  <div className="lg:w-[30%] xl:w-[23%] pl-[0.5%] border-b-2 border-b-gray-300 bg-white font-semibold h-12 flex justify-start items-center border-r-4 border-r-gray-200">
                    <span>
                      {item.email.length <= 25
                        ? item.email
                        : item.email.slice(0, 25) + "..."}
                    </span>
                  </div>
                  <div className="w-[8%] pl-[1%] border-b-2 border-b-gray-300 bg-white font-semibold h-12 flex justify-start items-center border-r-4 border-r-gray-200">
                    <span>{item.state}</span>
                  </div>
                  <div className="w-[10%] pl-[0.5%] border-b-2 border-b-gray-300 bg-white font-semibold h-12 flex justify-start items-center border-r-4 border-r-gray-200">
                    <span>{item.city}</span>
                  </div>
                  <div className="lg:hidden xl:w-[7%] p-[0.5%] border-b-2 border-b-gray-300 bg-white font-semibold h-12 xl:flex justify-start items-center border-r-4 border-r-gray-200">
                    <span>
                      {item.pin.length <= 5
                        ? item.pin
                        : item.pin.slice(0, 5) + "..."}
                    </span>
                  </div>
                  <div className="w-[15%] pl-[0.5%] border-b-2 border-b-gray-300 bg-white font-semibold h-12 flex justify-start items-center border-r-4 border-r-gray-200">
                    <span>{item.fullAddress}</span>
                  </div>

                  <div className="w-[10%] border-b-2 border-b-gray-300 flex flex-row justify-center items-center gap-x-[10%] h-12 text-white text-2xl">
                    <span
                      onClick={() =>
                        navigate(`/admin/members/update-member/${item.id}`)
                      }
                      className="w-[30%] md:w-[20%] 2xl:w-[20%] h-[60%] md:h-1/2 rounded-sm flex justify-center items-center bg-blue-600 pb-1"
                    >
                      <MdEdit className="text-lg" />
                    </span>

                    <span
                      onClick={() => DeleteMember(item.id)}
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
    const currentItems = mainProps.allMembers.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(
      mainProps.allMembers.length / props.itemsPerPage
    );

    // Invoke when user click to request another page.
    const handlePageClick = (event: { selected: number }) => {
      const newOffset =
        (event.selected * props.itemsPerPage) % mainProps.allMembers.length;
      console.log(
        `User requested page number ${event.selected}, which is offset ${newOffset}`
      );
      setItemOffset(newOffset);
    };

    return (
      <>
        <SubMemberList currentItems={currentItems} />
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
