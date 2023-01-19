import { Suspense, useContext, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { MainNavigation } from "./FC/shared/components/Navigation/MainNavigation";
import { AuthContext } from "./hooks/auth-context";
import { userWToken } from "./typing/types";
import React from "react";
import LoadingSpinner from "./FC/shared/components/UIElements/LoadingSpinner";

const Users = React.lazy(() => import("./FC/user/pages/Users"));
const NewStock = React.lazy(() => import("./FC/stocks/pages/NewStock"));
const Stocks = React.lazy(() => import("./FC/stocks/pages/Stocks"));
const Auth = React.lazy(() => import("./FC/user/pages/Auth"));

function App() {
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      const user: userWToken = JSON.parse(storedData);
      if (user.token) {
        authCtx.login(user);
      }
    }
  }, [authCtx, authCtx.isLoggedIn]);

  let routes;

  if (authCtx.isLoggedIn) {
    routes = (
      <Routes>
        <Route path="/" element={<Stocks />} />
        <Route path="/stocks/new" element={<NewStock />} />
        <Route path="/users" element={<Users />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<Stocks />} />
        <Route path="/users" element={<Users />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  return (
    <Router>
      <MainNavigation />
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
    </Router>
  );
}

export default App;
