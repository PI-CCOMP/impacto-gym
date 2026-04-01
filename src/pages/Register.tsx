import { Wrapper } from "../components/Wrapper";
import { Container } from "../components/Container";
import { Logo } from "../components/Logo";
import { PageHeader } from "../components/PageHeader";
import { Input } from "../components/Input/input";
import { Button } from "../components/Button";

import styles from "../pages/Auth.module.css";

export function Register() {
  return (
    <Wrapper>
      <Container>
        <Logo />
        <PageHeader>Cadastre-se!</PageHeader>
        <form action="/home" method="post">
          <Input
            type="text"
            labelText="Nome"
            id="name"
            name="name"
            placeholder="Arthur Ramos"
          />
          <Input
            type="text"
            labelText="CPF"
            id="cpf"
            name="cpf"
            placeholder="123.456.789-10"
          />
          <Input
            type="email"
            labelText="E-mail"
            id="email"
            name="email"
            placeholder="arthur@exemplo.com"
          />
          <Button>Continuar</Button>
        </form>
      </Container>
    </Wrapper>
  );
}
