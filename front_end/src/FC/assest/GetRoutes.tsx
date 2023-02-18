import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import {
  AssignmentsWActions,
  StocksWActions,
  userWToken,
} from "../../types/types";

const Auth = React.lazy(() => import("../pages/Auth"));
const Stocks = React.lazy(() => import("../pages/Stocks"));
const DashBoard = React.lazy(() => import("../pages/DashBoard"));
const Assignments = React.lazy(() => import("../pages/Assignments"));
const Users = React.lazy(() => import("../pages/Users"));
const NewStock = React.lazy(() => import("../pages/NewStock"));
const NewCategory = React.lazy(() => import("../pages/NewCategory"));
const UpdateStock = React.lazy(() => import("../pages/UpdateStock"));
const UpdateCategory = React.lazy(() => import("../pages/UpdateCategory"));

export function GetRoutes({
  stocksWActions,
  user,
  assignmentsWActions,
}: {
  stocksWActions: StocksWActions;
  user: userWToken | undefined;
  assignmentsWActions: AssignmentsWActions;
}) {
  let routes;

  if (user?.token) {
    routes = (
      <Routes>
        <Route path="/" element={<Stocks stocksWActions={stocksWActions} />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route
          path="/assignements"
          element={<Assignments assignmentsWActions={assignmentsWActions} />}
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

  return routes;
}
