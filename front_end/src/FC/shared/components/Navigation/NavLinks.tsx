import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../../../hooks/auth-context";
import "./NavLinks.css";

export function NavLinks() {
  const auth = useContext(AuthContext);

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/">STOCKS</NavLink>
      </li>
      <li>
        <NavLink to="/users">USERS</NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/stocks/new">ADD STOCK</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">AUTHENTICATE</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>LOGOUT</button>
        </li>
      )}
    </ul>
  );
}
