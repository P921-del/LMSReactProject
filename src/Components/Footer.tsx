import React from "react";
import { useLocation } from "react-router";
export default function Footer() {
  const { pathname } = useLocation();
  if (pathname !== "/un-authorized") {
    return (
      <div
        className="border-2 border-red-500 w-full h-20 flex justify-center items-center z-10 mt-3"
        style={
          pathname == "/contact" || pathname === "/cart"
            ? {
                backgroundColor: "#f7d7da",
                color: "red",
              }
            : {
                backgroundColor: "#f7d7da",
                position: "fixed",
                bottom: 0,
                left: 0,
                color: "red",
              }
        }
      >
        <h3 className="text-base font-sans">
          @Copyright2025 - SalemIssa Library. Allrights reserved.
        </h3>
      </div>
    );
  }
}
