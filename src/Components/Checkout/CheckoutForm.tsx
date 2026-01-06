import { PaymentElement } from "@stripe/react-stripe-js/checkout";
import { SetStateAction } from "react";
import { IoClose } from "react-icons/io5";

type Props = {
  isOpened: boolean;
  // eslint-disable-next-line no-undef
  setIsOpened: React.Dispatch<SetStateAction<boolean>>;
};

export default function CheckoutForm(props: Props) {
  return (
    <div
      className="flex-col"
      style={props.isOpened ? { display: "flex" } : { display: "none" }}
    >
      <div
        className="bg-red-600 hover:bg-red-700"
        onClick={() => props.setIsOpened(false)}
      >
        <IoClose />
      </div>
      <form>
        <PaymentElement />
        <button type="submit"></button>
      </form>
    </div>
  );
}
