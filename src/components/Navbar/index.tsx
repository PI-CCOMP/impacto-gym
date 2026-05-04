import { Link } from "react-router-dom";

import styles from "./styles.module.css";

import { Home, MessageSquare, History } from "lucide-react";

{
  /* fazer verificacao se estou nessa rota entao icone fica azul */
}

export function Navbar() {
  return (
    <nav className={styles.container}>
      <ul className={styles.menu}>
        <li>
          <Link to={"/inicio"}>
            <Home />
            Início
          </Link>
        </li>
        <li>
          <Link to={"/avisos"}>
            <MessageSquare />
            Avisos
          </Link>
        </li>
        <li>
          <Link to={"/historico"}>
            <History />
            Historíco
          </Link>
        </li>
      </ul>
    </nav>
  );
}
