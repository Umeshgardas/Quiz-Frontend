import { createContext } from "react";

export const UserContext = createContext({
  userEmail: null,
  setUserEmail: () => {},
  userRole: null,
  setUserRole: () => {},
});
