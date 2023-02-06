import { Suspense, useEffect, useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { AuthContext } from "./hooks/auth-context";
import { userWToken } from "./typing/types";
import React from "react";
import LoadingSpinner from "./FC/shared/components/UIElements/LoadingSpinner";
import { IStock } from "./typing/interfaces";
import { RTL } from "./FC/assest/RTL";
import ResponsiveAppBar from "./FC/shared/components/Navigation/ResponsiveAppBar";
import { useAuth } from "./hooks/auth-hook";

const Users = React.lazy(() => import("./FC/user/pages/Users"));
const NewStock = React.lazy(() => import("./FC/stocks/pages/NewStock"));
const Stocks = React.lazy(() => import("./FC/stocks/pages/Stocks"));
const UpdateStock = React.lazy(() => import("./FC/stocks/pages/UpdateStock"));
const Auth = React.lazy(() => import("./FC/user/pages/Auth"));
const NewCategory = React.lazy(() => import("./FC/stocks/pages/NewCategory"));
const UpdateCategory = React.lazy(
  () => import("./FC/stocks/pages/UpdateCategory")
);

function App() {
  const [stocks, setStocks] = useState<IStock[]>([]);
  const [displayArray, setDisplayArray] = useState<string[]>([]);

  const { user, updateUser, login, logout } = useAuth();

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");

    if (storedUser) {
      const user: userWToken = JSON.parse(storedUser);
      if (user.token) {
        login(user);
      }
    }
  }, [login]);

  const categoryClickHandler = (id: string) => {
    const alreadyExists = displayArray.includes(id);

    if (alreadyExists) {
      setDisplayArray((prev) => prev.filter((e) => e !== id));
      return;
    }

    setDisplayArray((prev) => [...prev, id]);
    const element = document.getElementById(`${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  let routes;

  if (user?.token) {
    routes = (
      <Routes>
        <Route
          path="/"
          element={
            <Stocks
              setter={setStocks}
              clickHandler={categoryClickHandler}
              displayArray={displayArray}
            />
          }
        />
        <Route path="/stocks/new/:categoryId" element={<NewStock />} />
        <Route path="/stocks/:stockId" element={<UpdateStock />} />
        <Route path="/category/new" element={<NewCategory />} />
        <Route path="/category/:categoryId" element={<UpdateCategory />} />
        <Route path="/users" element={<Users />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!user?.token,
        user: user,
        updateUser: updateUser,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <RTL>
          <ResponsiveAppBar
            stocks={stocks}
            clickHandler={categoryClickHandler}
          />
          <main>
            <Suspense
              fallback={
                <div className="center">
                  <LoadingSpinner asOverlay />
                </div>
              }
            >
              {routes}
            </Suspense>
          </main>
        </RTL>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
