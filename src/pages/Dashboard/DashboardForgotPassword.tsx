import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { Container } from "../../components/Container";
import { Logo } from "../../components/Logo";
import { PageHeader } from "../../components/PageHeader";
import { FormHeader } from "../../components/FormHeader";
import { Input } from "../../components/Input/input";
import { Button } from "../../components/Button";
import { Wrapper } from "../../components/Wrapper";

import { validateEmailRequired } from "../../validators";

export function DashboardForgotPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const isFromSettings = location.pathname === "/dashboard/configuracoes/alterar-senha";

  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
    setTouched(true);
    setError(validateEmailRequired(e.target.value));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitAttempted(true);
    const newError = validateEmailRequired(value);
    setError(newError);
    if (newError) return;
    navigate("/dashboard/mfa", {
      state: {
        action: "change-password",
        redirectTo: isFromSettings ? "/dashboard/configuracoes" : undefined,
      },
    });
  }

  const form = (
    <>
      <PageHeader onBack={() => navigate(-1)}>Alterar Senha</PageHeader>
      <FormHeader subtitle="Preencha o campo abaixo">
        Insira o seu e-mail!
      </FormHeader>
      <form onSubmit={handleSubmit}>
        <Input
          labelText="E-mail"
          type="email"
          id="email"
          name="email"
          placeholder="arthur@exemplo.com"
          value={value}
          onChange={handleChange}
          errorMessage={touched || submitAttempted ? error : ""}
          autoComplete="email"
        />
        <Button type="submit">Avançar</Button>
      </form>
    </>
  );

  if (isFromSettings) {
    return (
      <Container>
        <Wrapper>
          <Container isDashboard>{form}</Container>
        </Wrapper>
      </Container>
    );
  }

  return (
    <Container>
      <Logo />
      {form}
    </Container>
  );
}
