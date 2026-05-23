import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { Container } from "../../components/Container";
import { Logo } from "../../components/Logo";
import { PageHeader } from "../../components/PageHeader";
import { FormHeader } from "../../components/FormHeader";
import { Input } from "../../components/Input/input";
import { Button } from "../../components/Button";
import { Toast } from "../../components/Toast";
import { Wrapper } from "../../components/Wrapper";

import { validatePassword, validateConfirmPassword } from "../../validators";

type LocationState = {
  redirectTo?: string;
};

export function DashboardNewPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const redirectTo = state?.redirectTo;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({ password: "", confirm: "" });
  const [touched, setTouched] = useState({ password: false, confirm: false });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showToast, setShowToast] = useState(false);

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setPassword(val);
    setTouched((t) => ({ ...t, password: true }));
    setErrors((err) => ({
      ...err,
      password: validatePassword(val),
      confirm: confirm ? validateConfirmPassword(confirm, val) : err.confirm,
    }));
  }

  function handleConfirmChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setConfirm(val);
    setTouched((t) => ({ ...t, confirm: true }));
    setErrors((err) => ({
      ...err,
      confirm: validateConfirmPassword(val, password),
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitAttempted(true);
    const pwErr = validatePassword(password);
    const cfErr = validateConfirmPassword(confirm, password);
    setErrors({ password: pwErr, confirm: cfErr });
    if (pwErr || cfErr) return;
    // TODO: api.resetPassword({ password })
    setShowToast(true);
  }

  return (
    <Container>
      {showToast && (
        <Toast
          message="Senha alterada com sucesso!"
          duration={2000}
          onClose={() => navigate(redirectTo ?? "/dashboard")}
        />
      )}
      <Wrapper>
        <Container isDashboard>
          <PageHeader onBack={() => navigate(-1)}>Nova Senha</PageHeader>
          <FormHeader subtitle="Escolha uma senha segura">
            Crie sua nova senha!
          </FormHeader>
          <form onSubmit={handleSubmit}>
            <Input
              labelText="Nova senha"
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={password}
              onChange={handlePasswordChange}
              errorMessage={touched.password || submitAttempted ? errors.password : ""}
              autoComplete="new-password"
            />
            <Input
              labelText="Confirmar senha"
              type="password"
              id="confirm"
              name="confirm"
              placeholder="••••••••"
              value={confirm}
              onChange={handleConfirmChange}
              errorMessage={touched.confirm || submitAttempted ? errors.confirm : ""}
              autoComplete="new-password"
            />
            <Button type="submit">Salvar</Button>
          </form>
        </Container>
      </Wrapper>
    </Container>
  );
}
