import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { getCookie, onlyAlphabetics, onlyNumbers } from "../../../Fuctions";
import { API_BASE_URL } from "../../../Constants";
const ValidateMemberUserName = async (value: string) => {
  try {
    const adminToken = getCookie("LMS");
    const response = await fetch(
      `${API_BASE_URL}/Member/CheckMemberUserNameUniqueForCreate?adminToken=${adminToken}&member_username=${value}`,
      {
        method: "GET",
      }
    );
    if (!response.ok) {
      throw new Error("API request failed");
    }
    if (response.status === 200) {
      return true; // MemberUsername is unique
    } else {
      return false; // MemberUsername is not unique
    }
  } catch (error) {
    console.error("Error checking member username uniqueness:", error);
    return false; // Default to not unique
  }
};
const ValidateMemberEmail = async (value: string) => {
  try {
    const adminToken = getCookie("LMS");
    const response = await fetch(
      `${API_BASE_URL}/Member/CheckMemberEmailUniqueForCreate?adminToken=${adminToken}&email=${value}`,
      {
        method: "GET",
      }
    );
    if (!response.ok) {
      throw new Error("API request failed");
    }
    if (response.status === 200) {
      return true; // Membername is unique
    } else {
      return false; // Membername is not unique
    }
  } catch (error) {
    console.error("Error checking member username uniqueness:", error);
    return false; // Default to not unique
  }
};

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*?])[a-zA-Z\d!@#$%&*?]{8,}$/gi;
const AddMemberSchema = Yup.object().shape({
  userName: Yup.string()
    .min(10, "Too Short!")
    .max(70, "Too Long!")
    .required("Required")
    .test("userName", "UserName is already exists!", ValidateMemberUserName),
  isActive: Yup.boolean(),
  dateOfBirth: Yup.date()
    .required("Date of birth is required!.")
    .max(new Date(), "Date cannot be in the future!."),
  state: Yup.string().required("Required"),
  password: Yup.string()
    .required("Required")
    .min(8, "Too Short!")
    .matches(
      passwordRegex,
      "Password must include uppercase, lowercase, number, and special character"
    ),
  contactNumber: Yup.number().required("Required"),
  city: Yup.string().required("Required"),
  fullName: Yup.string().required("Required"),
  email: Yup.string()
    .required("Required")
    .email("Invalid email")
    .test("email", "Email is already exists!.", ValidateMemberEmail),
  PIN: Yup.number().required("Required"),
  FullAddress: Yup.string().min(12, "Too Short!").required("Required"),
});

interface AddMemberDto {
  adminToken: string;
  userName: string;
  isActive: boolean;
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
export const AddMember = () => {
  const formik = useFormik({
    initialValues: {
      userName: "",
      isActive: true,
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
    validationSchema: AddMemberSchema,
    onSubmit: async () => {
      try {
        const adminToken = getCookie("LMS");
        const addMemberDto: AddMemberDto = {
          adminToken,
          userName: formik.values.userName,
          isActive: formik.values.isActive,
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
        const response = await fetch(`${API_BASE_URL}/Member/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(addMemberDto),
        });

        if (!response.ok) {
          Swal.fire({
            title: "Error Message",
            text: "Creation is failed!.",
            icon: "error",
            confirmButtonColor: "#013d81",
          });
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          const data = await response.text();
          Swal.fire({
            title: "Success Message",
            text: "Member is added successfully",
            icon: "success",
            confirmButtonColor: "black",
          });
          console.log("Success", data);
          formik.handleReset(() => formik.resetForm());
        }
      } catch (error) {
        Swal.fire({
          title: "Error Messaage",
          text: "Creation is failed!.",
          icon: "error",
          confirmButtonColor: "#013d81",
        });
        console.error("Error", error);
      }
    },
  });
  const [addMemberHeaderDivWidth, setAddMemberHeaderDivWidth] =
    useState<number>(window.innerWidth);
  useState<number>(window.innerWidth);
  useEffect(() => {
    function handleResizing() {
      setAddMemberHeaderDivWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResizing);
    return () => window.removeEventListener("resize", handleResizing);
  }, []);
  //const addMemberForm = useRef<HTMLFormElement>(null);
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        formik.handleSubmit();
      }}
      className="w-full md:w-[70%] md:h-[650px] border-l-0 lg:border-l-2 border-l-blue-600"
      style={{
        width: `${addMemberHeaderDivWidth * 0.7}px`,
        marginBottom: "50px",
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
        Add Member
      </h2>
      <div
        className={addMemberHeaderDivWidth > 767 ? "h-[720px]" : "h-[1180px]"}
        style={{
          width: "98%",
          paddingTop: "20px",
          marginLeft: "auto",
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
          <img src="/public/add-friend.png" width={"128px"} height={"128px"} />
        </div>
        <h3
          style={{
            fontSize: "20px",
            textAlign: "center",
            margin: 0,
            marginBottom: "10px",
          }}
        >
          Member Insertion
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
        <div className="w-full flex flex-row gap-x-5 items-center h-20 pl-4">
          <div
            onClick={() => {
              formik.setFieldValue("isActive", true);
            }}
            className={
              (formik.values.isActive ? "bg-[#187736]" : "bg-[#1e9545]") +
              " w-24 h-[65%] hover:bg-[#187736] hover:cursor-pointer text-gray-50 text-xl rounded-sm flex justify-center items-center font-sans"
            }
          >
            <span style={{ color: "white" }}>Active</span>
          </div>
          <div
            onClick={() => {
              formik.setFieldValue("isActive", false);
            }}
            className={
              (formik.values.isActive ? "bg-red-600" : "bg-red-700") +
              " w-28 h-[65%] bg-red-600 hover:bg-red-700 hover:cursor-pointer text-white text-xl rounded-sm flex justify-center items-center font-sans"
            }
          >
            <span style={{ color: "white" }}>Deactive</span>
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
              {formik.touched.contactNumber && formik.errors.contactNumber && (
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
            {formik.touched.contactNumber && formik.errors.contactNumber && (
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
            Add
          </button>
        </div>
      </div>
    </form>
  );
};

/*

   <form
      ref={addMemberForm}
      onSubmit={formik.handleSubmit}
      className="pb-8 pt-2"
    >
      <div
        className="flex justify-center items-center"
        style={{ width: `${addMemberHeaderDivWidth * 0.7}px` }}
      >
        {" "}
        <h2 className="text-blue-400 text-4xl">ADD AUTHOR</h2>
      </div>
      <div className="mt-10 flex flex-col ml-[10%] gap-y-1.5">
        <input
          className="h-11 w-96 py-2 pr-2.5 pl-3 grow text-lg text-black placeholder:text-gray-500 rounded-xl border-none shadow-xl shadow-gray-400 focus:bg-[#e6f0fd] focus:border-none"
          name="MemberName"
          id="MemberName"
          value={formik.values.MemberName}
          type="text"
          placeholder="Member Name"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.MemberName && formik.errors.MemberName && (
          <span style={{ color: "red", textAlign: "left" }}>
            {formik.errors.MemberName}
          </span>
        )}
      </div>
      <div className="w-full h-14 flex justify-start ml-[10%] mt-10 items-center">
        <div
          onClick={() => formik.handleSubmit()}
          className="w-[17%] h-full bg-[#1e9545] hover:bg-[#187736] hover:cursor-pointer text-gray-50 text-xl rounded-md flex justify-center items-center font-sans"
        >
          <span>Submit</span>
        </div>
      </div>
    </form>

*/
