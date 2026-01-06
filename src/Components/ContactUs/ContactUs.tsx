import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../../Constants";

const SignupSchema = Yup.object().shape({
  Name: Yup.string()
    .min(10, "Too Short!")
    .max(70, "Too Long!")
    .required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),

  CommentsOrQuestions: Yup.string().min(12, "Too Short!").required("Required"),
});
interface ContactDto {
  Name: string;
  email: string;
  CommentsOrQuestions: string;
}
export const ContactUs = () => {
  const formik = useFormik({
    initialValues: {
      Name: "",
      email: "",
      CommentsOrQuestions: "",
    },
    validationSchema: SignupSchema,
    onSubmit: async () => {
      try {
        const contact: ContactDto = {
          Name: formik.values.Name,
          email: formik.values.email,
          CommentsOrQuestions: formik.values.CommentsOrQuestions,
        };
        const response = await fetch(`${API_BASE_URL}/Auth/contact`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contact),
        });

        if (!response.ok) {
          toast.error("Message is not Sent!", {
            position: "top-right",
          });
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          const data = await response.text();
          toast.success("Message Sent!", {
            position: "top-right",
          });
          console.log("Success", data);
          formik.handleReset(() => formik.resetForm());
        }
      } catch (error) {
        toast.error("Message is not Sent!", {
          position: "top-right",
        });
        console.error("Error", error);
      }
    },
  });

  const [openNavForMobileDesign, setOpenNavForMobileDesign] =
    useState<boolean>(false);
  const [contactDivWidth, setContactDivWidth] = useState<number>(
    window.innerWidth
  );
  const [contactDivHeight, setContactDivHeight] = useState<number>(
    window.innerHeight
  );
  useEffect(() => {
    function handleResizing() {
      setContactDivWidth(window.innerWidth);
      setContactDivHeight(window.innerHeight);
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
          height: `${contactDivHeight}px`,
          width: `${contactDivWidth}px`,
          position: "relative",
          top: 0,
          left: `${contactDivWidth}`,
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
      className="flex flex-col"
      style={{ width: `${contactDivWidth}px`, height: `${contactDivHeight}px` }}
    >
      <div
        style={{ backgroundColor: "#eaf3f4" }}
        className="flex flex-col w-full h-72"
      >
        <div className="w-full flex justify-start ml-[5%] md:ml-0 md:justify-center items-center h-28 md:h-40">
          <h2 className="font-robotoBold text-black text-5xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl">
            Contact Us
          </h2>
        </div>
        <div className="w-full flex justify-start ml-[5%] md:ml-0 md:justify-center items-center h-20">
          {" "}
          <h2 className="text-black font-robotoLight text-3xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl">
            A human always responds, no bots!
          </h2>
        </div>
        <div className="flex flex-row justify-end items-center pr-10 md:hidden">
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
      <form
        className="flex justify-center items-center h-[900px] md:h-[850px] w-full"
        style={{ backgroundColor: "#eaf3f4" }}
      >
        <div className="w-[87%] md:mx-0 md:w-[80%] 2xl:w-1/2 bg-white h-[92%] md:h-[90%] shadow-lg rounded-xl px-5 pt-11">
          <div className="font-robotoRegular w-full bg-transparent flex flex-col gap-y-1.5 h-28 px-4 text-lg mb-10">
            <label
              htmlFor="Name"
              style={{
                textAlign: "left",
                fontFamily: "sans-serif",
                fontStyle: "unset",
                fontSize: "18px",
                lineHeight: 1.5 / 1,
              }}
            >
              Your Name
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
                id="Name"
                name="Name"
                className="pl-7 h-18 bg-cyan-50 border-2 border-blue-700 w-[99%] mr-auto"
                style={{
                  paddingBlock: "6px",
                  paddingRight: "10px",
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
                placeholder="Name"
                value={formik.values.Name}
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
              {formik.touched.Name && formik.errors.Name && (
                <span style={{ color: "red", textAlign: "left" }}>
                  {formik.errors.Name}
                </span>
              )}
            </div>
          </div>
          <div className="font-robotoRegular w-full bg-transparent flex flex-col gap-y-1.5 h-28 px-4 text-lg mb-10">
            <label
              htmlFor="email"
              style={{
                textAlign: "left",
                fontFamily: "sans-serif",
                fontStyle: "unset",
                fontSize: "18px",
                lineHeight: 1.5 / 1,
              }}
            >
              Email
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
                id="email"
                name="email"
                className="pl-7 h-18 bg-cyan-50 border-2 border-blue-700 w-[99%] mr-auto"
                style={{
                  paddingBlock: "6px",
                  paddingRight: "10px",
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
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <span style={{ color: "red", textAlign: "left" }}>
                  {formik.errors.email}
                </span>
              )}
            </div>
          </div>
          <div className="font-robotoRegular w-full bg-transparent flex flex-col gap-y-1.5 h-28 px-4 text-lg mb-10">
            <label
              htmlFor="CommentsOrQuestions"
              style={{
                textAlign: "left",
                fontFamily: "sans-serif",
                fontStyle: "unset",
                fontSize: "18px",
                lineHeight: 1.5 / 1,
              }}
            >
              Comments / Questions
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
              <textarea
                id="CommentsOrQuestions"
                name="CommentsOrQuestions"
                className="pl-7 h-36 bg-cyan-50 border-2 border-blue-700 w-[99%] mr-auto"
                style={{
                  paddingBlock: "6px",
                  paddingRight: "10px",
                  flexGrow: 1,
                  fontSize: "16px",
                  lineHeight: 1.5 / 1,
                  color: "#101828",
                  borderRadius: "4px",
                  outlineWidth: "1px",
                  outlineOffset: "1px",
                  outlineColor: "#d1d5dc",
                }}
                placeholder="Comments"
                value={formik.values.CommentsOrQuestions}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.CommentsOrQuestions &&
                formik.errors.CommentsOrQuestions && (
                  <span style={{ color: "red", textAlign: "left" }}>
                    {formik.errors.CommentsOrQuestions}
                  </span>
                )}
            </div>
            <div className="flex flex-row justify-between items-center">
              <div
                className="font-robotoSemiBold w-[50%] mt-5 md:w-[30%] text-2xl"
                style={{
                  backgroundColor: "transparent",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  columnGap: "5px",
                  height: "50px",
                  marginBottom: "5px",
                }}
              >
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    height: "50px",
                    color: "#edf2f0",
                    lineHeight: 1.5 / 1,
                    backgroundColor: "#4bc1d2",
                    textAlign: "center",
                    padding: 0,
                  }}
                >
                  Contact
                </button>
              </div>
              <img
                className="mt-3 2xl:mt-0"
                alt="no robots"
                src="/public/prohibited.png"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
