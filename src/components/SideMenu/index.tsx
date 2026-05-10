import { NavLink } from "react-router-dom";
import { useState } from "react";

import {
  MenuIcon,
  X,
  User,
  Dumbbell,
  HelpCircle,
  MessageSquareWarning,
  Settings,
} from "lucide-react";

import { Logo } from "../Logo";

import styles from "./styles.module.css";

export function SideMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className={styles.hamburger} onClick={() => setIsOpen(true)}>
        <MenuIcon />
      </button>

      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)} />
      )}

      <nav className={`${styles.menu} ${isOpen ? styles.menuOpen : ""}`}>
        <div className={styles.menuHeader}>
          <Logo />
          <button
            className={styles.closeButton}
            onClick={() => setIsOpen(false)}
          >
            <X />
          </button>
        </div>

        <ul>
          <li>
            <NavLink
              to="/dashboard/usuarios"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ""}`
              }
              onClick={() => setIsOpen(false)}
            >
              <User /> Usuários
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/treinos"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ""}`
              }
              onClick={() => setIsOpen(false)}
            >
              <Dumbbell /> Treinos
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/solicitacoes_auxilio"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ""}`
              }
              onClick={() => setIsOpen(false)}
            >
              <HelpCircle /> Solicitações Auxílio
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/avisos"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ""}`
              }
              onClick={() => setIsOpen(false)}
            >
              <MessageSquareWarning /> Avisos
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/configuracoes"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ""}`
              }
              onClick={() => setIsOpen(false)}
            >
              <Settings /> Configurações
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
}
