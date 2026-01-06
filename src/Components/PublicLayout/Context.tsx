import { createContext } from "react";

export interface cartObjectType {
  bookId: string;
  bookCover: Uint8Array;
  bookTitle: string;
  bookCost: number;
  quantity: number;
}

interface PublicContextInterface {
  cart: cartObjectType[];
  // eslint-disable-next-line no-undef
  setCart: React.Dispatch<React.SetStateAction<cartObjectType[]>>;
}

const PublicContext = createContext<PublicContextInterface | null>(null);
export default PublicContext;
