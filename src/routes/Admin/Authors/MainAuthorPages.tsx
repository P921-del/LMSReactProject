import React, { useEffect, useState } from "react";
import { Outlet } from "react-router";
const MainAuthorPages = () => {
  const [WindowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  useEffect(() => {
    function handleResizing() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResizing);
    return () => window.removeEventListener("resize", handleResizing);
  }, []);
  return (
    <div className="flex flex-row border-2 border-blue-400">
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
              window.location.pathname === "/admin/authors"
                ? { backgroundColor: "#0275fe", color: "white" }
                : { backgroundColor: "#ffffff" }
            }
            onClick={() => window.location.assign("/admin/authors")}
          >
            show all authors
          </button>
        </div>
        <div className="w-full flex justify-center items-center">
          <button
            className="w-[80%] rounded-lg border border-transparent px-3 py-2.5 cursor-pointer transition-[border-color] duration-200 bg-blue-600 text-lg font-openSansRegular"
            style={
              window.location.pathname === "/admin/authors/add-author"
                ? { backgroundColor: "#0275fe", color: "white" }
                : { backgroundColor: "#ffffff" }
            }
            onClick={() => window.location.assign("/admin/authors/add-author")}
          >
            add author
          </button>
        </div>
      </section>
      <Outlet />
    </div>
  );
};

export default MainAuthorPages;
