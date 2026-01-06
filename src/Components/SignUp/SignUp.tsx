import { useFormik } from "formik";
import { useState, useEffect } from "react";
import { RxDoubleArrowLeft } from "react-icons/rx";
import { Link } from "react-router";
import * as Yup from "yup";
import { onlyAlphabetics, onlyNumbers } from "../../Fuctions";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import { API_BASE_URL } from "../../Constants";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*?])[a-zA-Z\d!@#$%&*?]{8,}$/gi;
const SignupSchema = Yup.object().shape({
  userName: Yup.string()
    .min(10, "Too Short!")
    .max(70, "Too Long!")
    .required("Required"),
  dateOfBirth: Yup.date()
    .required("Date of birth is required")
    .max(new Date(), "Date cannot be in the future"),
  state: Yup.string().required("Required"),
  password: Yup.string()
    .min(8, "Too Short!")
    .matches(
      passwordRegex,
      "Password must include uppercase, lowercase, number, and special character"
    ),
  contactNumber: Yup.number().required("Required"),
  city: Yup.string().required("Required"),
  fullName: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  PIN: Yup.number().required("Required"),
  FullAddress: Yup.string().min(12, "Too Short!").required("Required"),
});

interface RegisterDto {
  userName: string;
  dateOfBirth: string;
  state: string;
  password: string;
  contactNumber: string;
  city: string;
  fullName: string;
  email: string;
  pin: string;
  fullAddress: string;
}
const SignUp = () => {
  const formik = useFormik({
    initialValues: {
      userName: "",
      dateOfBirth: "2002-08-03",
      state: "",
      password: "",
      contactNumber: 0,
      city: "",
      fullName: "",
      email: "",
      PIN: 96,
      FullAddress: "",
    },
    validationSchema: SignupSchema,
    onSubmit: async () => {
      try {
        const register: RegisterDto = {
          userName: formik.values.userName,
          dateOfBirth: formik.values.dateOfBirth,
          state: formik.values.state,
          password: formik.values.password,
          contactNumber: formik.values.contactNumber.toString(),
          city: formik.values.city,
          fullName: formik.values.fullName,
          email: formik.values.email,
          pin: formik.values.PIN.toString(),
          fullAddress: formik.values.FullAddress,
        };
        const response = await fetch(`${API_BASE_URL}/Auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(register),
        });

        if (!response.ok) {
          Swal.fire({
            title: "Error Message",
            text: "Registeration is failed!.",
            icon: "error",
            confirmButtonColor: "#013d81",
          });
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          const data = await response.text();
          Swal.fire({
            title: "Success Message",
            text: "Registeration is completed successfully",
            icon: "success",
            confirmButtonColor: "#013d81",
          });
          console.log("Success", data);
          formik.handleReset(() => formik.resetForm());
        }
      } catch (error) {
        Swal.fire({
          title: "Error Messaage",
          text: "Registeration is failed!.",
          icon: "error",
          confirmButtonColor: "#013d81",
        });
        console.error("Error", error);
      }
    },
  });

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
        width: "100%",
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
        className="h-[1280px] md:h-[1200px] w-full"
        style={{
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
        {/* SignUp main container */}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            formik.handleSubmit();
          }}
          className="h-full w-full md:w-[70%]"
          style={{
            borderLeftStyle: "solid",
            borderLeftWidth: "medium",
            borderLeftColor: "#489aaf",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              textAlign: "initial",
              marginTop: "10px",
              marginLeft: "50px",
              marginBottom: "10px",
            }}
          >
            Sign Up
          </h2>
          <div
            className="h-[1110px] md:h-[650px]"
            style={{
              width: "80%",
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
              <img src="/public/sign-up.png" width={"128px"} height={"128px"} />
            </div>
            <h3
              style={{
                fontSize: "20px",
                textAlign: "center",
                margin: 0,
                marginBottom: "10px",
              }}
            >
              User Sign Up
            </h3>
            <div className="hidden md:flex flex-row gap-x-2.5 mb-1.5">
              <div
                style={{
                  width: "30%",
                  backgroundColor: "transparent",
                  display: "flex",
                  flexDirection: "column",
                  columnGap: "5px",
                  height: "80px",
                  paddingInline: "15px",
                }}
              >
                <label
                  htmlFor="userName"
                  style={{
                    textAlign: "left",
                    fontFamily: "sans-serif",
                    fontStyle: "unset",
                    fontSize: "16px",
                    lineHeight: 1.5 / 1,
                  }}
                >
                  UserName
                </label>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    columnGap: "2px",
                    borderRadius: "20px",
                    outlineWidth: "1px",
                    outlineOffset: "1px",
                    outlineColor: "#d1d5dc",
                    marginTop: "5px",
                  }}
                >
                  <input
                    id="userName"
                    name="userName"
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
                    type="text"
                    placeholder="UserName"
                    value={formik.values.userName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    onFocus={(e) => {
                      var parent = e.currentTarget.parentElement;
                      if (parent != null) {
                        parent.style.outlineWidth = "2px";
                        parent.style.outlineOffset = "2px";
                        parent.style.outlineColor = "#4f39f6";
                      }
                    }}
                  />
                  {formik.touched.userName && formik.errors.userName && (
                    <span style={{ color: "red", textAlign: "left" }}>
                      {formik.errors.userName}
                    </span>
                  )}
                </div>
              </div>
              <div
                style={{
                  width: "30%",
                  backgroundColor: "transparent",
                  display: "flex",
                  flexDirection: "column",
                  columnGap: "5px",
                  height: "80px",
                  paddingInline: "15px",
                }}
              >
                <label
                  htmlFor="date_of_Birth"
                  style={{
                    textAlign: "left",
                    fontFamily: "sans-serif",
                    fontStyle: "unset",
                    fontSize: "16px",
                    lineHeight: 1.5 / 1,
                  }}
                >
                  Date of Birth
                </label>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    columnGap: "2px",
                    borderRadius: "20px",
                    outlineWidth: "1px",
                    outlineOffset: "1px",
                    outlineColor: "#d1d5dc",
                    marginTop: "5px",
                  }}
                >
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formik.values.dateOfBirth}
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
                    type="date"
                    placeholder="Birth Date"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    onFocus={(e) => {
                      var parent = e.currentTarget.parentElement;
                      if (parent != null) {
                        parent.style.outlineWidth = "2px";
                        parent.style.outlineOffset = "2px";
                        parent.style.outlineColor = "#4f39f6";
                      }
                    }}
                  />
                  {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                    <span style={{ color: "red", textAlign: "left" }}>
                      {formik.errors.dateOfBirth}
                    </span>
                  )}
                </div>
              </div>
              <div
                style={{
                  width: "30%",
                  backgroundColor: "transparent",
                  display: "flex",
                  flexDirection: "column",
                  columnGap: "5px",
                  height: "80px",
                  paddingInline: "15px",
                }}
              >
                <label
                  htmlFor="State"
                  style={{
                    textAlign: "left",
                    fontFamily: "sans-serif",
                    fontStyle: "unset",
                    fontSize: "16px",
                    lineHeight: 1.5 / 1,
                  }}
                >
                  State
                </label>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    columnGap: "2px",
                    borderRadius: "20px",
                    outlineWidth: "1px",
                    outlineOffset: "1px",
                    outlineColor: "#d1d5dc",
                    marginTop: "5px",
                  }}
                >
                  <select
                    id="state"
                    name="state"
                    value={formik.values.state}
                    onChange={formik.handleChange}
                    className="userNameInput h-8 border-2 border-gray-500"
                    style={{
                      height: "35px",
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
                    onFocus={(e) => {
                      var parent = e.currentTarget.parentElement;
                      if (parent != null) {
                        parent.style.outlineWidth = "2px";
                        parent.style.outlineOffset = "2px";
                        parent.style.outlineColor = "#4f39f6";
                      }
                    }}
                  >
                    <option value="" selected={true}>
                      Select
                    </option>
                    <option value="cairo">Cairo (القاهرة)</option>
                    <option value="alexandria">Alexandria (الإسكندرية)</option>
                    <option value="giza">Giza (الجيزة)</option>
                    <option value="dakahlia">Dakahlia (دمياط)</option>
                    <option value="damietta">Damietta (دمياط)</option>
                    <option value="red_sea">Red Sea (البحر الأحمر)</option>
                    <option value="beheira">Beheira (البحيرة)</option>
                    <option value="fayoum">Fayoum (الفيوم)</option>
                    <option value="beni_suef">Beni Suef (بني سويف)</option>
                    <option value="qalyubia">Qalyubia (القليوبية)</option>
                    <option value="minya">Minya (المنيا)</option>
                    <option value="assuit">Asyut (أسيوط)</option>
                    <option value="suef">Sohag (سوهاج)</option>
                    <option value="aswan">Aswan (أسوان)</option>
                    <option value="nst_wl">New Valley (الوادي الجديد)</option>
                    <option value="behera_alt">Beheira (البحيرة)</option>
                    <option value="slm">Sharkia (الشرقية)</option>
                    <option value="monufia">Monufia (المنوفية)</option>
                    <option value="qena">Qena (قنا)</option>
                    <option value="matruh">Matrouh (مطروح)</option>
                    <option value="north_sinai">
                      North Sinai (شمال سيناء)
                    </option>
                    <option value="south_sinai">
                      South Sinai (جنوب سيناء)
                    </option>
                    <option value="siwa">Siwa Oasis (سمـاو/سـواء)</option>
                  </select>
                  {formik.touched.state && formik.errors.state && (
                    <span style={{ color: "red", textAlign: "left" }}>
                      {formik.errors.state}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full bg-transparent flex flex-col gap-y-1.5 h-20 px-4 md:hidden">
              <label
                htmlFor="userName"
                style={{
                  textAlign: "left",
                  fontFamily: "sans-serif",
                  fontStyle: "unset",
                  fontSize: "16px",
                  lineHeight: 1.5 / 1,
                }}
              >
                UserName
              </label>
              <div
                className="w-full"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  columnGap: "2px",
                  borderRadius: "20px",
                  outlineWidth: "1px",
                  outlineOffset: "1px",
                  outlineColor: "#d1d5dc",
                  marginTop: "5px",
                }}
              >
                <input
                  id="userName"
                  name="userName"
                  className="userNameInput h-8 border-2 border-gray-500 w-[99%] mr-auto"
                  style={{
                    height: "32px",
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
                  type="text"
                  placeholder="UserName"
                  value={formik.values.userName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  onFocus={(e) => {
                    var parent = e.currentTarget.parentElement;
                    if (parent != null) {
                      parent.style.outlineWidth = "2px";
                      parent.style.outlineOffset = "2px";
                      parent.style.outlineColor = "#4f39f6";
                    }
                  }}
                />
                {formik.touched.userName && formik.errors.userName && (
                  <span style={{ color: "red", textAlign: "left" }}>
                    {formik.errors.userName}
                  </span>
                )}
              </div>
            </div>
            <div className="w-full bg-transparent flex flex-col gap-y-1.5 h-20 px-4 md:hidden">
              <label
                htmlFor="date_of_Birth"
                style={{
                  textAlign: "left",
                  fontFamily: "sans-serif",
                  fontStyle: "unset",
                  fontSize: "16px",
                  lineHeight: 1.5 / 1,
                }}
              >
                Date of Birth
              </label>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  columnGap: "2px",
                  borderRadius: "20px",
                  outlineWidth: "1px",
                  outlineOffset: "1px",
                  outlineColor: "#d1d5dc",
                  marginTop: "5px",
                }}
              >
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formik.values.dateOfBirth}
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
                  type="date"
                  placeholder="Birth Date"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  onFocus={(e) => {
                    var parent = e.currentTarget.parentElement;
                    if (parent != null) {
                      parent.style.outlineWidth = "2px";
                      parent.style.outlineOffset = "2px";
                      parent.style.outlineColor = "#4f39f6";
                    }
                  }}
                />
                {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                  <span style={{ color: "red", textAlign: "left" }}>
                    {formik.errors.dateOfBirth}
                  </span>
                )}
              </div>
            </div>
            <div className="w-full bg-transparent flex flex-col gap-y-1.5 h-20 px-4 md:hidden">
              <label
                htmlFor="State"
                style={{
                  textAlign: "left",
                  fontFamily: "sans-serif",
                  fontStyle: "unset",
                  fontSize: "16px",
                  lineHeight: 1.5 / 1,
                }}
              >
                State
              </label>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  columnGap: "2px",
                  borderRadius: "20px",
                  outlineWidth: "1px",
                  outlineOffset: "1px",
                  outlineColor: "#d1d5dc",
                  marginTop: "5px",
                }}
              >
                <select
                  id="state"
                  name="state"
                  value={formik.values.state}
                  onChange={formik.handleChange}
                  className="userNameInput border-2 border-gray-500"
                  style={{
                    height: "35px",
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
                  onFocus={(e) => {
                    var parent = e.currentTarget.parentElement;
                    if (parent != null) {
                      parent.style.outlineWidth = "2px";
                      parent.style.outlineOffset = "2px";
                      parent.style.outlineColor = "#4f39f6";
                    }
                  }}
                >
                  <option value="" selected={true}>
                    Select
                  </option>
                  <option value="cairo">Cairo (القاهرة)</option>
                  <option value="alexandria">Alexandria (الإسكندرية)</option>
                  <option value="giza">Giza (الجيزة)</option>
                  <option value="dakahlia">Dakahlia (دمياط)</option>
                  <option value="damietta">Damietta (دمياط)</option>
                  <option value="red_sea">Red Sea (البحر الأحمر)</option>
                  <option value="beheira">Beheira (البحيرة)</option>
                  <option value="fayoum">Fayoum (الفيوم)</option>
                  <option value="beni_suef">Beni Suef (بني سويف)</option>
                  <option value="qalyubia">Qalyubia (القليوبية)</option>
                  <option value="minya">Minya (المنيا)</option>
                  <option value="assuit">Asyut (أسيوط)</option>
                  <option value="suef">Sohag (سوهاج)</option>
                  <option value="aswan">Aswan (أسوان)</option>
                  <option value="nst_wl">New Valley (الوادي الجديد)</option>
                  <option value="behera_alt">Beheira (البحيرة)</option>
                  <option value="slm">Sharkia (الشرقية)</option>
                  <option value="monufia">Monufia (المنوفية)</option>
                  <option value="qena">Qena (قنا)</option>
                  <option value="matruh">Matrouh (مطروح)</option>
                  <option value="north_sinai">North Sinai (شمال سيناء)</option>
                  <option value="south_sinai">South Sinai (جنوب سيناء)</option>
                  <option value="siwa">Siwa Oasis (سمـاو/سـواء)</option>
                </select>
                {formik.touched.state && formik.errors.state && (
                  <span style={{ color: "red", textAlign: "left" }}>
                    {formik.errors.state}
                  </span>
                )}
              </div>
            </div>
            <div className="hidden md:flex flex-row gap-x-2.5 mb-1.5">
              <div
                style={{
                  width: "30%",
                  backgroundColor: "transparent",
                  display: "flex",
                  flexDirection: "column",
                  columnGap: "5px",
                  height: "80px",
                  paddingInline: "15px",
                }}
              >
                <label
                  htmlFor="Password"
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
                    flexDirection: "column",
                    columnGap: "2px",
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
                    value={formik.values.password}
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
                    type="text"
                    placeholder="Password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    onFocus={(e) => {
                      var parent = e.currentTarget.parentElement;
                      if (parent != null) {
                        parent.style.outlineWidth = "2px";
                        parent.style.outlineOffset = "2px";
                        parent.style.outlineColor = "#4f39f6";
                      }
                    }}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <span style={{ color: "red", textAlign: "left" }}>
                      {formik.errors.password}
                    </span>
                  )}
                </div>
              </div>
              <div
                style={{
                  width: "30%",
                  backgroundColor: "transparent",
                  display: "flex",
                  flexDirection: "column",
                  columnGap: "5px",
                  height: "80px",
                  paddingInline: "15px",
                }}
              >
                <label
                  htmlFor="contactNumber"
                  style={{
                    textAlign: "left",
                    fontFamily: "sans-serif",
                    fontStyle: "unset",
                    fontSize: "16px",
                    lineHeight: 1.5 / 1,
                  }}
                >
                  Contact No.
                </label>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    columnGap: "2px",
                    borderRadius: "20px",
                    outlineWidth: "1px",
                    outlineOffset: "1px",
                    outlineColor: "#d1d5dc",
                    marginTop: "5px",
                  }}
                >
                  <input
                    id="contactNumber"
                    name="contactNumber"
                    value={formik.values.contactNumber}
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
                    type="tel"
                    placeholder="Contact Number"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    onKeyDown={onlyNumbers}
                    onFocus={(e) => {
                      var parent = e.currentTarget.parentElement;
                      if (parent != null) {
                        parent.style.outlineWidth = "2px";
                        parent.style.outlineOffset = "2px";
                        parent.style.outlineColor = "#4f39f6";
                      }
                    }}
                  />
                  {formik.touched.contactNumber &&
                    formik.errors.contactNumber && (
                      <span style={{ color: "red", textAlign: "left" }}>
                        {formik.errors.contactNumber}
                      </span>
                    )}
                </div>
              </div>
              <div
                style={{
                  width: "30%",
                  backgroundColor: "transparent",
                  display: "flex",
                  flexDirection: "column",
                  columnGap: "5px",
                  height: "80px",
                  paddingInline: "15px",
                }}
              >
                <label
                  htmlFor="City"
                  style={{
                    textAlign: "left",
                    fontFamily: "sans-serif",
                    fontStyle: "unset",
                    fontSize: "16px",
                    lineHeight: 1.5 / 1,
                  }}
                >
                  City
                </label>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    columnGap: "2px",
                    borderRadius: "20px",
                    outlineWidth: "1px",
                    outlineOffset: "1px",
                    outlineColor: "#d1d5dc",
                    marginTop: "5px",
                  }}
                >
                  <input
                    id="city"
                    name="city"
                    value={formik.values.city}
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
                    type="text"
                    placeholder="City"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    onKeyDown={onlyAlphabetics}
                    onFocus={(e) => {
                      var parent = e.currentTarget.parentElement;
                      if (parent != null) {
                        parent.style.outlineWidth = "2px";
                        parent.style.outlineOffset = "2px";
                        parent.style.outlineColor = "#4f39f6";
                      }
                    }}
                  />
                  {formik.touched.city && formik.errors.city && (
                    <span style={{ color: "red", textAlign: "left" }}>
                      {formik.errors.city}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full bg-transparent flex flex-col gap-y-1.5 h-20 px-4 md:hidden">
              <label
                htmlFor="Password"
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
                  flexDirection: "column",
                  columnGap: "2px",
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
                  value={formik.values.password}
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
                  type="text"
                  placeholder="Password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  onFocus={(e) => {
                    var parent = e.currentTarget.parentElement;
                    if (parent != null) {
                      parent.style.outlineWidth = "2px";
                      parent.style.outlineOffset = "2px";
                      parent.style.outlineColor = "#4f39f6";
                    }
                  }}
                />
                {formik.touched.password && formik.errors.password && (
                  <span style={{ color: "red", textAlign: "left" }}>
                    {formik.errors.password}
                  </span>
                )}
              </div>
            </div>
            <div className="w-full bg-transparent flex flex-col gap-y-1.5 h-20 px-4 md:hidden">
              <label
                htmlFor="contactNumber"
                style={{
                  textAlign: "left",
                  fontFamily: "sans-serif",
                  fontStyle: "unset",
                  fontSize: "16px",
                  lineHeight: 1.5 / 1,
                }}
              >
                Contact No.
              </label>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  columnGap: "2px",
                  borderRadius: "20px",
                  outlineWidth: "1px",
                  outlineOffset: "1px",
                  outlineColor: "#d1d5dc",
                  marginTop: "5px",
                }}
              >
                <input
                  id="contactNumber"
                  name="contactNumber"
                  value={formik.values.contactNumber}
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
                  type="tel"
                  placeholder="Contact Number"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  onKeyDown={onlyNumbers}
                  onFocus={(e) => {
                    var parent = e.currentTarget.parentElement;
                    if (parent != null) {
                      parent.style.outlineWidth = "2px";
                      parent.style.outlineOffset = "2px";
                      parent.style.outlineColor = "#4f39f6";
                    }
                  }}
                />
                {formik.touched.contactNumber &&
                  formik.errors.contactNumber && (
                    <span style={{ color: "red", textAlign: "left" }}>
                      {formik.errors.contactNumber}
                    </span>
                  )}
              </div>
            </div>
            <div className="w-full bg-transparent flex flex-col gap-y-1.5 h-20 px-4 md:hidden">
              <label
                htmlFor="City"
                style={{
                  textAlign: "left",
                  fontFamily: "sans-serif",
                  fontStyle: "unset",
                  fontSize: "16px",
                  lineHeight: 1.5 / 1,
                }}
              >
                City
              </label>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  columnGap: "2px",
                  borderRadius: "20px",
                  outlineWidth: "1px",
                  outlineOffset: "1px",
                  outlineColor: "#d1d5dc",
                  marginTop: "5px",
                }}
              >
                <input
                  id="city"
                  name="city"
                  value={formik.values.city}
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
                  type="text"
                  placeholder="City"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  onKeyDown={onlyAlphabetics}
                  onFocus={(e) => {
                    var parent = e.currentTarget.parentElement;
                    if (parent != null) {
                      parent.style.outlineWidth = "2px";
                      parent.style.outlineOffset = "2px";
                      parent.style.outlineColor = "#4f39f6";
                    }
                  }}
                />
                {formik.touched.city && formik.errors.city && (
                  <span style={{ color: "red", textAlign: "left" }}>
                    {formik.errors.city}
                  </span>
                )}
              </div>
            </div>
            <div className="hidden md:flex flex-row gap-x-2.5 mb-1.5">
              {" "}
              <div
                style={{
                  width: "30%",
                  backgroundColor: "transparent",
                  display: "flex",
                  flexDirection: "column",
                  columnGap: "5px",
                  height: "80px",
                  paddingInline: "15px",
                }}
              >
                <label
                  htmlFor="fullName"
                  style={{
                    textAlign: "left",
                    fontFamily: "sans-serif",
                    fontStyle: "unset",
                    fontSize: "16px",
                    lineHeight: 1.5 / 1,
                  }}
                >
                  Full Name
                </label>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    columnGap: "2px",
                    borderRadius: "20px",
                    outlineWidth: "1px",
                    outlineOffset: "1px",
                    outlineColor: "#d1d5dc",
                    marginTop: "5px",
                  }}
                >
                  <input
                    id="fullName"
                    name="fullName"
                    value={formik.values.fullName}
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
                    type="text"
                    placeholder="Full Name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    onKeyDown={onlyAlphabetics}
                    onFocus={(e) => {
                      var parent = e.currentTarget.parentElement;
                      if (parent != null) {
                        parent.style.outlineWidth = "2px";
                        parent.style.outlineOffset = "2px";
                        parent.style.outlineColor = "#4f39f6";
                      }
                    }}
                    onKeyUp={(e) => {
                      let char = e.currentTarget.value;
                      let cleanedChar = char.replace(/[^a-zA-Z]/gi, "");
                      e.currentTarget.value = cleanedChar;
                    }}
                  />
                  {formik.touched.fullName && formik.errors.fullName && (
                    <span style={{ color: "red", textAlign: "left" }}>
                      {formik.errors.fullName}
                    </span>
                  )}
                </div>
              </div>
              <div
                style={{
                  width: "30%",
                  backgroundColor: "transparent",
                  display: "flex",
                  flexDirection: "column",
                  columnGap: "5px",
                  height: "80px",
                  paddingInline: "15px",
                }}
              >
                <label
                  htmlFor="Email"
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
                    flexDirection: "column",
                    columnGap: "2px",
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
                    value={formik.values.email}
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
                    type="text"
                    placeholder="Email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    onFocus={(e) => {
                      var parent = e.currentTarget.parentElement;
                      if (parent != null) {
                        parent.style.outlineWidth = "2px";
                        parent.style.outlineOffset = "2px";
                        parent.style.outlineColor = "#4f39f6";
                      }
                    }}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <span style={{ color: "red", textAlign: "left" }}>
                      {formik.errors.email}
                    </span>
                  )}
                </div>
              </div>
              <div
                style={{
                  width: "30%",
                  backgroundColor: "transparent",
                  display: "flex",
                  flexDirection: "column",
                  columnGap: "5px",
                  height: "80px",
                  paddingInline: "15px",
                }}
              >
                <label
                  htmlFor="PIN"
                  style={{
                    textAlign: "left",
                    fontFamily: "sans-serif",
                    fontStyle: "unset",
                    fontSize: "16px",
                    lineHeight: 1.5 / 1,
                  }}
                >
                  PIN
                </label>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    columnGap: "2px",
                    borderRadius: "20px",
                    outlineWidth: "1px",
                    outlineOffset: "1px",
                    outlineColor: "#d1d5dc",
                    marginTop: "5px",
                  }}
                >
                  <input
                    id="PIN"
                    name="PIN"
                    value={formik.values.PIN}
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
                    type="tel"
                    placeholder="PIN CODE"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    onFocus={(e) => {
                      var parent = e.currentTarget.parentElement;
                      if (parent != null) {
                        parent.style.outlineWidth = "2px";
                        parent.style.outlineOffset = "2px";
                        parent.style.outlineColor = "#4f39f6";
                      }
                    }}
                    onKeyDown={onlyNumbers}
                  />
                  {formik.touched.PIN && formik.errors.PIN && (
                    <span style={{ color: "red", textAlign: "left" }}>
                      {formik.errors.PIN}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full bg-transparent flex flex-col gap-y-1.5 h-20 px-4 md:hidden">
              <label
                htmlFor="fullName"
                style={{
                  textAlign: "left",
                  fontFamily: "sans-serif",
                  fontStyle: "unset",
                  fontSize: "16px",
                  lineHeight: 1.5 / 1,
                }}
              >
                Full Name
              </label>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  columnGap: "2px",
                  borderRadius: "20px",
                  outlineWidth: "1px",
                  outlineOffset: "1px",
                  outlineColor: "#d1d5dc",
                  marginTop: "5px",
                }}
              >
                <input
                  id="fullName"
                  name="fullName"
                  value={formik.values.fullName}
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
                  type="text"
                  placeholder="Full Name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  onKeyDown={onlyAlphabetics}
                  onFocus={(e) => {
                    var parent = e.currentTarget.parentElement;
                    if (parent != null) {
                      parent.style.outlineWidth = "2px";
                      parent.style.outlineOffset = "2px";
                      parent.style.outlineColor = "#4f39f6";
                    }
                  }}
                  onKeyUp={(e) => {
                    let char = e.currentTarget.value;
                    let cleanedChar = char.replace(/[^a-zA-Z]/gi, "");
                    e.currentTarget.value = cleanedChar;
                  }}
                />
                {formik.touched.fullName && formik.errors.fullName && (
                  <span style={{ color: "red", textAlign: "left" }}>
                    {formik.errors.fullName}
                  </span>
                )}
              </div>
            </div>
            <div className="w-full bg-transparent flex flex-col gap-y-1.5 h-20 px-4 md:hidden">
              <label
                htmlFor="Email"
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
                  flexDirection: "column",
                  columnGap: "2px",
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
                  value={formik.values.email}
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
                  type="text"
                  placeholder="Email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  onFocus={(e) => {
                    var parent = e.currentTarget.parentElement;
                    if (parent != null) {
                      parent.style.outlineWidth = "2px";
                      parent.style.outlineOffset = "2px";
                      parent.style.outlineColor = "#4f39f6";
                    }
                  }}
                />
                {formik.touched.email && formik.errors.email && (
                  <span style={{ color: "red", textAlign: "left" }}>
                    {formik.errors.email}
                  </span>
                )}
              </div>
            </div>
            <div className="w-full bg-transparent flex flex-col gap-y-1.5 h-20 px-4 md:hidden">
              <label
                htmlFor="PIN"
                style={{
                  textAlign: "left",
                  fontFamily: "sans-serif",
                  fontStyle: "unset",
                  fontSize: "16px",
                  lineHeight: 1.5 / 1,
                }}
              >
                PIN
              </label>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  columnGap: "2px",
                  borderRadius: "20px",
                  outlineWidth: "1px",
                  outlineOffset: "1px",
                  outlineColor: "#d1d5dc",
                  marginTop: "5px",
                }}
              >
                <input
                  id="PIN"
                  name="PIN"
                  value={formik.values.PIN}
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
                  type="tel"
                  placeholder="PIN CODE"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  onFocus={(e) => {
                    var parent = e.currentTarget.parentElement;
                    if (parent != null) {
                      parent.style.outlineWidth = "2px";
                      parent.style.outlineOffset = "2px";
                      parent.style.outlineColor = "#4f39f6";
                    }
                  }}
                  onKeyDown={onlyNumbers}
                />
                {formik.touched.PIN && formik.errors.PIN && (
                  <span style={{ color: "red", textAlign: "left" }}>
                    {formik.errors.PIN}
                  </span>
                )}
              </div>
            </div>
            <div
              className="hidden w-full bg-transparent md:flex flex-col gap-y-1.5 h-20 px-4"
              style={{
                marginBottom: "12px",
              }}
            >
              <label
                htmlFor="FullAddress"
                style={{
                  textAlign: "left",
                  fontFamily: "sans-serif",
                  fontStyle: "unset",
                  fontSize: "16px",
                  lineHeight: 1.5 / 1,
                }}
              >
                Full Address
              </label>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  columnGap: "2px",
                  borderRadius: "20px",
                  outlineWidth: "1px",
                  outlineOffset: "1px",
                  outlineColor: "#d1d5dc",
                  marginTop: "5px",
                }}
              >
                <input
                  id="FullAddress"
                  name="FullAddress"
                  value={formik.values.FullAddress}
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
                  type="text"
                  placeholder="Full Address"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  onFocus={(e) => {
                    var parent = e.currentTarget.parentElement;
                    if (parent != null) {
                      parent.style.outlineWidth = "2px";
                      parent.style.outlineOffset = "2px";
                      parent.style.outlineColor = "#4f39f6";
                    }
                  }}
                />
                {formik.touched.FullAddress && formik.errors.FullAddress && (
                  <span style={{ color: "red", textAlign: "left" }}>
                    {formik.errors.FullAddress}
                  </span>
                )}
              </div>
            </div>
            <div className="w-full bg-transparent flex flex-col gap-y-1.5 h-20 px-4 md:hidden">
              <label
                htmlFor="FullAddress"
                style={{
                  textAlign: "left",
                  fontFamily: "sans-serif",
                  fontStyle: "unset",
                  fontSize: "16px",
                  lineHeight: 1.5 / 1,
                }}
              >
                Full Address
              </label>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  columnGap: "2px",
                  borderRadius: "20px",
                  outlineWidth: "1px",
                  outlineOffset: "1px",
                  outlineColor: "#d1d5dc",
                  marginTop: "5px",
                }}
              >
                <input
                  id="FullAddress"
                  name="FullAddress"
                  value={formik.values.FullAddress}
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
                  type="text"
                  placeholder="Full Address"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  onFocus={(e) => {
                    var parent = e.currentTarget.parentElement;
                    if (parent != null) {
                      parent.style.outlineWidth = "2px";
                      parent.style.outlineOffset = "2px";
                      parent.style.outlineColor = "#4f39f6";
                    }
                  }}
                />
                {formik.touched.FullAddress && formik.errors.FullAddress && (
                  <span style={{ color: "red", textAlign: "left" }}>
                    {formik.errors.FullAddress}
                  </span>
                )}
              </div>
            </div>

            <div
              className="w-full mt-5 md:w-[30%]"
              style={{
                backgroundColor: "transparent",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                columnGap: "5px",
                height: "50px",
                paddingInline: "15px",
                marginBottom: "5px",
              }}
            >
              <button
                type="submit"
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
                Sign Up
              </button>
            </div>

            <Link
              to="/"
              className="w-[250px] mt-2"
              style={{
                height: "23px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                columnGap: "10px",
                marginLeft: "10px",
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
        </form>
      </div>
    </div>
  );
};

export default SignUp;
