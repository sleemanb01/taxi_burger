import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NewAssignment from "../FC/pages/CRUD/NewAssignment";
import UpdateAssignment from "../FC/pages/CRUD/UpdateAssignment";
import { StocksWActions } from "../types/types";

const Stocks = React.lazy(() => import("../FC/pages/Stocks"));
const Attendace = React.lazy(() => import("../FC/pages/Attendace"));
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
}: {
  stocksWActions: StocksWActions;
}) {
  const routes = (
    <Routes>
      <Route path="/" element={<Stocks stocksWActions={stocksWActions} />} />
      <Route path="/attendace" element={<Attendace />} />
      <Route path="/assignments" element={<Assignments />} />
      <Route path="/assignments/new" element={<NewAssignment />} />
      <Route path="/assignments/:assignmentId" element={<UpdateAssignment />} />
      <Route path="/stocks/new/:categoryId" element={<NewStock />} />
      <Route path="/stocks/:stockId" element={<UpdateStock />} />
      <Route path="/category/new" element={<NewCategory />} />
      <Route path="/category/:categoryId" element={<UpdateCategory />} />
      <Route path="/users" element={<Users />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );

  return routes;
}
