import { ContainerBackground } from "../components/ContainerBackground";
import { Button } from "../components/Button";
import { Logo } from "../components/Logo";

import { Link } from "react-router-dom";

import manBackground from "../assets/img/homem.jpeg";
import maleBackground from "../assets/img/mulher.jpg";

import styles from "../pages/Auth.module.css";

export function Index() {
  return (
    <ContainerBackground backgroundImages={[manBackground, maleBackground]}>
      <h1>
        Prepara-se para <br />
        <span>Transformar!</span>
      </h1>

      <p>
        Acompanhe sua rotina de treinos criada pelo seu instrutor. Estamos aqui
        para te ajudar em cada passo!
      </p>

      <Link to={"/login"}>
        <Button>Entrar</Button>
      </Link>
      <Link to={"/registrar"}>
        <p className={styles.secondaryLink}>Registrar</p>
      </Link>
      <Logo />
    </ContainerBackground>
  );
}
