import { createContext } from "react";
export interface AdminContextValueInterface {
  theme: string;
  showAdminHeaderForMobileDesign: boolean;
}
export interface AdminContextInterface {
  adminContextValue: AdminContextValueInterface;
  // eslint-disable-next-line no-undef
  setAdminContextValue: React.Dispatch<
    // eslint-disable-next-line no-undef
    React.SetStateAction<AdminContextValueInterface>
  >;
}
const AdminContext = createContext<AdminContextInterface | null>(null);
export default AdminContext;
