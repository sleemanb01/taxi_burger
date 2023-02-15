import { createContext, useCallback, useEffect, useState } from "react";
import { AuthCtx, userWToken } from "../types/types";

export const AuthContext = createContext<AuthCtx>({
  user: undefined,
  login: () => {},
  updateUser: () => {},
  logout: () => {},
});

let logoutTimer: ReturnType<typeof setTimeout>;

export const AuthContextProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [user, setUser] = useState<userWToken | undefined>(undefined);
  const [tokenExpirationDate, setTokenExpirationDate] = useState<Date | null>();

  const login = useCallback((user: userWToken) => {
    localStorage.setItem("userData", JSON.stringify(user));
    const EXPIRATION_TIME = 1000 * 60 * 60 * 12;
    const tokenExpirationDate = user.tokenExpiration
      ? new Date(user.tokenExpiration)
      : new Date(new Date().getTime() + EXPIRATION_TIME);
    user.tokenExpiration = tokenExpirationDate;
    setUser(user);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        id: user.id,
        token: user.token,
        name: user.name,
        email: user.email,
        tokenExpiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  const updateUser = useCallback((user: userWToken) => {
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("userData");
    setUser(undefined);
    setTokenExpirationDate(null);
  }, []);

  useEffect(() => {
    if (user && user.token && tokenExpirationDate) {
      let remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      if (remainingTime < 0) {
        remainingTime = 0;
      }
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [user, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      const data = JSON.parse(storedData);
      if (data && data.token && new Date(data.expiration) > new Date()) {
        const user = {
          id: data.id,
          email: data.email,
          name: data.name,
          token: data.token,
          tokenExpiration: new Date(data.expiration),
        };
        login(user);
      }
    }
  }, [login]);

  const value: AuthCtx = {
    user,
    updateUser,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
