import { createContext } from "react";
import { AuthCtx } from "../typing/types";

export const AuthContext = createContext<AuthCtx>({
  user: undefined,
  login: () => {},
  updateUser: () => {},
  logout: () => {},
});
