import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Container } from "../../components/Container";
import { PageHeader } from "../../components/PageHeader";
import { Logo } from "../../components/Logo";
import { FormHeader } from "../../components/FormHeader";
import { Input } from "../../components/Input/input";
import { Button } from "../../components/Button";

import { validateEmailRequired } from "../../validators";
import { apiPatchAuthed } from "../../services/api";

export function ChangeEmail() {
  const navigate = useNavigate();

  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [password, setPassword] = useState("");
  const [requestError, setRequestError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
    setTouched(true);
    setError(validateEmailRequired(e.target.value));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitAttempted(true);
    const newError = validateEmailRequired(value);
    setError(newError);
    if (newError) return;

    if (!password) {
      setRequestError("Informe sua senha atual.");
      return;
    }
    setSubmitting(true);
    setRequestError("");
    try {
      await apiPatchAuthed("/auth/alterar-email", {
        senha_atual: password,
        novo_email: value,
      });
      navigate("/verificar-email", {
        state: {
          action: "change-email",
          pendingEmail: value,
          redirectTo: "/configuracoes",
        },
      });
    } catch (requestError) {
      setRequestError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível solicitar a troca do e-mail.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container>
      <PageHeader onBack={() => navigate(-1)}>Alterar E-mail</PageHeader>
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
        <Input
          labelText="Senha atual"
          type="password"
          id="current-password"
          name="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
        />
        {requestError && <p role="alert">{requestError}</p>}
        <Button type="submit" disabled={submitting}>
          {submitting ? "Enviando..." : "Alterar"}
        </Button>
      </form>
    </Container>
  );
}
