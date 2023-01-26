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
const UpdateStock = React.lazy(() => import("./FC/stocks/pages/UpdateStock"));
const Auth = React.lazy(() => import("./FC/user/pages/Auth"));
const NewCategory = React.lazy(() => import("./FC/stocks/pages/NewCategory"));
const UpdateCategory = React.lazy(
  () => import("./FC/stocks/pages/UpdateCategory")
);

function App() {
  const { login, isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      const user: userWToken = JSON.parse(storedUser);
      if (user.token) {
        login(user);
      }
    }
  }, [login]);

  let routes;

  if (isLoggedIn) {
    routes = (
      <Routes>
        <Route path="/" element={<Stocks />} />
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
