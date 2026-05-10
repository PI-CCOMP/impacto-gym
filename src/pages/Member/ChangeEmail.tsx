import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Container } from "../../components/Container";
import { PageHeader } from "../../components/PageHeader";
import { Logo } from "../../components/Logo";
import { FormHeader } from "../../components/FormHeader";
import { Input } from "../../components/Input/input";
import { Button } from "../../components/Button";

import { validateEmailRequired } from "../../validators";

export function ChangeEmail() {
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

    navigate("/verificar-email", {
      state: {
        action: "change-email",
        pendingEmail: value,
        redirectTo: "/configuracoes",
        showSuccessToast: true,
      },
    });
  }

  return (
    <Container>
      <PageHeader>Alterar E-mail</PageHeader>
      <Logo />
      <FormHeader subtitle="Preencha os campos abaixo">
        Altere seu e-mail!
      </FormHeader>
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
  );
}
