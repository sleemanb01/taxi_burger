import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../hooks/auth-context";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import GroupIcon from "@mui/icons-material/Group";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import "./NavLinks.css";

export function NavLinks() {
  const auth = useContext(AuthContext);
  const nav = useNavigate();

  const TXT_STOCK = "מלאי";
  const TXT_USERS = "משתמשים";
  const TXT_ADD_STOCK = "הוסף מלאי";
  const TXT_AUTH = "כניסה";
  const TXT_LOGOUT = "התנתק";

  return (
    <ul className="nav-links">
      <li
        onClick={() => {
          nav("/");
        }}
      >
        {/* <NavLink to="/">{TXT_STOCK}</NavLink> */}
        <WarehouseIcon />
        <h3>{TXT_STOCK}</h3>
      </li>
      <li onClick={() => nav("/users")}>
        {/* <NavLink to="/users">{TXT_USERS}</NavLink> */}
        <GroupIcon />
        <h3>{TXT_USERS}</h3>
      </li>
      {auth.isLoggedIn && auth.user?.isAdmin && (
        <li
          onClick={() => {
            nav("/stocks/new/undefined");
          }}
        >
          {/* <NavLink to={`/stocks/new/undefined`}>{TXT_ADD_STOCK}</NavLink> */}
          <AddCircleOutlineIcon />
          <h3>{TXT_ADD_STOCK}</h3>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li
          onClick={() => {
            nav("/auth");
          }}
        >
          {/* <NavLink to="/auth">{TXT_AUTH}</NavLink> */}
          <AccountCircleIcon />
          <h3>{TXT_AUTH}</h3>
        </li>
      )}
      {auth.isLoggedIn && (
        <li onClick={auth.logout}>
          <LogoutIcon />
          <h3>{TXT_LOGOUT}</h3>
          {/* <button onClick={auth.logout}>{TXT_LOGOUT}</button> */}
        </li>
      )}
    </ul>
  );
}
