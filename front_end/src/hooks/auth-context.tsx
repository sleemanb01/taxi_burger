import { createContext, useCallback, useEffect, useState } from "react";
import { AuthCtx, userWToken } from "../typing/types";

export const AuthContext = createContext<AuthCtx>({
  isLoggedIn: false,
  user: undefined,
  login: () => {},
  updateUser: () => {},
  logout: () => {},
});
