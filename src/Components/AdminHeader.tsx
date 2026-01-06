import React, { useContext, useEffect, useState } from "react";
import "./Header/Header.css";
import { Link, useNavigate } from "react-router";
import { RxHamburgerMenu } from "react-icons/rx";
import AdminContext from "./AdminLayout/Context";
import { getCookie } from "../Fuctions";

export const AdminHeader = () => {
  const contextData = useContext(AdminContext);

  if (!contextData) {
    throw new Error("ExampleComponent must be used within an AdminProvider");
  }
  const [headerDivWidth, setHeaderDivWidth] = useState<number>(
    window.innerWidth
  );
  useEffect(() => {
    function handleResizing() {
      setHeaderDivWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResizing);
    return () => window.removeEventListener("resize", handleResizing);
  }, []);
  const navigate = useNavigate();
  return (
    <div
      style={{ width: `${headerDivWidth}px` }}
      className="min-h-full relative bg-[#343a3d] flex flex-row justify-start gap-x-1.5 h-20 px-5 text-white"
    >
      <section
        className="bg-transparent flex flex-row justify-start gap-x-1"
        onClick={() => navigate("/")}
      >
        <div
          className="sm:hidden md:block"
          onClick={() => navigate("/")}
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            onClick={() => navigate("/")}
            src="/public/online-library.png"
            alt="project-icon"
            width={64}
            height={64}
          />
        </div>

        <span
          className="hidden w-[120px] md:flex flex-row items-center gap-x-2 mr-9 ml-2"
          onClick={() => navigate("/")}
        >
          <span onClick={() => navigate("/")}>LMS</span>
          <span onClick={() => navigate("/")}>Application</span>
        </span>
      </section>
      <nav className="hidden lg:w-[725px] lg:bg-transparent lg:flex flex-row justify-between lg:justify-start xl:justify-between md:items-center md:gap-x-2.5 lg:gap-x-7 xl:gap-x-0">
        <Link className="li text-gray-500 hover:text-gray-100" to="/">
          Home
        </Link>
        <Link
          className="li text-gray-500 hover:text-gray-100"
          to="/admin/authors"
        >
          Authors
        </Link>
        <Link
          className="li text-gray-500 hover:text-gray-100"
          to="/admin/publishers"
        >
          Publishers
        </Link>
        <Link
          className="li text-gray-500 hover:text-gray-100"
          to="/admin/members"
        >
          Members
        </Link>
        <Link
          className="li text-gray-500 hover:text-gray-100"
          to="/admin/books"
        >
          Book Inventory
        </Link>
        <Link
          className="li text-gray-500 hover:text-gray-100"
          to="/admin/borrowedbooks"
        >
          Issue/Return
        </Link>
      </nav>
      <div className="flex justify-center items-center absolute right-[15%] top-[20%] lg:hidden">
        <RxHamburgerMenu
          className="text-5xl hover:cursor-pointer"
          onClick={() => {
            contextData?.setAdminContextValue((prev) => ({
              ...prev,
              showAdminHeaderForMobileDesign:
                !contextData?.adminContextValue.showAdminHeaderForMobileDesign,
            }));
          }}
        />
      </div>
      {getCookie("LMS") != null ? (
        <Link
          onClick={() => {
            const userToken: string = getCookie("LMS");
            document.cookie = `LMS=${userToken}; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

            window.location.assign("/");
          }}
          className="text-white absolute top-5.5 right-[5%] bg-blue-600 w-24 h-10 rounded-sm hidden lg:flex justify-center items-center"
          to=""
        >
          Logout
        </Link>
      ) : (
        <Link className="loginLink" to="/login" style={{ top: "27px" }}>
          Login
        </Link>
      )}
    </div>
  );
};
{
  /* const userToken: string = getCookie("LMS");
                  document.cookie = `LMS=${userToken}; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                  window.location.assign("/"); */
}
