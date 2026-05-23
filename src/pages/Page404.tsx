import { Link, useLocation } from "react-router-dom";

import { Container } from "../components/Container";

import styles from "./Page404.module.css";

import PageNotFoundImg from "../assets/img/illustrations/page-404.svg";

export function Page404() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");
  const homeLink = isDashboard ? "/dashboard" : "/";
  const homeLabel = isDashboard ? "Página Inicial" : "Página Inicial";

  return (
    <Container>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <img
          src={PageNotFoundImg}
          alt="Página não encontrada"
          className={styles.img}
        />

        <h2>Esse peso não existe por aqui</h2>
        <p>Página não encontrada</p>

        <p className={styles.back}>
          <Link to={homeLink}>
            <span className="highlight">{homeLabel}</span>
          </Link>
        </p>
      </div>
    </Container>
  );
}
