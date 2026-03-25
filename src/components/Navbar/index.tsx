import styles from "./styles.module.css";

import { Home, MessageSquare, History } from "lucide-react";

export function Navbar() {
  return (
    <nav className={styles.container}>
      <ul className={styles.menu}>
        <li>
          <a href="#">
            {" "}
            <Home />
            Início
          </a>
        </li>
        <li>
          <a href="#">
            {" "}
            <MessageSquare />
            Avisos
          </a>
        </li>
        <li>
          <a href="#">
            {" "}
            <History />
            Historíco
          </a>
        </li>
      </ul>
    </nav>
  );
}
