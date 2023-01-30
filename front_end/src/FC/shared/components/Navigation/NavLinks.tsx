import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../../../hooks/auth-context";
import "./NavLinks.css";

export function NavLinks() {
  const auth = useContext(AuthContext);

  const TXT_STOCK = "מלאי";
  const TXT_USERS = "משתמשים";
  const TXT_ADD_STOCK = "הוסף מלאי";
  const TXT_AUTH = "כניסה";
  const TXT_LOGOUT = "התנתק";

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/">{TXT_STOCK}</NavLink>
      </li>
      <li>
        <NavLink to="/users">{TXT_USERS}</NavLink>
      </li>
      {auth.isLoggedIn && auth.user?.isAdmin && (
        <li>
          <NavLink to={`/stocks/new/${undefined}`}>{TXT_ADD_STOCK}</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">{TXT_AUTH}</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>{TXT_LOGOUT}</button>
        </li>
      )}
    </ul>
  );
}
