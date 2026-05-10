import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { DashboardGrid } from "../../components/DashboardGrid";
import { Container } from "../../components/Container";
import { PageHeader } from "../../components/PageHeader";
import { Input } from "../../components/Input/input";
import { Button } from "../../components/Button";

import { validateEmailRequired } from "../../validators";
import { Wrapper } from "../../components/Wrapper";

export function DashboardChangeEmail() {
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

    navigate("/dashboard/mfa", {
      state: {
        action: "change-email",
        pendingEmail: value,
        redirectTo: "/dashboard/configuracoes",
      },
    });
  }

  return (
    <Container>
      <Wrapper>
        <Container isDashboard>
          <PageHeader onBack={() => navigate(-1)}>Alterar E-mail</PageHeader>
          <form onSubmit={handleSubmit}>
            <Input
              labelText="Novo e-mail"
              type="email"
              id="email"
              name="email"
              placeholder="arthur@exemplo.com"
              value={value}
              onChange={handleChange}
              errorMessage={touched || submitAttempted ? error : ""}
              autoComplete="email"
            />
            <Button type="submit">Alterar</Button>
          </form>
        </Container>
      </Wrapper>
    </Container>
  );
}
