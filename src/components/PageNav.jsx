import { NavLink } from "react-router-dom";
import styles from "./PageNav.module.css";
import Logo from "./Logo";
import { useAuth } from "../context/FakeAuthContext";
function AppNav() {
  const { isAuth } = useAuth();
  return (
    <div className={styles.nav}>
      <Logo />
      <ul>
        <li>
          <NavLink to={"/"}>Home</NavLink>
        </li>
        <li>
          <NavLink to={"/product"}>Product</NavLink>
        </li>
        <li>
          <NavLink to={"/pricing"}>Pricing</NavLink>
        </li>
        {!isAuth && (
          <li>
            <NavLink className={styles.ctaLink} to={"/login"}>
              Login
            </NavLink>
          </li>
        )}
      </ul>
    </div>
  );
}

export default AppNav;
