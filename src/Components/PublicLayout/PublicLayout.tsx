import React, { useEffect, useState } from "react";
import { Outlet } from "react-router";
import Footer from "../Footer";
import Header from "../Header/Header";
import { getCookie } from "../../Fuctions";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { cartObjectType } from "../PublicLayout/Context";
import PublicContext from "../PublicLayout/Context";
import { API_BASE_URL } from "../../Constants";

function getStorageValue(key: string, defaultValue: cartObjectType[]) {
  const saved = localStorage.getItem(key);
  const initial = saved !== null ? JSON.parse(saved) : defaultValue;
  return initial;
}
function useLocalStorage(
  key: string,
  defaultValue: cartObjectType[]
): [cartObjectType[], React.Dispatch<React.SetStateAction<cartObjectType[]>>] {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
function PublicLayout() {
  const [cart, setCart] = useLocalStorage("LMSCart", []);
  const navigate = useNavigate();
  const [isStudent, setIsStudent] = useState<boolean>(false);
  useEffect(() => {
    async function fetchData() {
      try {
        const userToken = getCookie("LMS");
        const response = await fetch(`${API_BASE_URL}/Auth/me/${userToken}`, {
          method: "POST",
        });

        if (!response.ok) {
          toast.error("Loading Page Failed!", {
            position: "top-right",
          });
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          const { roles } = await response.json();
          setIsStudent(true);
          for (var i = 0; i < roles.length; i++) {
            if (roles[i] === "ADMIN") {
              navigate("/admin");
              setIsStudent(false);
              break;
            }
          }
        }
      } catch (error) {
        toast.error("Loading Page Failed!", {
          position: "top-right",
        });
        console.error("Error", error);
      }
    }
    fetchData();
  }, []);
  const userToken = getCookie("LMS");
  if (userToken === "" || isStudent) {
    return (
      <PublicContext.Provider value={{ cart, setCart }}>
        <PublicLayoutContent />
      </PublicContext.Provider>
    );
  }
}

function PublicLayoutContent() {
  return (
    <main
      style={{
        width: "100%",
      }}
    >
      <Header />
      <Outlet />
      {/*   <Footer /> */}
    </main>
  );
}
export default PublicLayout;
