import React, { useEffect, /* useRef, */ useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { getCookie, onlyAlphabetics, onlyNumbers } from "../../../Fuctions";
import { API_BASE_URL } from "../../../Constants";

interface EditMemberDto {
  adminToken: string;
  Id: string | undefined;
  UserName: string;
  isActive: boolean;
  DateOfBirth: string;
  State: string;
  Password: string;
  ContactNumber: string;
  City: string;
  FullName: string;
  Email: string;
  PIN: string;
  FullAddress: string;
}

type Props = {
  city: string;
  contactNumber: string;
  dateOfBirth: string;
  email: string;
  fullAddress: string;
  fullName: string;
  id: string;
  isActive: boolean;
  pin: string;
  state: string;
  userName: string;
};

export const EditMember = (props: Props) => {
  const ValidateMemberUserName = async (value: string) => {
    try {
      const adminToken = getCookie("LMS");
      const response = await fetch(
        `${API_BASE_URL}/Member/CheckMemberUserNameUniqueForUpdate/${props.id}?adminToken=${adminToken}&member_username=${value}`,
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
        `${API_BASE_URL}/Member/CheckMemberEmailUniqueForUpdate/${props.id}?adminToken=${adminToken}&email=${value}`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error("API request failed");
      }
      if (response.status === 200) {
        return true; // Memberemail is unique
      } else {
        return false; // Memberemail is not unique
      }
    } catch (error) {
      console.error("Error checking member username uniqueness:", error);
      return false; // Default to not unique
    }
  };
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*?])[a-zA-Z\d!@#$%&*?]{8,}$/gi;
  const editMemberSchema = Yup.object().shape({
    MemberUserName: Yup.string()
      .min(10, "Too Short!")
      .max(70, "Too Long!")
      .required("Required")
      .test(
        "MemberUserName",
        "UserName is already exists!",
        ValidateMemberUserName
      ),
    MemberIsActive: Yup.boolean(),
    MemberDateOfBirth: Yup.date()
      .required("Date of birth is required!.")
      .max(new Date(), "Date cannot be in the future!."),
    MemberState: Yup.string().required("Required"),
    Memberpassword: Yup.string()
      .required("Required")
      .min(8, "Too Short!")
      .matches(
        passwordRegex,
        "Password must include uppercase, lowercase, number, and special character"
      ),
    MemberContactNumber: Yup.number().required("Required"),
    MemberCity: Yup.string().required("Required"),
    MemberFullName: Yup.string().required("Required"),
    MemberEmail: Yup.string()
      .required("Required")
      .email("Invalid email")
      .test("MemberEmail", "Email is already exists!.", ValidateMemberEmail),
    MemberPIN: Yup.number().required("Required"),
    MemberFullAddress: Yup.string().min(12, "Too Short!").required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      MemberUserName: props.userName,
      MemberIsActive: props.isActive,
      MemberDateOfBirth: props.dateOfBirth,
      MemberState: props.state,
      Memberpassword: "",
      MemberContactNumber: props.contactNumber,
      MemberCity: props.city,
      MemberFullName: props.fullName,
      MemberEmail: props.email,
      MemberPIN: props.pin,
      MemberFullAddress: props.fullAddress,
    },
    enableReinitialize: true,
    validationSchema: editMemberSchema,
    onSubmit: async () => {
      try {
        const adminToken = getCookie("LMS");
        const editMemberDto: EditMemberDto = {
          adminToken,
          Id: props.id,
          UserName: formik.values.MemberUserName,
          isActive: formik.values.MemberIsActive,
          DateOfBirth: formik.values.MemberDateOfBirth,
          State: formik.values.MemberState,
          Password: formik.values.Memberpassword,
          ContactNumber: formik.values.MemberContactNumber,
          City: formik.values.MemberCity,
          FullName: formik.values.MemberFullName,
          Email: formik.values.MemberEmail,
          PIN: formik.values.MemberPIN,
          FullAddress: formik.values.MemberFullAddress,
        };
        const response = await fetch(
          `${API_BASE_URL}/Member/update/${props.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(editMemberDto),
          }
        );

        if (!response.ok) {
          Swal.fire({
            title: "Error Message",
            text: "Update is failed!.",
            icon: "error",
            confirmButtonColor: "#013d81",
          });
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          const data = await response.text();
          Swal.fire({
            title: "Success Message",
            text: "Member is updated successfully",
            icon: "success",
            confirmButtonColor: "black",
          });
          console.log("Success", data);
          formik.handleReset(() => formik.resetForm());
          window.location.assign("/admin/members");
        }
      } catch (error) {
        Swal.fire({
          title: "Error Messaage",
          text: "Update is failed!.",
          icon: "error",
          confirmButtonColor: "#013d81",
        });
        console.error("Error", error);
      }
    },
  });
  const [editMemberHeaderDivWidth, setEditMemberHeaderDivWidth] =
    useState<number>(window.innerWidth);
  useEffect(() => {
    function handleResizing() {
      setEditMemberHeaderDivWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResizing);
    return () => window.removeEventListener("resize", handleResizing);
  }, []);
  // const editMemberForm = useRef<HTMLFormElement>(null);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        formik.handleSubmit();
      }}
      className="w-full md:w-[70%] md:h-[650px] border-l-0 lg:border-l-2 border-l-blue-600"
      style={{
        width: `${editMemberHeaderDivWidth * 0.7}px`,
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
        Edit Member
      </h2>
      <div
        className={editMemberHeaderDivWidth > 767 ? "h-[720px]" : "h-[1180px]"}
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
          Member Update
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
              htmlFor="MemberUserName"
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
                id="MemberUserName"
                name="MemberUserName"
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
                value={formik.values.MemberUserName}
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
              {formik.touched.MemberUserName &&
                formik.errors.MemberUserName && (
                  <span style={{ color: "red", textAlign: "left" }}>
                    {formik.errors.MemberUserName}
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
              htmlFor="MemberDateOfBirth"
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
                id="MemberDateOfBirth"
                name="MemberDateOfBirth"
                value={formik.values.MemberDateOfBirth}
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
              {formik.touched.MemberDateOfBirth &&
                formik.errors.MemberDateOfBirth && (
                  <span style={{ color: "red", textAlign: "left" }}>
                    {formik.errors.MemberDateOfBirth}
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
              htmlFor="MemberState"
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
                id="MemberState"
                name="MemberState"
                value={formik.values.MemberState}
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
              {formik.touched.MemberState && formik.errors.MemberState && (
                <span style={{ color: "red", textAlign: "left" }}>
                  {formik.errors.MemberState}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="w-full bg-transparent flex flex-col gap-y-1.5 h-20 px-4 md:hidden">
          <label
            htmlFor="MemberUserName"
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
              id="MemberUserName"
              name="MemberUserName"
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
              value={formik.values.MemberUserName}
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
            {formik.touched.MemberUserName && formik.errors.MemberUserName && (
              <span style={{ color: "red", textAlign: "left" }}>
                {formik.errors.MemberUserName}
              </span>
            )}
          </div>
        </div>
        <div className="w-full bg-transparent flex flex-col gap-y-1.5 h-20 px-4 md:hidden">
          <label
            htmlFor="MemberDateOfBirth"
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
              id="MemberDateOfBirth"
              name="MemberDateOfBirth"
              value={formik.values.MemberDateOfBirth}
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
            {formik.touched.MemberDateOfBirth &&
              formik.errors.MemberDateOfBirth && (
                <span style={{ color: "red", textAlign: "left" }}>
                  {formik.errors.MemberDateOfBirth}
                </span>
              )}
          </div>
        </div>
        <div className="w-full bg-transparent flex flex-col gap-y-1.5 h-20 px-4 md:hidden">
          <label
            htmlFor="MemberState"
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
              id="MemberState"
              name="MemberState"
              value={formik.values.MemberState}
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
            {formik.touched.MemberState && formik.errors.MemberState && (
              <span style={{ color: "red", textAlign: "left" }}>
                {formik.errors.MemberState}
              </span>
            )}
          </div>
        </div>
        <div className="w-full flex flex-row gap-x-5 items-center h-20 pl-4">
          <div
            onClick={() => {
              formik.setFieldValue("MemberIsActive", true);
            }}
            className={
              (formik.values.MemberIsActive ? "bg-[#187736]" : "bg-[#1e9545]") +
              " w-24 h-[65%] hover:bg-[#187736] hover:cursor-pointer text-gray-50 text-xl rounded-sm flex justify-center items-center font-sans"
            }
          >
            <span style={{ color: "white" }}>Active</span>
          </div>
          <div
            onClick={() => {
              formik.setFieldValue("MemberIsActive", false);
            }}
            className={
              (formik.values.MemberIsActive ? "bg-red-600" : "bg-red-700") +
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
              htmlFor="Memberpassword"
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
                id="Memberpassword"
                name="Memberpassword"
                value={formik.values.Memberpassword}
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
              {formik.touched.Memberpassword &&
                formik.errors.Memberpassword && (
                  <span style={{ color: "red", textAlign: "left" }}>
                    {formik.errors.Memberpassword}
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
              htmlFor="MemberContactNumber"
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
                id="MemberContactNumber"
                name="MemberContactNumber"
                value={formik.values.MemberContactNumber}
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
              {formik.touched.MemberContactNumber &&
                formik.errors.MemberContactNumber && (
                  <span style={{ color: "red", textAlign: "left" }}>
                    {formik.errors.MemberContactNumber}
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
              htmlFor="MemberCity"
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
                id="MemberCity"
                name="MemberCity"
                value={formik.values.MemberCity}
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
              {formik.touched.MemberCity && formik.errors.MemberCity && (
                <span style={{ color: "red", textAlign: "left" }}>
                  {formik.errors.MemberCity}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="w-full bg-transparent flex flex-col gap-y-1.5 h-20 px-4 md:hidden">
          <label
            htmlFor="Memberpassword"
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
              id="Memberpassword"
              name="Memberpassword"
              value={formik.values.Memberpassword}
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
            {formik.touched.Memberpassword && formik.errors.Memberpassword && (
              <span style={{ color: "red", textAlign: "left" }}>
                {formik.errors.Memberpassword}
              </span>
            )}
          </div>
        </div>
        <div className="w-full bg-transparent flex flex-col gap-y-1.5 h-20 px-4 md:hidden">
          <label
            htmlFor="MemberContactNumber"
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
              id="MemberContactNumber"
              name="MemberContactNumber"
              value={formik.values.MemberContactNumber}
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
            {formik.touched.MemberContactNumber &&
              formik.errors.MemberContactNumber && (
                <span style={{ color: "red", textAlign: "left" }}>
                  {formik.errors.MemberContactNumber}
                </span>
              )}
          </div>
        </div>
        <div className="w-full bg-transparent flex flex-col gap-y-1.5 h-20 px-4 md:hidden">
          <label
            htmlFor="MemberCity"
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
              id="MemberCity"
              name="MemberCity"
              value={formik.values.MemberCity}
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
            {formik.touched.MemberCity && formik.errors.MemberCity && (
              <span style={{ color: "red", textAlign: "left" }}>
                {formik.errors.MemberCity}
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
              htmlFor="MemberFullName"
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
                id="MemberFullName"
                name="MemberFullName"
                value={formik.values.MemberFullName}
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
              {formik.touched.MemberFullName &&
                formik.errors.MemberFullName && (
                  <span style={{ color: "red", textAlign: "left" }}>
                    {formik.errors.MemberFullName}
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
              htmlFor="MemberEmail"
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
                id="MemberEmail"
                name="MemberEmail"
                value={formik.values.MemberEmail}
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
              {formik.touched.MemberEmail && formik.errors.MemberEmail && (
                <span style={{ color: "red", textAlign: "left" }}>
                  {formik.errors.MemberEmail}
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
              htmlFor="MemberPIN"
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
                id="MemberPIN"
                name="MemberPIN"
                value={formik.values.MemberPIN}
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
              {formik.touched.MemberPIN && formik.errors.MemberPIN && (
                <span style={{ color: "red", textAlign: "left" }}>
                  {formik.errors.MemberPIN}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="w-full bg-transparent flex flex-col gap-y-1.5 h-20 px-4 md:hidden">
          <label
            htmlFor="MemberFullName"
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
              id="MemberFullName"
              name="MemberFullName"
              value={formik.values.MemberFullName}
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
            {formik.touched.MemberFullName && formik.errors.MemberFullName && (
              <span style={{ color: "red", textAlign: "left" }}>
                {formik.errors.MemberFullName}
              </span>
            )}
          </div>
        </div>
        <div className="w-full bg-transparent flex flex-col gap-y-1.5 h-20 px-4 md:hidden">
          <label
            htmlFor="MemberEmail"
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
              id="MemberEmail"
              name="MemberEmail"
              value={formik.values.MemberEmail}
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
            {formik.touched.MemberEmail && formik.errors.MemberEmail && (
              <span style={{ color: "red", textAlign: "left" }}>
                {formik.errors.MemberEmail}
              </span>
            )}
          </div>
        </div>
        <div className="w-full bg-transparent flex flex-col gap-y-1.5 h-20 px-4 md:hidden">
          <label
            htmlFor="MemberPIN"
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
              id="MemberPIN"
              name="MemberPIN"
              value={formik.values.MemberPIN}
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
            {formik.touched.MemberPIN && formik.errors.MemberPIN && (
              <span style={{ color: "red", textAlign: "left" }}>
                {formik.errors.MemberPIN}
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
            htmlFor="MemberFullAddress"
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
              id="MemberFullAddress"
              name="MemberFullAddress"
              value={formik.values.MemberFullAddress}
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
            {formik.touched.MemberFullAddress &&
              formik.errors.MemberFullAddress && (
                <span style={{ color: "red", textAlign: "left" }}>
                  {formik.errors.MemberFullAddress}
                </span>
              )}
          </div>
        </div>
        <div className="w-full bg-transparent flex flex-col gap-y-1.5 h-20 px-4 md:hidden">
          <label
            htmlFor="MemberFullAddress"
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
              id="MemberFullAddress"
              name="MemberFullAddress"
              value={formik.values.MemberFullAddress}
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
            {formik.touched.MemberFullAddress &&
              formik.errors.MemberFullAddress && (
                <span style={{ color: "red", textAlign: "left" }}>
                  {formik.errors.MemberFullAddress}
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
              backgroundColor: "gold",
              textAlign: "center",
              padding: 0,
            }}
          >
            Update
          </button>
        </div>
      </div>
    </form>
  );
};
