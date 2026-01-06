import React from "react";
import { Link } from "react-router";
import CartBookInventoryList from "./CartBookInventoryList";
export default function Cart() {
  return (
    <div className="h-fit mb-10">
      <section className="bg-[#ecebdb] w-[95%] mx-auto h-96 flex flex-row gap-x[10%]">
        <div className="hidden md:block w-1/4 h-full bg-transparent">
          <img
            className="w-full h-full bg-cover"
            src={"/public/Shop/reading_books_one.png"}
            alt="Reading Books Image"
          />
        </div>
        <div className="w-full md:w-1/2 h-full flex justify-center items-center bg-transparent">
          <div className="flex flex-col gap-y-4">
            <h3 className="text-black font-notoSansTeluguBold text-4xl">
              SHOPPING CART
            </h3>
            <h3 className="text-gray-700 font-notoSansTeluguMedium text-xl flex flex-row gap-x-3">
              <Link
                className="font-notoSansTeluguMedium text-blue-600 hover:underline hover:text-blue-700"
                to="/"
                title="Home"
              >
                home
              </Link>
              <h3>/</h3>
              <h3 className="">cart</h3>
            </h3>
          </div>
        </div>
        <div className="hidden md:block w-1/4 h-full bg-transparent">
          <img
            className="w-full h-full bg-cover"
            src={"/public/Shop/reading_books_two.png"}
            alt="Reading Books Image"
          />
        </div>
      </section>
      <CartBookInventoryList />
    </div>
  );
}
