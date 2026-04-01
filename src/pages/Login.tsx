import { Wrapper } from "../components/Wrapper";
import { Container } from "../components/Container";
import { PageHeader } from "../components/PageHeader";
import { Logo } from "../components/Logo";
import { AuthFormHeader } from "../components/AuthFormHeader";
import { Input } from "../components/Input/input";
import { Button } from "../components/Button";

import styles from "../pages/Auth.module.css";

export function Login() {
  return (
    <Wrapper>
      <Container>
        <PageHeader>Login</PageHeader>
        <Logo />
        <AuthFormHeader>Conecte-se!</AuthFormHeader>
        <form action="/home" method="post">
          <Input
            type="text"
            labelText="CPF ou E-mail"
            id="identifier"
            name="identifier"
            placeholder="123.456.789-10"
          />
          <Input
            type="password"
            labelText="Senha"
            id="password"
            name="password"
            placeholder="*********"
          />
          <Button>Enviar</Button>
        </form>
      </Container>
    </Wrapper>
  );
}
