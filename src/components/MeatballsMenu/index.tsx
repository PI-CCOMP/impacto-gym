import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import { useState } from "react";
import { Ellipsis, Settings } from "lucide-react";

export function MeatballsMenu() {
  const [open, setOpen] = useState(false);

  return (
    <nav className={styles.meatballsMenu} aria-label="Menu de opções">
      <button
        onClick={() => setOpen(!open)}
        className={styles.ellipsis}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Abrir menu"
      >
        <Ellipsis />
      </button>

      {open && (
        <ul className={styles.meatballsMenuOptions} role="menu">
          <li role="none">
            <Link to={"/configuracoes"} role="menuitem">
              <Settings aria-hidden="true" />
              Configurações
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}
