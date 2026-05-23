import { ContainerBackground } from "../../components/ContainerBackground";
import { Button } from "../../components/Button";
import { Logo } from "../../components/Logo";

import { Link } from "react-router-dom";

import styles from "../Member/Auth.module.css";

// Em produção: URLs das imagens de fundo vêm da configuração do sistema (ex: GET /settings/hero-images)
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
];

export function Index() {
  return (
    <ContainerBackground backgroundImages={HERO_IMAGES}>
      <h1 className={styles.heroTitle}>
        Prepara-se para <br />
        <span className="highlight">Transformar!</span>
      </h1>

      <p>
        Acompanhe sua rotina de treinos criada pelo seu instrutor. Estamos aqui
        para te ajudar em cada passo!
      </p>

      <Link to={"/login"}>
        <Button>Entrar</Button>
      </Link>
      <Link to={"/registro"}>
        <p className={styles.secondaryLink}>Registrar</p>
      </Link>
      <Logo />
    </ContainerBackground>
  );
}
