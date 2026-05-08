import { NavLink } from "react-router-dom";
import styles from "./styles.module.css";
import { Home, MessageSquare, History } from "lucide-react";

export function Navbar() {
  return (
    <nav className={styles.container}>
      <ul className={styles.menu}>
        <li>
          <NavLink
            to="/inicio"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            <Home />
            Início
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/avisos"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            <MessageSquare />
            Avisos
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/historico"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            <History />
            Histórico
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
