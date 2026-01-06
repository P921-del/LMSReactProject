import React, { useRef, useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { RxDoubleArrowLeft } from "react-icons/rx";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Constants";

function setCookie(cname: string, cvalue: string, exdays: number) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

interface LoginDto {
  Email: string;
  Password: string;
}
const Login = () => {
  const Email = useRef<HTMLInputElement>(null);
  const Password = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [openNavForMobileDesign, setOpenNavForMobileDesign] =
    useState<boolean>(false);
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
          <Link to="/contact" className="text-white hover:text-blue-600">
            Contact
          </Link>{" "}
        </div>
      </div>
    );
  {
    /*End Header for mobile design */
  }

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
        <div className="flex flex-row justify-end items-center pr-3 md:hidden">
          <div
            onClick={() => setOpenNavForMobileDesign((prev) => !prev)}
            className={"text-3xl bg-blue-900 p-1 rounded-md w-10 h-10 relative"}
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
      </div>
      <div
        style={{
          height: "600px",
          width: "100%",
          borderStyle: "solid",
          borderWidth: "medium",
          borderColor: "#489aaf",
          display: "flex",
          flexDirection: "row",
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
        {/* Login main container */}
        <div className="h-full w-full md:w-[70%] border-l-2 border-l-cyan-600">
          <h2
            style={{
              fontSize: "20px",
              textAlign: "initial",
              marginLeft: "50px",
            }}
          >
            LoginPage
          </h2>
          <div
            style={{
              height: "520px",
              width: "70%",
              marginTop: "20px",
              paddingTop: "20px",
              marginInline: "auto",
              borderStyle: "solid",
              borderWidth: "medium",
              borderColor: "#c7c9c9ff",
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img src="/public/user.png" width={"128px"} height={"128px"} />
            </div>
            <h3
              style={{
                fontSize: "20px",
                textAlign: "center",
                margin: 0,
                marginBottom: "10px",
              }}
            >
              User Login
            </h3>
            <div
              style={{
                backgroundColor: "transparent",
                display: "flex",
                flexDirection: "column",
                columnGap: "5px",
                height: "80px",
                paddingInline: "15px",
              }}
            >
              <label
                htmlFor="email"
                style={{
                  textAlign: "left",
                  fontFamily: "sans-serif",
                  fontStyle: "unset",
                  fontSize: "16px",
                  lineHeight: 1.5 / 1,
                }}
              >
                Email
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "20px",
                  outlineWidth: "1px",
                  outlineOffset: "1px",
                  outlineColor: "#d1d5dc",
                  marginTop: "5px",
                }}
              >
                <input
                  id="email"
                  name="email"
                  className="userNameInput h-8 border-2 border-gray-500"
                  style={{
                    minWidth: 0,
                    paddingBlock: "6px",
                    paddingRight: "10px",
                    paddingLeft: "12px",
                    flexGrow: 1,
                    fontSize: "16px",
                    lineHeight: 1.5 / 1,
                    color: "#101828",
                    borderRadius: "4px",
                    outlineWidth: "1px",
                    outlineOffset: "1px",
                    outlineColor: "#d1d5dc",
                  }}
                  ref={Email}
                  type="text"
                  placeholder="Email"
                  onFocus={(e) => {
                    var parent = e.currentTarget.parentElement;
                    if (parent != null) {
                      parent.style.outlineWidth = "2px";
                      parent.style.outlineOffset = "2px";
                      parent.style.outlineColor = "#4f39f6";
                    }
                  }}
                />
              </div>
            </div>
            <div
              style={{
                backgroundColor: "transparent",
                display: "flex",
                flexDirection: "column",
                columnGap: "5px",
                height: "80px",
                paddingInline: "15px",
              }}
            >
              <label
                htmlFor="password"
                style={{
                  textAlign: "left",
                  fontFamily: "sans-serif",
                  fontStyle: "unset",
                  fontSize: "16px",
                  lineHeight: 1.5 / 1,
                }}
              >
                Password
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "20px",
                  outlineWidth: "1px",
                  outlineOffset: "1px",
                  outlineColor: "#d1d5dc",
                  marginTop: "5px",
                }}
              >
                <input
                  id="password"
                  name="password"
                  className="passwordInput h-8 border-2 border-gray-500"
                  style={{
                    minWidth: 0,
                    paddingBlock: "6px",
                    paddingRight: "10px",
                    paddingLeft: "12px",
                    flexGrow: 1,
                    fontSize: "16px",
                    lineHeight: 1.5 / 1,
                    color: "#101828",
                    borderRadius: "4px",
                    outlineWidth: "1px",
                    outlineOffset: "1px",
                    outlineColor: "#d1d5dc",
                  }}
                  ref={Password}
                  type="text"
                  placeholder="Password"
                  onFocus={(e) => {
                    var parent = e.currentTarget.parentElement;
                    if (parent != null) {
                      parent.style.outlineWidth = "2px";
                      parent.style.outlineOffset = "2px";
                      parent.style.outlineColor = "#4f39f6";
                    }
                  }}
                />
              </div>
            </div>
            <div
              style={{
                backgroundColor: "transparent",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                columnGap: "5px",
                height: "50px",
                paddingInline: "15px",
                marginBottom: "20px",
              }}
            >
              <button
                onClick={async () => {
                  if (Email.current !== null && Password.current !== null) {
                    if (
                      Email.current.value !== "" &&
                      Password.current.value !== ""
                    ) {
                      try {
                        const login: LoginDto = {
                          Email: Email.current.value,
                          Password: Password.current.value,
                        };
                        const response = await fetch(
                          `${API_BASE_URL}/Auth/login`,
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify(login),
                          }
                        );

                        if (!response.ok) {
                          toast.error("Login Failed!", {
                            position: "top-right",
                          });
                          throw new Error(
                            `HTTP error! status: ${response.status}`
                          );
                        } else {
                          const data = await response.json();
                          const { newToken } = data;
                          try {
                            const secondResponse = await fetch(
                              `${API_BASE_URL}/Auth/me/${newToken}`,
                              {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                              }
                            );

                            if (!secondResponse.ok) {
                              toast.error("Login Failed!", {
                                position: "top-right",
                              });
                              throw new Error(
                                `HTTP error! status: ${secondResponse.status}`
                              );
                            } else {
                              const { roles } = await secondResponse.json();

                              for (var i = 0; i < roles.length; i++) {
                                if (roles[i] === "ADMIN") {
                                  navigate("/admin");
                                  break;
                                }
                              }

                              if (!roles.some((role) => role === "ADMIN"))
                                window.location.reload();
                            }
                          } catch (error) {
                            toast.error("Login Failed!", {
                              position: "top-right",
                            });
                            console.error("Error", error);
                          }
                          setCookie("LMS", newToken, 20);
                          toast.success("You are welcome!", {
                            position: "top-right",
                          });
                          console.log("Success", data);
                          Email.current.textContent = "";
                          Password.current.textContent = "";
                        }
                      } catch (error) {
                        toast.error("Login Failed!", {
                          position: "top-right",
                        });
                        console.error("Error", error);
                      }
                    }
                  }
                }}
                style={{
                  width: "100%",
                  height: "50px",
                  color: "#edf2f0",
                  fontSize: "20px",
                  lineHeight: 1.5 / 1,
                  backgroundColor: "#177b36",
                  textAlign: "center",
                  padding: 0,
                }}
              >
                Login
              </button>
            </div>
            <div
              style={{
                backgroundColor: "transparent",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                columnGap: "5px",
                height: "50px",
                paddingInline: "15px",
              }}
            >
              <button
                style={{
                  width: "100%",
                  height: "50px",
                  color: "#edf2f0",
                  fontSize: "20px",
                  lineHeight: 1.5 / 1,
                  backgroundColor: "#0996b8",
                  textAlign: "center",
                  padding: 0,
                }}
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
            </div>
            <Link
              to="/"
              style={{
                marginTop: "15px",
                height: "23px",
                width: "250px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                columnGap: "10px",
                marginLeft: "3%",
                color: "#0996b8",
                fontSize: "18px",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: "10%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "inherit",
                }}
              >
                <RxDoubleArrowLeft
                  style={{
                    color: "inherit",
                  }}
                  width={"32"}
                  height={"32"}
                />{" "}
              </div>

              <h6
                style={{
                  height: "100%",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  width: "90%",
                  wordSpacing: "5px",
                  color: "inherit",
                }}
              >
                {" "}
                Back to Home Page
              </h6>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
