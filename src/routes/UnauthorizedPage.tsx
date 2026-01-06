import React, { useEffect, useState } from "react";

function getCookie(cname: string) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export const UnauthorizedPage = () => {
  const [UnauthorizedPageHeight, setUnauthorizedPageHeight] = useState<number>(
    window.innerHeight
  );
  const [UnauthorizedPageWidth, setUnauthorizedPageWidth] = useState<number>(
    window.innerWidth
  );
  useEffect(() => {
    function handleResizing() {
      setUnauthorizedPageHeight(window.innerHeight);
      setUnauthorizedPageWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResizing);
    return () => window.removeEventListener("resize", handleResizing);
  }, []);
  return (
    <div
      className="flex flex-col lg:flex-row pt-10"
      style={{
        height: `${UnauthorizedPageHeight}px`,
        width: `${UnauthorizedPageWidth}px`,
      }}
    >
      <div
        className="lg:w-1/2"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: `${UnauthorizedPageWidth}px`,
        }}
      >
        <img
          src="/public/un-authorized-pic.png"
          alt="un-authorizedPicture"
          className="h-[300px] w-[300px] md:h-[400px] md:w-[400px] lg:h-[500px] lg:w-[500px] xl:h-[650px] xl:w-[650px]"
        />
      </div>
      <div
        className="mt-14 lg:mt-18 xl:mt-20 lg:w-1/2 flex justify-center xl:justify-start items-center"
        style={{ width: `${UnauthorizedPageWidth}px` }}
      >
        <div className="h-full md:h-1/2 font-sans text-gray-400 text-2xl">
          <h2 className="font-notoSansTeluguLight text-gray-500 text-5xl mb-5 md:mb-10">
            Sorry!
          </h2>
          <h3>You are not authorized to access this</h3>
          <h3>page. Please check your login</h3>
          <h3>credentials or contact the</h3>
          <h3>administrator for access.</h3>
          <span className="flex justify-center items-center mt-3 h-9">
            <span className="flex flex-row items-center gap-x-2">
              <h3
                className="font-notoSansTeluguMedium text-gray-600 mt-1"
                style={{ fontSize: "24px", color: "#737179" }}
              >
                Click To
              </h3>{" "}
              <div
                onClick={() => {
                  const userToken: string = getCookie("LMS");
                  document.cookie = `LMS=${userToken}; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                  window.location.assign("/");
                }}
                className="w-24 h-9 bg-[#1e9545] hover:bg-[#187736] text-gray-50 rounded-sm flex justify-center items-center font-sans"
              >
                <span
                  className="font-openSansRegular"
                  style={{ fontSize: "21px" }}
                >
                  Logout
                </span>
              </div>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
