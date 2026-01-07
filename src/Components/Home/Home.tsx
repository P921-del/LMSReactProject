import React, { useState } from "react";
import "./Home.css";
// core version + navigation, pagination modules:
import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
// import Swiper and modules styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { BiSolidStar } from "react-icons/bi";
import { BiSolidStarHalf } from "react-icons/bi";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";

export default function Home() {
  const Clients_Reviews = [
    {
      id: 1,
      Name: "AhmedHossam",
      review:
        "The Library Management System has completely transformed how we manage our collections. Searching for books is now seamless, and tracking loans has never been easier. A must-have for any modern library!",
      path: "/Client's_Reviews_Images/AhmedHossam.jfif",
    },
    {
      id: 2,
      Name: "MohammedElAraby",
      review:
        "Our staff productivity has improved significantly since implementing this LMS. The system is intuitive, fast, and makes reporting and analytics a breeze.",
      path: "/Client's_Reviews_Images/MohammedElAraby.jfif",
    },
    {
      id: 3,
      Name: "MohammedKhaled",
      review:
        "I love how this LMS integrates all our library services in one place. From issuing books to generating overdue notices, everything is automated and user-friendly.",
      path: "/Client's_Reviews_Images/MohammedKhaled.jfif",
    },
    {
      id: 4,
      Name: "MohammedNabil",
      review:
        "The system has reduced manual errors and improved overall efficiency. Students and staff love the online catalog, and we get fewer complaints about missing books.",
      path: "/Client's_Reviews_Images/MohammedNabil.jfif",
    },
    {
      id: 5,
      Name: "OmarAhmed",
      review:
        "Fantastic support and an easy-to-use interface. The LMS helped us modernize our library without any hassle, and our patrons appreciate the digital features.",
      path: "/Client's_Reviews_Images/OmarAbdelAlrahman.jpg",
    },
    {
      id: 6,
      Name: "SalahAbdelWakeal",
      review:
        "From tracking book loans to generating reports, this LMS handles everything smoothly. It's reliable, fast, and has made library management stress-free.",
      path: "/Client's_Reviews_Images/SalahAbdelWakeal.jfif",
    },
  ];
  const [hoverOnFounderImage, setHoverOnFounderImage] =
    useState<boolean>(false);
  const [itemHoverOnFounderImage, setItemHoverOnFounderImage] =
    useState<Number>(-1);
  const Greate_Founders = [
    {
      id: 1,
      Name: "MahmoudNagy",
      path: "/Client's_Reviews_Images/AhmedHossam.jfif",
    },
    {
      id: 2,
      Name: "OmarKaram",
      path: "/Client's_Reviews_Images/MohammedElAraby.jfif",
    },
    {
      id: 3,
      Name: "MohammedKhaled",
      path: "/Client's_Reviews_Images/MohammedKhaled.jfif",
    },
    {
      id: 4,
      Name: "AmrNourEldeen",
      path: "/Client's_Reviews_Images/Amr Nour eldeen.jfif",
    },
    {
      id: 5,
      Name: "OmarEzz",
      path: "/Client's_Reviews_Images/OmarAbdelAlrahman.jpg",
    },
    {
      id: 6,
      Name: "SalahAbdelWakeal",
      path: "/Client's_Reviews_Images/SalahAbdelWakeal.jfif",
    },
  ];
  const [openNavForMobileDesign, setOpenNavForMobileDesign] =
    useState<boolean>(false);
  useEffect(() => {
    // init Swiper: after render
    const swiper = new Swiper(".swiper", {
      // configure Swiper to use modules
      modules: [Navigation, Pagination],
      // Optional parameters
      direction: "horizontal",
      loop: true,
      // Navigation arrows
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      // And if we need scrollbar
      scrollbar: {
        el: ".swiper-scrollbar",
      },
    });
    console.log(swiper);
  }, []);
  const [homeDivWidth, setHomeDivWidth] = useState<number>(window.innerWidth);
  const [homeDivHeight, setHomeDivHeight] = useState<number>(
    window.innerHeight
  );
  useEffect(() => {
    function handleResizing() {
      setHomeDivWidth(window.innerWidth);
      setHomeDivHeight(window.innerHeight);
    }
    window.addEventListener("resize", handleResizing);
    return () => window.removeEventListener("resize", handleResizing);
  }, []);

  {
    /* Start Header for mobile design */
  }

  if (openNavForMobileDesign)
    return (
      <div
        className="mobile"
        style={{
          height: `${homeDivHeight}px`,
          width: `${homeDivWidth}px`,
          position: "relative",
          top: 0,
          left: `${homeDivWidth}`,
        }}
      >
        <div className="h-20 flex justify-center items-center border-b-2 border-b-gray-200 px-5">
          <IoClose
            className="text-black hover:text-blue-600 text-4xl"
            onClick={() => setOpenNavForMobileDesign(false)}
          />
        </div>
        <div className="h-8 flex justify-center items-center font-sans font-base text-lg">
          <Link to="/" className="text-white hover:text-blue-600">
            Home
          </Link>{" "}
        </div>
        <div className="h-8 flex justify-center items-center font-sans font-base text-lg">
          <Link to="/about" className="text-white hover:text-blue-600">
            About
          </Link>{" "}
        </div>
        <div className="h-8 flex justify-center items-center font-sans font-base text-lg">
          <Link to="/vision" className="text-white hover:text-blue-600">
            Vision
          </Link>{" "}
        </div>
      </div>
    );
  {
    /*End Header for mobile design */
  }
  if (!openNavForMobileDesign) {
    return (
      <div
        style={{
          width: `${homeDivWidth}px`,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          className="h-44 w-full flex flex-col justify-center gap-y-1"
          style={{
            backgroundColor: "#c9e4ff",
          }}
        >
          <div className="mb-2 flex justify-center items-center">
            <h1>Library Management System</h1>
          </div>

          <h4 className="text-center">
            Building Community, Inspiring readers. Expanding book access!
          </h4>
          {window.location.pathname === "/admin" ? null : (
            <div className="flex flex-row justify-end items-center pr-3 md:hidden">
              <div
                onClick={() => setOpenNavForMobileDesign((prev) => !prev)}
                className={
                  "text-3xl bg-blue-900 p-1 rounded-md w-10 h-10 relative"
                }
              >
                <div
                  className={
                    !openNavForMobileDesign
                      ? "bg-white w-8 block h-1 opacity-100 transition-all ease-in-out duration-300 rotate-0 absolute top-[25%] left-1"
                      : "bg-white w-8 h-1 transition-all ease-in-out duration-300 absolute top-[45%] left-1 rotate-45"
                  }
                ></div>
                <div
                  className={
                    !openNavForMobileDesign
                      ? "bg-white w-8 block h-1 opacity-100 transition-all ease-in-out duration-300 absolute top-[50%] left-1"
                      : "bg-white w-8 h-1 opacity-100 transition-all ease-in-out duration-300 hidden"
                  }
                ></div>
                <div
                  className={
                    !openNavForMobileDesign
                      ? "bg-white w-8 block h-1 opacity-100 transition-all ease-in-out duration-300 rotate-0 absolute bottom-[15%] left-1"
                      : "bg-white w-8 block h-1 opacity-100 transition-all ease-in-out duration-300 -rotate-45 absolute bottom-[45%] left-1"
                  }
                ></div>
              </div>
            </div>
          )}
        </div>
        <div
          className="h-[338px] w-full flex flex-row md:h-[600px]"
          style={{
            borderStyle: "solid",
            borderWidth: "medium",
            borderColor: "#489aaf",
          }}
        >
          <div className="hidden md:block md:h-full md:w-[30%] md:px-5 md:text-3xl">
            <h2
              style={{
                color: "black",
                margin: 0,
                textAlign: "left",
                fontWeight: "bold",
              }}
            >
              Filter
            </h2>
            <h3
              style={{
                color: "black",
                margin: 0,
                textAlign: "left",
                fontSize: "24px",
                fontStyle: "bold",
              }}
            >
              Category:
            </h3>
          </div>
          {/* Slider main container */}
          <div
            className="swiper h-full w-full md:w-[70%]"
            style={{
              borderLeftStyle: "solid",
              borderLeftWidth: "medium",
              borderLeftColor: "#489aaf",
            }}
          >
            {/* Additional required wrapper */}
            <div className="swiper-wrapper">
              {/* Slides */}

              <div className="swiper-slide z-0">
                <img
                  src="Schoolboy-selecting-a-book-from-bookcase-in-library.jpeg"
                  alt="Schoolboy-selecting-a-book-from-bookcase-in-library-Image"
                  width={"100%"}
                  height={"100%"}
                />
              </div>
              <div className="swiper-slide z-0">
                {" "}
                <img
                  src="Students-in-Library-38.jpg"
                  alt="Students-in-Library-38-Image"
                  width={"100%"}
                  height={"100%"}
                />
              </div>
              <div className="swiper-slide z-0">
                {" "}
                <img
                  src="images2_photos_built_environments_student.jpg"
                  alt="images2_photos_built_environments_student_Image"
                  width={"100%"}
                  height={"100%"}
                />
              </div>
            </div>
            {/* If we need navigation buttons */}
            <div className="swiper-button-prev z-10"></div>
            <div className="swiper-button-next z-10"></div>
            {/* If we need scrollbar */}
            <div className="swiper-scrollbar"></div>
          </div>
        </div>
        {window.location.pathname.startsWith("/admin") ? null : (
          <div className="relative h-[500px] w-[85%] mx-auto flex flex-row items-center mb-10">
            <div className="h-full w-1/2">
              <img
                className="w-full h-full"
                src="/public/book-storytelling.avif"
                alt="about_background_section"
              />
            </div>
            <div
              id="AboutSection"
              className="absolute left-1/2 top-[14%] h-[60%] pl-[2%] pt-[2%] w-1/2 bg-gray-100"
            >
              <h3 className="font-notoSansTeluguBold text-3xl text-left mb-5">
                ABOUT US
              </h3>
              <p className="font-notoSansTeluguMedium text-xl text-gray-500 text-left mb-8">
                We are a community-driven online library dedicated to connecting
                readers with the right books quickly and easily. Learn more
                about our mission and services.
              </p>
              <div className="flex flex-row justify-start">
                <button
                  onClick={() => window.location.assign("/about")}
                  className="w-40 text-white rounded-lg px-4 pt-3 pb-1 bg-blue-600 transition-all duration-300 hover:bg-gray-950 hover:cursor-pointer font-notoSansTeluguRegular text-xl"
                >
                  Read More
                </button>
              </div>
            </div>
          </div>
        )}
        {window.location.pathname.startsWith("/admin") ? null : (
          <div className="h-[340px] bg-gray-900 flex flex-col pt-[2%]">
            <div className="flex justify-center items-center mb-2">
              <h3 className="font-notoSansTeluguBold text-3xl text-white text-left">
                HAVE ANY QUESTIONS?
              </h3>
            </div>
            <div className="flex flex-col gap-y-[10%] items-center mb-8">
              <h3 className="font-notoSansTeluguMedium text-xl text-gray-500 text-left">
                {" "}
                Have any questions about borrowing books, managing your account,
                or using our online library?
              </h3>
              <h3 className="font-notoSansTeluguMedium text-xl text-gray-500 text-left">
                Our team is here to help. Reach out anytime and we’ll guide you
                quickly and clearly.
              </h3>
            </div>
            <div className="flex flex-row justify-center items-center">
              <button
                onClick={() => window.location.assign("/contact")}
                className="w-40 text-white rounded-lg px-4 pt-3 pb-1 bg-blue-600 transition-all duration-300 hover:bg-white hover:cursor-pointer hover:text-gray-900 font-notoSansTeluguRegular text-xl"
              >
                Contact Us
              </button>
            </div>
          </div>
        )}
        {window.location.pathname.startsWith("/admin") ? null : (
          <div
            id="ReviewsSection"
            className="h-[2300px] md:h-[1400px] lg:h-[1070px] pt-8 bg-[#f3f5f2]"
          >
            <h3 className="text-black font-notoSansTeluguBold text-4xl">
              CLIENT&apos;S REVIEWS
            </h3>
            <div className="w-[80%] mx-auto pt-5 grid grid-cols-1 grid-rows-6 md:grid-cols-2 md:grid-rows-3 lg:grid-cols-3 lg:grid-rows-2 sm:h-[2100px] md:h-[1200px] lg:h-[1000px] mt-3 md:mt-1">
              {Clients_Reviews.map((item) => (
                <div
                  className="w-[90%] h-[95%] pt-3 flex flex-col gap-y-3 border-2 border-gray-800 rounded-md"
                  key={item.id}
                >
                  <section className="flex justify-center items-center">
                    <img
                      className="rounded-full w-24 h-24"
                      src={item.path}
                      alt={item.Name + " Avatar"}
                    />
                  </section>
                  <p className="px-3">{item.review}</p>
                  <section className="flex justify-center items-center md:mt-2 lg:mt-5">
                    <div className="flex flex-row justify-center items-center gap-x-2 text-lg bg-[#f3f5f2] border-2 border-black px-[3%] w-1/3 md:w-1/2 lg:w-1/3 rounded-md h-10">
                      <BiSolidStar className="text-yellow-400" />
                      <BiSolidStar className="text-yellow-400" />
                      <BiSolidStar className="text-yellow-400" />
                      <BiSolidStar className="text-yellow-400" />
                      <BiSolidStarHalf className="text-yellow-400" />
                    </div>
                  </section>
                  <section className="flex justify-center items-center md:mt-0 lg:mt-5">
                    <h3 className="text-black font-notoSansTeluguBold text-2xl">
                      {item.Name}
                    </h3>
                  </section>
                </div>
              ))}
            </div>
          </div>
        )}
        {window.location.pathname.startsWith("/admin") ? null : (
          <div
            id="FoundersSection"
            className="h-[2300px] md:h-[1400px] lg:h-[1000px] pt-8 bg-[#f3f5f2]"
          >
            <h3 className="text-black font-notoSansTeluguBold text-4xl">
              GREATE FOUNDERS
            </h3>
            <div className="w-[80%] mx-auto pt-5 grid grid-cols-1 grid-rows-6 md:grid-cols-2 md:grid-rows-3 lg:grid-cols-3 lg:grid-rows-2 sm:h-[2100px] md:h-[1200px] lg:h-[800px] mt-3 md:mt-1">
              {Greate_Founders.map((item) => (
                <div
                  className="relative overflow-hidden w-[90%] h-[95%] flex flex-col border-2 border-gray-800 rounded-sm"
                  key={item.id}
                >
                  <section
                    className="w-full h-[85%] rounded-tl-sm rounded-tr-sm hover:cursor-pointer"
                    onMouseEnter={() => {
                      setHoverOnFounderImage(true);
                      setItemHoverOnFounderImage(item.id);
                    }}
                    onMouseMove={() => {
                      setHoverOnFounderImage(true);
                      setItemHoverOnFounderImage(item.id);
                    }}
                    onMouseLeave={() => {
                      setTimeout(() => {
                        setHoverOnFounderImage(false);
                        setItemHoverOnFounderImage(-1);
                      }, 20000);
                    }}
                  >
                    <img
                      className="rounded-tl-md rounded-tr-md w-full h-full"
                      src={item.path}
                      alt={item.Name + " Avatar"}
                    />
                  </section>
                  <section className="w-full h-[15%] flex justify-center items-center">
                    <h3 className="text-black font-notoSansTeluguBold text-2xl">
                      {item.Name}
                    </h3>
                  </section>
                  {hoverOnFounderImage &&
                    itemHoverOnFounderImage === item.id && (
                      <AnimatePresence>
                        {" "}
                        <motion.section
                          initial={{ left: "-100px" }}
                          animate={{ left: "10px" }}
                          transition={{
                            duration: 0.8,
                            delay: 0.5,
                            ease: [0, 0.71, 0.2, 1.01],
                          }}
                          exit={{ left: "-100px" }}
                          className="absolute flex flex-col gap-y-5 pt-5"
                        >
                          <div className="h-12 w-10 flex justify-center items-center border-2 border-black text-[#424245] bg-white hover:bg-[#424245] hover:text-white transition-all duration-300 hover:cursor-pointer">
                            <FaFacebookF className="text-lg" />
                          </div>
                          <div className="h-12 w-10 flex justify-center items-center border-2 border-black text-[#424245] bg-white hover:bg-[#424245] hover:text-white transition-all duration-300 hover:cursor-pointer">
                            <FaTwitter className="text-lg" />
                          </div>
                          <div className="h-12 w-10 flex justify-center items-center border-2 border-black text-[#424245] bg-white hover:bg-[#424245] hover:text-white transition-all duration-300 hover:cursor-pointer">
                            <FaInstagram className="text-lg" />
                          </div>
                          <div className="h-12 w-10 flex justify-center items-center border-2 border-black text-[#424245] bg-white hover:bg-[#424245] hover:text-white transition-all duration-300 hover:cursor-pointer">
                            <FaLinkedin className="text-lg" />
                          </div>
                        </motion.section>
                      </AnimatePresence>
                    )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}
