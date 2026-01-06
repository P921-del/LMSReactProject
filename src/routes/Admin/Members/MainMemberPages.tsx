import React, { useEffect, useState } from "react";
import { Outlet } from "react-router";
const MainMemberPages = () => {
  const [WindowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  useEffect(() => {
    function handleResizing() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResizing);
    return () => window.removeEventListener("resize", handleResizing);
  }, []);
  return (
    <div
      className={
        (window.location.pathname === "/admin/members/add-member" &&
        WindowWidth > 767
          ? "h-[890px]"
          : window.location.pathname === "/admin/members"
            ? "h-[800px]"
            : "h-[890px]") + " flex flex-row border-2 border-blue-400"
      }
      style={
        window.location.pathname === "/admin/members" && WindowWidth < 1024
          ? { width: `${WindowWidth}px`, height: "1900px" }
          : {}
      }
    >
      <section
        className="hidden border-x-4 border-x-blue-600 w-[30%] lg:flex flex-col gap-y-5 lg:w-[30%] py-5"
        style={
          WindowWidth >= 1000 && WindowWidth <= 1400
            ? { width: `${WindowWidth * 0.3}px` }
            : WindowWidth > 1400 && WindowWidth <= 2048
              ? { width: `${WindowWidth * 0.2}px` }
              : {}
        }
      >
        <div className="w-full flex justify-center items-center">
          <button
            className="w-[80%] rounded-lg border border-transparent px-3 py-2.5 cursor-pointer transition-[border-color] duration-200 bg-blue-600 text-lg font-openSansRegular"
            style={
              window.location.pathname === "/admin/members"
                ? { backgroundColor: "#0275fe", color: "white" }
                : { backgroundColor: "#ffffff" }
            }
            onClick={() => window.location.assign("/admin/members")}
          >
            show all members
          </button>
        </div>
        <div className="w-full flex justify-center items-center">
          <button
            className="w-[80%] rounded-lg border border-transparent px-3 py-2.5 cursor-pointer transition-[border-color] duration-200 bg-blue-600 text-lg font-openSansRegular"
            style={
              window.location.pathname === "/admin/members/add-member"
                ? { backgroundColor: "#0275fe", color: "white" }
                : { backgroundColor: "#ffffff" }
            }
            onClick={() => window.location.assign("/admin/members/add-member")}
          >
            add member
          </button>
        </div>
      </section>
      <Outlet />
    </div>
  );
};

export default MainMemberPages;
