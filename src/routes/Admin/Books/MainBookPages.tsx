import React, { useEffect, useState } from "react";
import { Outlet } from "react-router";
const MainBookPages = () => {
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
        (window.location.pathname === "/admin/books/add-book" &&
        WindowWidth <= 1000
          ? "h-[2000px]"
          : window.location.pathname === "/admin/books/add-book" &&
              WindowWidth > 1000
            ? "h-[1400px]"
            : window.location.pathname.startsWith("/admin/books/update-book") &&
                WindowWidth <= 1000
              ? "h-[2400px] mb-5"
              : window.location.pathname.startsWith(
                    "/admin/books/update-book"
                  ) && WindowWidth > 1000
                ? "h-[1400px] mb-5"
                : window.location.pathname === "/admin/books"
                  ? "h-fit"
                  : "h-[890px]") + " flex flex-row border-2 border-blue-400"
      }
      style={
        window.location.pathname === "/admin/books" && WindowWidth < 1024
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
              window.location.pathname === "/admin/books"
                ? { backgroundColor: "#0275fe", color: "white" }
                : { backgroundColor: "#ffffff" }
            }
            onClick={() => window.location.assign("/admin/books")}
          >
            show all books
          </button>
        </div>
        <div className="w-full flex justify-center items-center">
          <button
            className="w-[80%] rounded-lg border border-transparent px-3 py-2.5 cursor-pointer transition-[border-color] duration-200 bg-blue-600 text-lg font-openSansRegular"
            style={
              window.location.pathname === "/admin/books/add-book"
                ? { backgroundColor: "#0275fe", color: "white" }
                : { backgroundColor: "#ffffff" }
            }
            onClick={() => window.location.assign("/admin/books/add-book")}
          >
            add book
          </button>
        </div>
      </section>
      <Outlet />
    </div>
  );
};

export default MainBookPages;
