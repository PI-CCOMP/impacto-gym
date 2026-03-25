import { Wrapper } from "../components/Wrapper";
import { ContainerBackground } from "../components/ContainerBackground";
import { Button } from "../components/Button";
import { Logo } from "../components/Logo";

import manBackground from "../assets/img/homem.png";
import maleBackground from "../assets/img/mulher.png";

export function Index() {
  return (
    <Wrapper>
      <ContainerBackground backgroundImages={[manBackground, maleBackground]}>
        <h1>
          Prepara-se para <span>Transformar!</span>
        </h1>

        <p>
          Acompanhe sua rotina de treinos criada pelo seu instrutor. Estamos
          aqui para te ajudar em cada passo!
        </p>

        <a href="/login">
          <Button>Entrar</Button>
        </a>
        <a href="/register">Registrar</a>
        <Logo />
      </ContainerBackground>
    </Wrapper>
  );
}
