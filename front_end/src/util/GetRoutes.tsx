import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NewAssignment from "../FC/pages/CRUD/NewAssignment";
import UpdateAssignment from "../FC/pages/CRUD/UpdateAssignment";
import {
  StocksWActions,
  userWToken,
  AssignmentsWActions,
} from "../types/types";

const Auth = React.lazy(() => import("../FC/pages/Auth"));
const Stocks = React.lazy(() => import("../FC/pages/Stocks"));
const DashBoard = React.lazy(() => import("../FC/pages/DashBoard"));
const Assignments = React.lazy(() => import("../FC/pages/Assignments"));
const Users = React.lazy(() => import("../FC/pages/Users"));
const NewStock = React.lazy(() => import("../FC/pages/CRUD/NewStock"));
const NewCategory = React.lazy(() => import("../FC/pages/CRUD/NewCategory"));
const UpdateStock = React.lazy(() => import("../FC/pages/CRUD/UpdateStock"));
const UpdateCategory = React.lazy(
  () => import("../FC/pages/CRUD/UpdateCategory")
);

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
        <Route path="/assignments/new" element={<NewAssignment />} />
        <Route
          path="/assignments/:assignmentId"
          element={<UpdateAssignment />}
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
