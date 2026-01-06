import React, { useContext, useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import "./Header.css";
import { Link, useNavigate } from "react-router";
import PublicContext from "../PublicLayout/Context";
import { DeleteCookie, getCookie } from "../../Fuctions";

function Header() {
  const publicContext = useContext(PublicContext);
  if (!publicContext)
    throw new Error("Header Component must be within a PublicLayout");

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
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };
  const navigate = useNavigate();
  if (window.location.pathname !== "/un-authorized") {
    return (
      <div
        style={{ width: `${headerDivWidth}px` }}
        className="min-h-full relative bg-blue-900 flex flex-row justify-start gap-x-1.5 h-20 px-5 text-white"
      >
        <section className="title" onClick={() => navigate("/")}>
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
            className="text sm:hidden md:block"
            onClick={() => navigate("/")}
          >
            <span style={{ marginRight: 3 }} onClick={() => navigate("/")}>
              LMS
            </span>
            <span onClick={() => navigate("/")}>Application</span>
          </span>
        </section>
        <nav className="nav">
          <Link className="li" to="/">
            Home
          </Link>
          <Link className="li" to="/shop">
            Shop
          </Link>

          <Link
            className="li"
            to=""
            onClick={() => {
              scrollToSection("FoundersSection");
            }}
          >
            Founders
          </Link>
          <Link
            className="li"
            to=""
            onClick={() => {
              scrollToSection("AboutSection");
            }}
          >
            About
          </Link>
          <Link className="li" to="/contact">
            Contact Us
          </Link>
          <Link
            className="li"
            to=""
            onClick={() => {
              scrollToSection("ReviewsSection");
            }}
          >
            Reviews
          </Link>
        </nav>
        <Link
          className=" text-white w-20 h-7 flex flex-row gap-x-1 absolute top-[36%] lg:top-[36%] xl:top-[35%] right-[15%] md:right-[13%] lg:right-[13%] xl:right-[10%]"
          to="/cart"
        >
          <FaShoppingCart className="text-2xl" />
          <h3 className="flex flex-row gap-1 text-xl">
            {" "}
            <h3>{"("}</h3> <h3>{publicContext.cart.length}</h3>
            <h3>{")"}</h3>
          </h3>
        </Link>
        {getCookie("LMS") !== "" ? (
          <Link onClick={() => DeleteCookie("LMS")} className="loginLink" to="">
            Logout
          </Link>
        ) : (
          <Link className="loginLink" to="/login">
            Login
          </Link>
        )}
      </div>
    );
  }
}

export default Header;
