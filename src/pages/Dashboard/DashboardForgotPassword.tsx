import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Container } from "../../components/Container";
import { PageHeader } from "../../components/PageHeader";
import { Input } from "../../components/Input/input";
import { Button } from "../../components/Button";
import { Wrapper } from "../../components/Wrapper";

import { validateEmailRequired } from "../../validators";

export function DashboardForgotPassword() {
  const navigate = useNavigate();
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

    // por enquanto só navega de volta, futuramente chama a API
    navigate(-1);
  }

  return (
    <Container>
      <Wrapper>
        <Container isDashboard>
          <PageHeader onBack={() => navigate(-1)}>
            Esqueci minha senha
          </PageHeader>
          <form onSubmit={handleSubmit}>
            <Input
              labelText="E-mail cadastrado"
              type="email"
              id="email"
              name="email"
              placeholder="arthur@exemplo.com"
              value={value}
              onChange={handleChange}
              errorMessage={touched || submitAttempted ? error : ""}
              autoComplete="email"
            />
            <Button type="submit">Enviar link de recuperação</Button>
          </form>
        </Container>
      </Wrapper>
    </Container>
  );
}