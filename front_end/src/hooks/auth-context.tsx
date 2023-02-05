import { createContext } from "react";
import { AuthCtx } from "../typing/types";

export const AuthContext = createContext<AuthCtx>({
  isLoggedIn: false,
  user: undefined,
  login: () => {},
  updateUser: () => {},
  logout: () => {},
});
