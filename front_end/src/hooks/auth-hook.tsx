import { useState, useCallback, useEffect } from "react";
import { userWToken } from "../typing/types";

let logoutTimer: ReturnType<typeof setTimeout>;

export const useAuth = () => {
  const [user, setUser] = useState<userWToken | undefined>(undefined);
  const [tokenExpirationDate, setTokenExpirationDate] = useState<Date | null>();

  const login = useCallback((user: userWToken) => {
    localStorage.setItem("userData", JSON.stringify(user));
    setUser(user);
    const EXPIRATION_TIME = 1000 * 60 * 60 * 12;
    const tokenExpirationDate =
      user.tokenExpiration || new Date(new Date().getTime() + EXPIRATION_TIME);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        id: user.id,
        token: user.token,
        expiration: tokenExpirationDate.toISOString(),
        isAdmin: user.isAdmin,
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
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
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
          isAdmin: data.isAdmin,
        };
        login(user);
      }
    }
  }, [login]);

  return { user, updateUser, login, logout };
};
