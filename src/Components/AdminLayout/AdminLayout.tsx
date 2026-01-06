import React, { useContext, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router";
import Footer from "../Footer";
import { AdminHeader } from "../AdminHeader";
import "../AdminHeader.css";
import AdminContext, { AdminContextValueInterface } from "./Context";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { getCookie } from "../../Fuctions";
import { UnauthorizedPage } from "../../routes/UnauthorizedPage";
const AdminLayout = () => {
  const [adminContextValue, setAdminContextValue] =
    useState<AdminContextValueInterface>({
      theme: "light",
      showAdminHeaderForMobileDesign: false,
    });

  if (getCookie("LMS") !== "") {
    return (
      <AdminContext.Provider
        value={{ adminContextValue, setAdminContextValue }}
      >
        <AdminLayoutContent />
      </AdminContext.Provider>
    );
  } else return <UnauthorizedPage />;
};

const AdminLayoutContent = () => {
  const contextData = useContext(AdminContext);
  if (!contextData) return null;
  const { adminContextValue, setAdminContextValue } = contextData;

  const SlideUpBox = () => {
    const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
    useEffect(() => {
      function handleResizing() {
        setWindowWidth(window.innerWidth);
      }
      window.addEventListener("resize", handleResizing);
      return () => window.removeEventListener("resize", handleResizing);
    }, []);
    const [authorOpenDropDownList, setAuthorOpenDropDownList] =
      useState<boolean>(false);
    const [publisherOpenDropDownList, setPublisherOpenDropDownList] =
      useState<boolean>(false);
    const [memberOpenDropDownList, setMemberOpenDropDownList] =
      useState<boolean>(false);
    const [bookOpenDropDownList, setBookOpenDropDownList] =
      useState<boolean>(false);

    const [borrowedBookOpenDropDownList, setBorrowedBookOpenDropDownList] =
      useState<boolean>(false);
    const navigate = useNavigate();
    return (
      <div
        className="slide-up-box mt-10 lg:hidden"
        style={{ width: `${windowWidth}px` }}
      >
        <div
          className="py-4 px-[20%] pb-8 bg-white h-[120px] relative"
          style={{ width: `${windowWidth}px` }}
        >
          <Link
            className="no-underline hover:underline w-[90%] absolute left-[5%] h-16 rounded-xl bg-white hover:bg-[#eaf3f4] flex justify-start pl-[2%] items-center"
            to="/admin"
            onClick={() => {
              navigate("/admin");
              setAdminContextValue({
                ...adminContextValue,
                showAdminHeaderForMobileDesign: false,
              });
            }}
            style={{ width: `${windowWidth * 0.9}px`, marginInline: "auto" }}
          >
            <span
              className="no-underline hover:underline text-black text-4xl font-notoSansTeluguBold"
              style={{ fontSize: "2.25rem", lineHeight: 1.111111 }}
            >
              Home
            </span>
          </Link>
          <div
            className="w-[90%] absolute left-[5%] bottom-0 bg-gray-300 h-[3px]"
            style={{ width: `${windowWidth * 0.9}px`, marginInline: "auto" }}
          ></div>
        </div>
        <div className="min-h-[120px]">
          {" "}
          <div
            className="py-4 pt-[20px] px-[20%] bg-white h-[120px] relative"
            style={{ width: `${windowWidth}px` }}
          >
            <span
              onClick={() => setAuthorOpenDropDownList(!authorOpenDropDownList)}
              className="no-underline hover:underline hover:cursor-pointer w-[90%] absolute left-[5%] h-16 rounded-xl bg-white hover:bg-[#eaf3f4] flex justify-between px-[2%] items-center"
              style={{ width: `${windowWidth * 0.9}px`, marginInline: "auto" }}
            >
              <span
                className="no-underline hover:underline text-black text-3xl font-notoSansTeluguBold"
                style={{ fontSize: "2.25rem", lineHeight: 1.111111 }}
              >
                Authors
              </span>
              {authorOpenDropDownList ? (
                <IoMdArrowDropup
                  onClick={() =>
                    setAuthorOpenDropDownList(!authorOpenDropDownList)
                  }
                  className="text-3xl"
                />
              ) : (
                <IoMdArrowDropdown
                  onClick={() =>
                    setAuthorOpenDropDownList(!authorOpenDropDownList)
                  }
                  className="text-3xl"
                />
              )}
            </span>
            <div
              className="w-[90%] absolute left-[5%] bottom-0 bg-gray-300 h-[3px]"
              style={{ width: `${windowWidth * 0.9}px`, marginInline: "auto" }}
            ></div>
          </div>
          {authorOpenDropDownList && (
            <AnimatePresence>
              <motion.div
                className="bg-white"
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -100 }}
                transition={{ duration: 0.5, ease: easeOut }}
              >
                <div className="flex flex-col h-[240px] bg-white">
                  <div
                    className="py-4 pt-[20px] px-[20%] bg-white h-[120px] relative"
                    style={{ width: `${windowWidth}px` }}
                  >
                    <Link
                      className="no-underline hover:underline w-[90%] absolute left-[5%] h-16 rounded-xl bg-white hover:bg-[#eaf3f4] flex justify-start pl-[2%] items-center"
                      to=""
                      onClick={() => {
                        navigate("/admin/authors");
                        setAdminContextValue({
                          ...adminContextValue,
                          showAdminHeaderForMobileDesign: false,
                        });
                      }}
                      style={{
                        width: `${windowWidth * 0.9}px`,
                        marginInline: "auto",
                      }}
                    >
                      <span
                        className="no-underline hover:underline text-black text-3xl font-notoSansTeluguBold"
                        style={{ fontSize: "2.25rem", lineHeight: 1.111111 }}
                      >
                        Authors
                      </span>
                    </Link>
                    <div
                      className="w-[90%] absolute left-[5%] bottom-0 bg-gray-300 h-[3px]"
                      style={{
                        width: `${windowWidth * 0.9}px`,
                        marginInline: "auto",
                      }}
                    ></div>
                  </div>
                  <div
                    className="py-4 pt-[20px] px-[20%] bg-white h-[120px] relative"
                    style={{ width: `${windowWidth}px` }}
                  >
                    <Link
                      className="no-underline hover:underline w-[90%] absolute left-[5%] h-16 rounded-xl bg-white hover:bg-[#eaf3f4] flex justify-start pl-[2%] items-center"
                      to=""
                      onClick={() => {
                        navigate("/admin/authors/add-author");
                        setAdminContextValue({
                          ...adminContextValue,
                          showAdminHeaderForMobileDesign: false,
                        });
                      }}
                      style={{
                        width: `${windowWidth * 0.9}px`,
                        marginInline: "auto",
                      }}
                    >
                      <span
                        className="no-underline hover:underline text-black text-3xl font-notoSansTeluguBold"
                        style={{ fontSize: "2.25rem", lineHeight: 1.111111 }}
                      >
                        Add Author
                      </span>
                    </Link>
                    <div
                      className="w-[90%] absolute left-[5%] bottom-0 bg-gray-300 h-[3px]"
                      style={{
                        width: `${windowWidth * 0.9}px`,
                        marginInline: "auto",
                      }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        <div
          className="py-4 pt-[20px] px-[20%] bg-white h-[120px] relative"
          style={{ width: `${windowWidth}px` }}
        >
          <span
            onClick={() =>
              setPublisherOpenDropDownList(!publisherOpenDropDownList)
            }
            className="no-underline hover:underline hover:cursor-pointer w-[90%] absolute left-[5%] h-16 rounded-xl bg-white hover:bg-[#eaf3f4] flex justify-between px-[2%] items-center"
            style={{ width: `${windowWidth * 0.9}px`, marginInline: "auto" }}
          >
            <span
              className="no-underline hover:underline text-black text-3xl font-notoSansTeluguBold"
              style={{ fontSize: "2.25rem", lineHeight: 1.111111 }}
            >
              Publishers
            </span>
            {publisherOpenDropDownList ? (
              <IoMdArrowDropup
                onClick={() =>
                  setPublisherOpenDropDownList(!publisherOpenDropDownList)
                }
                className="text-3xl"
              />
            ) : (
              <IoMdArrowDropdown
                onClick={() =>
                  setPublisherOpenDropDownList(!publisherOpenDropDownList)
                }
                className="text-3xl"
              />
            )}
          </span>
          <div
            className="w-[90%] absolute left-[5%] bottom-0 bg-gray-300 h-[3px]"
            style={{ width: `${windowWidth * 0.9}px`, marginInline: "auto" }}
          ></div>
        </div>
        {publisherOpenDropDownList && (
          <AnimatePresence>
            <motion.div
              className="bg-white"
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 0.5, ease: easeOut }}
            >
              <div className="flex flex-col h-[240px] bg-white">
                <div
                  className="py-4 pt-[20px] px-[20%] bg-white h-[120px] relative"
                  style={{ width: `${windowWidth}px` }}
                >
                  <Link
                    className="no-underline hover:underline w-[90%] absolute left-[5%] h-16 rounded-xl bg-white hover:bg-[#eaf3f4] flex justify-start pl-[2%] items-center"
                    to=""
                    onClick={() => {
                      window.location.assign("/admin/publishers");
                      setAdminContextValue({
                        ...adminContextValue,
                        showAdminHeaderForMobileDesign: false,
                      });
                    }}
                    style={{
                      width: `${windowWidth * 0.9}px`,
                      marginInline: "auto",
                    }}
                  >
                    <span
                      className="no-underline hover:underline text-black text-3xl font-notoSansTeluguBold"
                      style={{ fontSize: "2.25rem", lineHeight: 1.111111 }}
                    >
                      Publishers
                    </span>
                  </Link>
                  <div
                    className="w-[90%] absolute left-[5%] bottom-0 bg-gray-300 h-[3px]"
                    style={{
                      width: `${windowWidth * 0.9}px`,
                      marginInline: "auto",
                    }}
                  ></div>
                </div>
                <div
                  className="py-4 pt-[20px] px-[20%] bg-white h-[120px] relative"
                  style={{ width: `${windowWidth}px` }}
                >
                  <Link
                    className="no-underline hover:underline w-[90%] absolute left-[5%] h-16 rounded-xl bg-white hover:bg-[#eaf3f4] flex justify-start pl-[2%] items-center"
                    to=""
                    onClick={() => {
                      window.location.assign("/admin/publishers/add-publisher");
                      setAdminContextValue({
                        ...adminContextValue,
                        showAdminHeaderForMobileDesign: false,
                      });
                    }}
                    style={{
                      width: `${windowWidth * 0.9}px`,
                      marginInline: "auto",
                    }}
                  >
                    <span
                      className="no-underline hover:underline text-black text-3xl font-notoSansTeluguBold"
                      style={{ fontSize: "2.25rem", lineHeight: 1.111111 }}
                    >
                      Add Publisher
                    </span>
                  </Link>
                  <div
                    className="w-[90%] absolute left-[5%] bottom-0 bg-gray-300 h-[3px]"
                    style={{
                      width: `${windowWidth * 0.9}px`,
                      marginInline: "auto",
                    }}
                  ></div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        <div
          className="py-4 pt-[20px] px-[20%] bg-white h-[120px] relative"
          style={{ width: `${windowWidth}px` }}
        >
          <span
            onClick={() => setMemberOpenDropDownList(!memberOpenDropDownList)}
            className="no-underline hover:underline hover:cursor-pointer w-[90%] absolute left-[5%] h-16 rounded-xl bg-white hover:bg-[#eaf3f4] flex justify-between px-[2%] items-center"
            style={{ width: `${windowWidth * 0.9}px`, marginInline: "auto" }}
          >
            <span
              className="no-underline hover:underline text-black text-3xl font-notoSansTeluguBold"
              style={{ fontSize: "2.25rem", lineHeight: 1.111111 }}
            >
              Members
            </span>
            {memberOpenDropDownList ? (
              <IoMdArrowDropup
                onClick={() =>
                  setMemberOpenDropDownList(!memberOpenDropDownList)
                }
                className="text-3xl"
              />
            ) : (
              <IoMdArrowDropdown
                onClick={() =>
                  setMemberOpenDropDownList(!memberOpenDropDownList)
                }
                className="text-3xl"
              />
            )}
          </span>
          <div
            className="w-[90%] absolute left-[5%] bottom-0 bg-gray-300 h-[3px]"
            style={{ width: `${windowWidth * 0.9}px`, marginInline: "auto" }}
          ></div>
        </div>
        {memberOpenDropDownList && (
          <AnimatePresence>
            <motion.div
              className="bg-white"
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 0.5, ease: easeOut }}
            >
              <div className="flex flex-col h-[240px] bg-white">
                <div
                  className="py-4 pt-[20px] px-[20%] bg-white h-[120px] relative"
                  style={{ width: `${windowWidth}px` }}
                >
                  <Link
                    className="no-underline hover:underline w-[90%] absolute left-[5%] h-16 rounded-xl bg-white hover:bg-[#eaf3f4] flex justify-start pl-[2%] items-center"
                    to=""
                    onClick={() => {
                      window.location.assign("/admin/members");
                      setAdminContextValue({
                        ...adminContextValue,
                        showAdminHeaderForMobileDesign: false,
                      });
                    }}
                    style={{
                      width: `${windowWidth * 0.9}px`,
                      marginInline: "auto",
                    }}
                  >
                    <span
                      className="no-underline hover:underline text-black text-3xl font-notoSansTeluguBold"
                      style={{ fontSize: "2.25rem", lineHeight: 1.111111 }}
                    >
                      Members
                    </span>
                  </Link>
                  <div
                    className="w-[90%] absolute left-[5%] bottom-0 bg-gray-300 h-[3px]"
                    style={{
                      width: `${windowWidth * 0.9}px`,
                      marginInline: "auto",
                    }}
                  ></div>
                </div>
                <div
                  className="py-4 pt-[20px] px-[20%] bg-white h-[120px] relative"
                  style={{ width: `${windowWidth}px` }}
                >
                  <Link
                    className="no-underline hover:underline w-[90%] absolute left-[5%] h-16 rounded-xl bg-white hover:bg-[#eaf3f4] flex justify-start pl-[2%] items-center"
                    to=""
                    onClick={() => {
                      window.location.assign("/admin/members/add-member");
                      setAdminContextValue({
                        ...adminContextValue,
                        showAdminHeaderForMobileDesign: false,
                      });
                    }}
                    style={{
                      width: `${windowWidth * 0.9}px`,
                      marginInline: "auto",
                    }}
                  >
                    <span
                      className="no-underline hover:underline text-black text-3xl font-notoSansTeluguBold"
                      style={{ fontSize: "2.25rem", lineHeight: 1.111111 }}
                    >
                      Add Member
                    </span>
                  </Link>
                  <div
                    className="w-[90%] absolute left-[5%] bottom-0 bg-gray-300 h-[3px]"
                    style={{
                      width: `${windowWidth * 0.9}px`,
                      marginInline: "auto",
                    }}
                  ></div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
        <div
          className="py-4 pt-[20px] px-[20%] bg-white h-[120px] relative"
          style={{ width: `${windowWidth}px` }}
        >
          <span
            onClick={() => setBookOpenDropDownList(!bookOpenDropDownList)}
            className="no-underline hover:underline hover:cursor-pointer w-[90%] absolute left-[5%] h-16 rounded-xl bg-white hover:bg-[#eaf3f4] flex justify-between px-[2%] items-center"
            style={{ width: `${windowWidth * 0.9}px`, marginInline: "auto" }}
          >
            <span
              className="no-underline hover:underline text-black text-3xl font-notoSansTeluguBold"
              style={{ fontSize: "2.25rem", lineHeight: 1.111111 }}
            >
              Books
            </span>
            {bookOpenDropDownList ? (
              <IoMdArrowDropup
                onClick={() => setBookOpenDropDownList(!bookOpenDropDownList)}
                className="text-3xl"
              />
            ) : (
              <IoMdArrowDropdown
                onClick={() => setBookOpenDropDownList(!bookOpenDropDownList)}
                className="text-3xl"
              />
            )}
          </span>
          <div
            className="w-[90%] absolute left-[5%] bottom-0 bg-gray-300 h-[3px]"
            style={{ width: `${windowWidth * 0.9}px`, marginInline: "auto" }}
          ></div>
        </div>
        {bookOpenDropDownList && (
          <AnimatePresence>
            <motion.div
              className="bg-white"
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 0.5, ease: easeOut }}
            >
              <div className="flex flex-col h-[240px] bg-white">
                <div
                  className="py-4 pt-[20px] px-[20%] bg-white h-[120px] relative"
                  style={{ width: `${windowWidth}px` }}
                >
                  <Link
                    className="no-underline hover:underline w-[90%] absolute left-[5%] h-16 rounded-xl bg-white hover:bg-[#eaf3f4] flex justify-start pl-[2%] items-center"
                    to=""
                    onClick={() => {
                      window.location.assign("/admin/books");
                      setAdminContextValue({
                        ...adminContextValue,
                        showAdminHeaderForMobileDesign: false,
                      });
                    }}
                    style={{
                      width: `${windowWidth * 0.9}px`,
                      marginInline: "auto",
                    }}
                  >
                    <span
                      className="no-underline hover:underline text-black text-3xl font-notoSansTeluguBold"
                      style={{ fontSize: "2.25rem", lineHeight: 1.111111 }}
                    >
                      Books
                    </span>
                  </Link>
                  <div
                    className="w-[90%] absolute left-[5%] bottom-0 bg-gray-300 h-[3px]"
                    style={{
                      width: `${windowWidth * 0.9}px`,
                      marginInline: "auto",
                    }}
                  ></div>
                </div>
                <div
                  className="py-4 pt-[20px] px-[20%] bg-white h-[120px] relative"
                  style={{ width: `${windowWidth}px` }}
                >
                  <Link
                    className="no-underline hover:underline w-[90%] absolute left-[5%] h-16 rounded-xl bg-white hover:bg-[#eaf3f4] flex justify-start pl-[2%] items-center"
                    to=""
                    onClick={() => {
                      window.location.assign("/admin/books/add-book");
                      setAdminContextValue({
                        ...adminContextValue,
                        showAdminHeaderForMobileDesign: false,
                      });
                    }}
                    style={{
                      width: `${windowWidth * 0.9}px`,
                      marginInline: "auto",
                    }}
                  >
                    <span
                      className="no-underline hover:underline text-black text-3xl font-notoSansTeluguBold"
                      style={{ fontSize: "2.25rem", lineHeight: 1.111111 }}
                    >
                      Add Book
                    </span>
                  </Link>
                  <div
                    className="w-[90%] absolute left-[5%] bottom-0 bg-gray-300 h-[3px]"
                    style={{
                      width: `${windowWidth * 0.9}px`,
                      marginInline: "auto",
                    }}
                  ></div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
        <div
          className="py-4 pt-[20px] px-[20%] bg-white h-[120px] relative"
          style={{ width: `${windowWidth}px` }}
        >
          <span
            onClick={() =>
              setBorrowedBookOpenDropDownList(!borrowedBookOpenDropDownList)
            }
            className="no-underline hover:underline hover:cursor-pointer w-[90%] absolute left-[5%] h-16 rounded-xl bg-white hover:bg-[#eaf3f4] flex justify-between px-[2%] items-center"
            style={{ width: `${windowWidth * 0.9}px`, marginInline: "auto" }}
          >
            <span
              className="no-underline hover:underline text-black text-3xl font-notoSansTeluguBold"
              style={{ fontSize: "2.25rem", lineHeight: 1.111111 }}
            >
              Borrows
            </span>
            {borrowedBookOpenDropDownList ? (
              <IoMdArrowDropup
                onClick={() =>
                  setBorrowedBookOpenDropDownList(!borrowedBookOpenDropDownList)
                }
                className="text-3xl"
              />
            ) : (
              <IoMdArrowDropdown
                onClick={() =>
                  setBorrowedBookOpenDropDownList(!borrowedBookOpenDropDownList)
                }
                className="text-3xl"
              />
            )}
          </span>
          <div
            className="w-[90%] absolute left-[5%] bottom-0 bg-gray-300 h-[3px]"
            style={{ width: `${windowWidth * 0.9}px`, marginInline: "auto" }}
          ></div>
        </div>
        {borrowedBookOpenDropDownList && (
          <AnimatePresence>
            <motion.div
              className="bg-white"
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 0.5, ease: easeOut }}
            >
              <div className="flex flex-col h-[240px] bg-white">
                <div
                  className="py-4 pt-[20px] px-[20%] bg-white h-[120px] relative"
                  style={{ width: `${windowWidth}px` }}
                >
                  <Link
                    className="no-underline hover:underline w-[90%] absolute left-[5%] h-16 rounded-xl bg-white hover:bg-[#eaf3f4] flex justify-start pl-[2%] items-center"
                    to=""
                    onClick={() => {
                      window.location.assign("/admin/borrowedbooks");
                      setAdminContextValue({
                        ...adminContextValue,
                        showAdminHeaderForMobileDesign: false,
                      });
                    }}
                    style={{
                      width: `${windowWidth * 0.9}px`,
                      marginInline: "auto",
                    }}
                  >
                    <span
                      className="no-underline hover:underline text-black text-3xl font-notoSansTeluguBold"
                      style={{ fontSize: "2.25rem", lineHeight: 1.111111 }}
                    >
                      Borrows
                    </span>
                  </Link>
                  <div
                    className="w-[90%] absolute left-[5%] bottom-0 bg-gray-300 h-[3px]"
                    style={{
                      width: `${windowWidth * 0.9}px`,
                      marginInline: "auto",
                    }}
                  ></div>
                </div>
                <div
                  className="py-4 pt-[20px] px-[20%] bg-white h-[120px] relative"
                  style={{ width: `${windowWidth}px` }}
                >
                  <Link
                    className="no-underline hover:underline w-[90%] absolute left-[5%] h-16 rounded-xl bg-white hover:bg-[#eaf3f4] flex justify-start pl-[2%] items-center"
                    to=""
                    onClick={() => {
                      window.location.assign(
                        "/admin/borrowedbooks/add-borrowedbook"
                      );
                      setAdminContextValue({
                        ...adminContextValue,
                        showAdminHeaderForMobileDesign: false,
                      });
                    }}
                    style={{
                      width: `${windowWidth * 0.9}px`,
                      marginInline: "auto",
                    }}
                  >
                    <span
                      className="no-underline hover:underline text-black text-3xl font-notoSansTeluguBold"
                      style={{ fontSize: "2.25rem", lineHeight: 1.111111 }}
                    >
                      Add Borrow
                    </span>
                  </Link>
                  <div
                    className="w-[90%] absolute left-[5%] bottom-0 bg-gray-300 h-[3px]"
                    style={{
                      width: `${windowWidth * 0.9}px`,
                      marginInline: "auto",
                    }}
                  ></div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
        <div
          className="py-4 px-[20%] pb-8 bg-white h-[120px] relative"
          style={{ width: `${windowWidth}px` }}
        >
          <Link
            onClick={() => {
              const userToken: string = getCookie("LMS");
              document.cookie = `LMS=${userToken}; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

              window.location.assign("/");
            }}
            className="no-underline hover:underline w-[90%] absolute left-[5%] h-16 rounded-xl bg-white hover:bg-[#eaf3f4] flex justify-start pl-[2%] items-center"
            to=""
            style={{ width: `${windowWidth * 0.9}px`, marginInline: "auto" }}
          >
            <span
              className="no-underline hover:underline text-black text-4xl font-notoSansTeluguBold"
              style={{ fontSize: "2.25rem", lineHeight: 1.111111 }}
            >
              Logout
            </span>
          </Link>
          <div
            className="w-[90%] absolute left-[5%] bottom-0 bg-gray-300 h-[3px]"
            style={{ width: `${windowWidth * 0.9}px`, marginInline: "auto" }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <main
      style={{
        width: "100%",
      }}
    >
      <AdminHeader />
      <AnimatePresence>
        {adminContextValue.showAdminHeaderForMobileDesign ? (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.5, ease: easeOut }}
          >
            <SlideUpBox />
          </motion.div>
        ) : (
          <Outlet />
        )}
      </AnimatePresence>
      <Footer />
    </main>
  );
};

export default AdminLayout;
