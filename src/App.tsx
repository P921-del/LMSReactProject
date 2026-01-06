import "./App.css";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
//import PublicLayout from "./Components/PublicLayout/PublicLayout";
import Home from "./Components/Home/Home";
import LoginPage from "./routes/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminLayout from "./Components/AdminLayout/AdminLayout";
import MainAuthorPages from "./routes/Admin/Authors/MainAuthorPages";
import { AddAuthorPage } from "./routes/Admin/Authors/AddAuthorPage";
import { AuthorInventoryListPage } from "./routes/Admin/Authors/AuthorInventoryListPage";
import PublicLayout from "./Components/PublicLayout/PublicLayout";
import SignUpPage from "./routes/SignUp";
import ContactPage from "./routes/Contact";
import { UnauthorizedPage } from "./routes/UnauthorizedPage";
import { EditAuthorPage } from "./routes/Admin/Authors/EditAuthorPage";
import MainPublisherPages from "./routes/Admin/Publishers/MainPublisherPages";
import { PublisherInventoryListPage } from "./routes/Admin/Publishers/PublisherInventoryListPage";
import { AddPublisherPage } from "./routes/Admin/Publishers/AddPublisherPage";
import { EditPublisherPage } from "./routes/Admin/Publishers/EditPublisherPage";
import MainMemberPages from "./routes/Admin/Members/MainMemberPages";
import { MemberInventoryListPage } from "./routes/Admin/Members/MemberInventoryListPage";
import { AddMemberPage } from "./routes/Admin/Members/AddMemberPage";
import { EditMemberPage } from "./routes/Admin/Members/EditMemberPage";
import MainBookPages from "./routes/Admin/Books/MainBookPages";
import { BookInventoryListPage } from "./routes/Admin/Books/BookInventoryListPage";
import { AddBookPage } from "./routes/Admin/Books/AddBookPage";
import { EditBookPage } from "./routes/Admin/Books/EditBookPage";
import MainBorrowedBookPages from "./routes/Admin/BorrowedBooks/MainBorrowedBookPages";
import { BorrowedBookInventoryListPage } from "./routes/Admin/BorrowedBooks/BorrowedBookInventoryListPage";
import { AddBorrowedBookPage } from "./routes/Admin/BorrowedBooks/AddBorrowedBookPage";
import { EditBorrowedBookPage } from "./routes/Admin/BorrowedBooks/EditBorrowedBookPage";
import ShopPage from "./routes/Shop";
import CartPage from "./routes/Cart";
import BookDetailsPage from "./routes/BookDetailsForPublicOrStudent/BookDetailsPage";
import Shop from "./Components/Shop/Shop";

function App() {
  // const [count, setCount] = useState(0);
  const router = createBrowserRouter([
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        { index: true, element: <Home /> },
        {
          path: "authors",
          element: <MainAuthorPages />,
          children: [
            { index: true, element: <AuthorInventoryListPage /> },
            { path: "add-author", element: <AddAuthorPage /> },
            { path: "update-author/:authorId", element: <EditAuthorPage /> },
          ],
        },
        {
          path: "publishers",
          element: <MainPublisherPages />,
          children: [
            { index: true, element: <PublisherInventoryListPage /> },
            { path: "add-publisher", element: <AddPublisherPage /> },
            {
              path: "update-publisher/:publisherId",
              element: <EditPublisherPage />,
            },
          ],
        },
        {
          path: "members",
          element: <MainMemberPages />,
          children: [
            { index: true, element: <MemberInventoryListPage /> },
            { path: "add-member", element: <AddMemberPage /> },
            {
              path: "update-member/:memberId",
              element: <EditMemberPage />,
            },
          ],
        },
        {
          path: "books",
          element: <MainBookPages />,
          children: [
            { index: true, element: <BookInventoryListPage /> },
            { path: "add-book", element: <AddBookPage /> },
            {
              path: "update-book/:bookId",
              element: <EditBookPage />,
            },
          ],
        },
        {
          path: "borrowedbooks",
          element: <MainBorrowedBookPages />,
          children: [
            { index: true, element: <BorrowedBookInventoryListPage /> },
            { path: "add-borrowedbook", element: <AddBorrowedBookPage /> },
            {
              path: "update-borrowedbook/:borrowedbookId",
              element: <EditBorrowedBookPage />,
            },
          ],
        },
      ],
    },
    {
      path: "/",
      element: <PublicLayout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        { path: "register", element: <SignUpPage /> },
        { path: "login", element: <LoginPage /> },
        { path: "contact", element: <ContactPage /> },
        {
          path: "shop",
          element: <ShopPage />,
          children: [
            { index: true, element: <Shop /> },
            { path: ":bookId", element: <BookDetailsPage /> },
          ],
        },
        { path: "cart", element: <CartPage /> },
        { path: "un-authorized", element: <UnauthorizedPage /> },
      ],
    },
  ]);
  return (
    // <>
    //   {/*  <div>
    //     <a href="https://vite.dev" target="_blank">
    //       <img src={viteLogo} className="logo" alt="Vite logo" />
    //     </a>
    //     <a href="https://react.dev" target="_blank">
    //       <img src={reactLogo} className="logo react" alt="React logo" />
    //     </a>
    //   </div>
    //   <h1>Vite + React</h1>
    //   <div className="card">
    //     <button onClick={() => setCount((count) => count + 1)}>
    //       count is {count}
    //     </button>
    //     <p>
    //       Edit <code>src/App.jsx</code> and save to test HMR
    //     </p>
    //   </div>
    //   <p className="read-the-docs">
    //     Click on the Vite and React logos to learn more
    //   </p> */}

    // </>
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

export default App;
