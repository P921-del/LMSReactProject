import React, { useContext, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { HiDotsHorizontal } from "react-icons/hi";
import { FaAngleLeft, FaAngleRight, FaShoppingCart } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { getCookie, onlyNumbers } from "../../Fuctions";
//import { toast } from "react-toastify";
import { Link } from "react-router";
import { MdOutlineShoppingBag } from "react-icons/md";
import { FaDollarSign } from "react-icons/fa6";
import { RxSlash } from "react-icons/rx";
import { TiMinus } from "react-icons/ti";
import PublicContext, { cartObjectType } from "../PublicLayout/Context";
import { loadStripe } from "@stripe/stripe-js";
import { API_BASE_URL } from "../../Constants";
import { toast } from "react-toastify";
import CheckoutForm from "../Checkout/CheckoutForm";

export default function CartBookInventoryList() {
  const publicContext = useContext(PublicContext);
  if (!publicContext) {
    throw new Error("ExampleComponent must be used within a PublicProvider");
  }
  useEffect(() => {
    console.log(publicContext.cart);
  }, []);
  function UpdateToCart(bookId: string) {
    publicContext?.setCart((prevCart) => {
      const found = prevCart.findIndex((item) => item.bookId === bookId);

      if (found !== -1) {
        const newQuantity = publicContext.cart.find(
          (book) => book.bookId === prevCart[found].bookId
        )?.quantity;
        if (newQuantity !== undefined) {
          const updatedItem = {
            ...prevCart[found],
            quantity: newQuantity,
          };

          return prevCart.map((item, index) =>
            index === found ? updatedItem : item
          );
        }
        return prevCart;
      }
      return prevCart;
    });
  }
  interface SubBookListProps {
    currentItems: cartObjectType[];
  }

  interface PaginatedItemsProps {
    itemsPerPage: number;
  }

  const SubBookList = (props: SubBookListProps) => {
    console.log(props.currentItems);

    function RemoveFromCart(bookId: string) {
      if (!publicContext) {
        throw new Error(
          "ExampleComponent must be used within an PublicProvider"
        );
      }

      publicContext.setCart((prevCart) => {
        let filtered = prevCart.filter((item) => item.bookId !== bookId);
        return filtered;
      });
    }
    return (
      <div className="w-[95%] mx-auto h-fit mb-10">
        <div className="w-[95%] mx-auto mt-10 flex flex-col items-center mb-8">
          <div className="w-full mb-4 flex justify-center items-center">
            {" "}
            <h3 className="text-black font-notoSansTeluguBold text-4xl">
              PRODUCTS ADDED
            </h3>
          </div>
        </div>

        <div className="w-[70%] mx-auto grid gap-x-[10%] grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 mt-5">
          {publicContext.cart.map((item) => {
            return (
              <div
                key={item.bookId}
                className="border border-gray-600 rounded-sm pt-5 relative"
              >
                <div className="w-[85%] mx-auto h-72 mb-2">
                  {/* FIXED: Base64 must include the actual string */}
                  <img
                    src={`data:image/png;base64,${item.bookCover}`}
                    alt={item.bookTitle + " Cover"}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div
                  onClick={() => RemoveFromCart(item.bookId)}
                  className="absolute top-[2%] right-[3%] w-10 h-10 bg-red-700 rounded-sm hover:cursor-pointer hover:bg-red-800 flex justify-center items-center"
                >
                  <IoClose className="text-white text-xl lg:text-2xl" />
                </div>
                {/* You forgot to close this div structure */}
                <div className="flex justify-center items-center mb-2">
                  <h3 className="font-notoSansTeluguMedium text-md text-gray-600">
                    {item.bookTitle}
                  </h3>
                </div>
                <div className="flex justify-center items-center mb-2">
                  <h3 className="font-notoSansTeluguMedium text-md text-red-700 flex flex-row gap-x-0 text-2xl">
                    <FaDollarSign className="text-2xl" />
                    {item.bookCost}
                    <RxSlash className="text-2xl" />
                    <TiMinus className="text-2xl" />
                  </h3>
                </div>
                <div className="w-[70%] mx-auto flex flex-row gap-x-[5%]">
                  <div className="w-1/3 border-[3px] border-gray-400 rounded-sm h-11 mb-5">
                    <input
                      className="w-full h-full pl-[15%] border-none focus:border-none rounded-sm"
                      value={item.quantity}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        publicContext.setCart((prevState) => {
                          return prevState.map((book) => {
                            if (book.bookId === item.bookId)
                              return {
                                ...book,
                                quantity: parseInt(event.target.value),
                              };
                            return book;
                          });
                        })
                      }
                      min={1}
                      max={10}
                      type="number"
                      onKeyDown={onlyNumbers}
                    />
                  </div>
                  <button
                    onClick={() => UpdateToCart(item.bookId)}
                    className="font-notoSansTeluguRegular text-md bg-amber-400 hover:bg-amber-500 text-white px-8 pt-3 pb-2 border rounded-md mb-5"
                  >
                    Update
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  function PaginatedItems(props: PaginatedItemsProps) {
    if (!publicContext) {
      throw new Error("ExampleComponent must be used within an PublicProvider");
    }
    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);

    // Simulate fetching items from another resources.
    // (This could be items from props; or items loaded in a local state
    // from an API endpoint with useEffect and useState)
    const endOffset = itemOffset + props.itemsPerPage;
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);
    const currentItems = publicContext.cart.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(publicContext.cart.length / props.itemsPerPage);

    // Invoke when user click to request another page.
    const handlePageClick = (event: { selected: number }) => {
      const newOffset =
        (event.selected * props.itemsPerPage) % publicContext.cart.length;
      console.log(
        `User requested page number ${event.selected}, which is offset ${newOffset}`
      );
      setItemOffset(newOffset);
    };
    const [isOpened, setIsOpened] = useState<boolean>(false);
    async function makeStripePayment() {
      // Load Stripe with your publishable key
      const stripePromise = loadStripe(
        "pk_test_51SlaoNCrS8PNYQnxaO3s8enExLtsmIUQgeIx8OaXAgLUMpFbmsaimUJNuy2zoU4WgKOkXV5uUn8grJmRqzt8IbL600l8EPwtPj"
      ); // Use environment variables
      const response = await fetch(
        `${API_BASE_URL}/StripePayment/create-checkout-session?customarToken=${getCookie("LMS")}`,
        {
          body: JSON.stringify(publicContext?.cart),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      if (result.ok) {
        toast.success("Your Payment successed");
        const data = result.clientSecret;
        console.log(data);
      }
    }
    return publicContext.cart.length > 0 ? (
      <div className="mb-20">
        {isOpened ? (
          <CheckoutForm isOpened={isOpened} setIsOpened={setIsOpened} />
        ) : null}
        <SubBookList currentItems={currentItems} />
        <div className="w-full flex justify-center items-center mt-16">
          <div className="lg:w-[90%] lg:mx-auto">
            {" "}
            <ReactPaginate
              className="mb-5 w-[90%] md:w-full h-10 md:h-14 lg:h-16 xl:h-18 2xl:h-20 flex flex-row gap-x-4 justify-center font-sans font-semibold"
              activeClassName="bg-blue-600  text-white w-16 h-[90%] flex items-center justify-center hover:cursor-default hover:bg-blue-600 rounded-lg"
              activeLinkClassName="text-lg bg-blue-600 hover:bg-blue-600 text-white w-full flex items-center justify-center hover:cursor-default rounded-lg"
              pageClassName="bg-[#e7ebf0] w-16 h-[90%] flex items-center justify-center hover:bg-blue-600 hover:cursor-pointer rounded-lg"
              pageLinkClassName="text-xl md:text-xl lg:text-xl xl:text-2xl 2xl:text-2xl text-black hover:text-white w-full h-full flex items-center justify-center hover:cursor-pointer rounded-lg"
              breakClassName="w-16 h-[90%] bg-white flex items-center justify-center text-blue-600  hover:bg-gray-100  hover:cursor-pointer"
              breakLinkClassName="text-lg text-blue-600 w-full h-full flex items-center justify-center hover:cursor-pointer rounded-lg"
              previousClassName="w-16 h-[90%] bg-blue-600 flex items-center justify-center hover:cursor-pointer  hover:bg-blue-700 rounded-lg"
              previousLinkClassName="text-lg text-white flex items-center justify-center hover:cursor-pointer"
              nextClassName="w-16 h-[90%] bg-blue-600 flex items-center justify-center text-white hover:cursor-pointer hover:bg-blue-700 rounded-lg"
              nextLinkClassName="text-lg text-white flex items-center justify-center hover:cursor-pointer rounded-lg"
              disabledClassName="w-16 h-[90%] bg-red-600 flex items-center justify-center hover:bg-red-700 hover:cursor-not-allowed"
              disabledLinkClassName="text-lg text-white w-full h-[90%] flex items-center justify-center text-white bg-red-700 hover:bg-red-700 hover:cursor-not-allowed rounded-lg"
              breakLabel={<HiDotsHorizontal className="text-lg" />}
              nextLabel={
                <FaAngleRight className="text-lg md:text-3xl lg:text-2xl xl:text-3xl 2xl:text-4xl" />
              }
              onPageChange={handlePageClick}
              onClick={handlePageClick}
              eventListener="onClick"
              pageRangeDisplayed={3}
              pageCount={pageCount}
              previousLabel={
                <FaAngleLeft className="text-lg md:text-3xl lg:text-2xl xl:text-3xl 2xl:text-4xl" />
              }
              renderOnZeroPageCount={null}
            />
          </div>
        </div>
        <div className="my-6 flex justify-center items-center">
          <button
            className="bg-red-700 hover:bg-red-800 hover:cursor-pointer text-white text-center pt-4 py-3 px-12 rounded-md font-notoSansTeluguRegular text-xl"
            type="button"
            onClick={() => publicContext.setCart([])}
          >
            Delete All
          </button>
        </div>
        <div className="mb-3 w-[80%] mx-auto border border-gray-800 pt-5 pb-7 flex flex-col gap-y-5">
          {" "}
          <div className="flex justify-center items-center mb-2">
            <h3 className="text-gray-600 font-notoSansTeluguMedium text-2xl">
              grand total :{" "}
            </h3>
            <h3 className="font-notoSansTeluguMedium text-md text-red-700 flex flex-row gap-x-0 text-2xl">
              <FaDollarSign className="text-2xl" />
              {publicContext.cart.reduce(
                (currentValue, item) =>
                  item.bookCost * item.quantity + currentValue,
                0
              )}
              <RxSlash className="text-2xl" />
              <TiMinus className="text-2xl" />
            </h3>
          </div>
          <div className="flex justify-center items-center gap-x-[3%]">
            <button
              className="bg-amber-500 hover:bg-amber-600 hover:cursor-pointer text-white text-center pt-3 py-2 px-10 rounded-md font-notoSansTeluguRegular text-xl"
              type="button"
              onClick={() => window.location.assign("/shop")}
            >
              Continue Shopping
            </button>
            <button
              onClick={() =>
                getCookie("LMS") === null || getCookie("LMS") === ""
                  ? window.location.assign("/login")
                  : makeStripePayment()
              }
              className="bg-purple-800 hover:bg-purple-900 hover:cursor-pointer text-white text-center pt-3 py-2 px-13 rounded-md font-notoSansTeluguRegular text-xl"
              type="button"
            >
              Proceed To Checkout
            </button>
          </div>
        </div>
      </div>
    ) : (
      <div className="w-full h-[80vh] flex flex-col justify-center items-center text-center px-4">
        <div className="bg-gray-100 p-8 rounded-full mb-6 flex justify-center items-center">
          <FaShoppingCart className="text-6xl text-gray-500" />
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          Your Cart is Empty
        </h2>

        <p className="text-gray-500 text-lg mb-6">
          Looks like you haven’t added anything yet.
        </p>

        <Link
          to="/shop"
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-6 py-3 rounded-lg text-lg shadow-md transition-all"
        >
          <MdOutlineShoppingBag className="text-2xl" />
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <PaginatedItems itemsPerPage={4} />
    </div>
  );
}
