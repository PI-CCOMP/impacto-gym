import { Link } from "react-router-dom";

import styles from "./styles.module.css";

import { useState } from "react";

import { Ellipsis, Settings } from "lucide-react";

export function MeatballsMenu() {
  const [open, setOpen] = useState(false);

  function handleMenu() {
    setOpen(!open);
  }

  return (
    <div className={styles.meatballsMenu}>
      <button onClick={handleMenu} className={styles.ellipsis}>
        <Ellipsis />
      </button>

      {open && (
        <ul className={styles.meatballsMenuOptions}>
          <li>
            <Link to={"/configuracao"}>
              <Settings />
              Configurações
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
}
