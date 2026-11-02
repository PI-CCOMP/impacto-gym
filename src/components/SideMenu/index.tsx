import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  MenuIcon,
  X,
  User,
  Dumbbell,
  HelpCircle,
  MessageSquareWarning,
  Settings,
  LogOut,
} from "lucide-react";

import { Logo } from "../Logo";
import {
  apiPostAuthed,
  encerrarSessaoLocal,
  getPerfil,
} from "../../services/api";

import styles from "./styles.module.css";

export function SideMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const role = getPerfil();
  const canSee = {
    usuarios: role === "admin" || role === "recepcionista",
    treinos: role === "admin" || role === "instrutor",
    solicitacoes: role === "admin" || role === "instrutor",
    avisos: role === "admin" || role === "instrutor" || role === "recepcionista",
    configuracoes: true,
  };

  async function handleLogout() {
    let logoutWarning: string | undefined;
    try {
      await apiPostAuthed("/auth/logout", {});
    } catch (error) {
      logoutWarning =
        error instanceof Error
          ? error.message
          : "Não foi possível invalidar a sessão no servidor.";
    } finally {
      encerrarSessaoLocal();
      navigate("/dashboard", {
        replace: true,
        state: logoutWarning ? { logoutWarning } : null,
      });
    }
  }

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
          {canSee.usuarios && (
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
          )}
          {canSee.treinos && (
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
          )}
          {canSee.solicitacoes && (
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
          )}
          {canSee.avisos && (
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
          )}
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

        <button
          className={styles.logout}
          onClick={() => void handleLogout()}
        >
          <LogOut /> Sair
        </button>
      </nav>
    </>
  );
}
