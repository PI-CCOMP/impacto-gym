import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

import { Container } from "../../components/Container";
import { PageHeader } from "../../components/PageHeader";
import { Logo } from "../../components/Logo";
import { FormHeader } from "../../components/FormHeader";
import { Button } from "../../components/Button";
import { Toast } from "../../components/Toast";

import { useMFAForm } from "../../hooks/useMFAForm";

import styles from "./MFAVerification.module.css";

type LocationState = {
  action?: "change-password" | "change-email" | "register";
  pendingEmail?: string;
  redirectTo?: string;
  showSuccessToast?: boolean;
};

export function MFAVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const action = state?.action;
  const [showToast, setShowToast] = useState(false);

  const {
    digits,
    error,
    inputsRef,
    handleDigitChange,
    handleKeyDown,
    handleSubmit,
  } = useMFAForm((code) => {
    console.log("Código MFA:", code);

    if (action === "change-password") {
      navigate("/login");
    } else if (action === "change-email") {
      // TODO: api.changeEmail({ email: state.pendingEmail, mfaCode: code })
      setShowToast(true);
    } else {
      navigate("/login", { state: { showRegisterToast: true } });
    }
  });

  const buttonLabel =
    action === "change-password" || action === "change-email"
      ? "Salvar"
      : "Finalizar";

  return (
    <Container>
      {showToast && (
        <Toast
          message="E-mail alterado com sucesso!"
          duration={2000}
          onClose={() => navigate(state?.redirectTo ?? "/configuracoes")}
        />
      )}

      <PageHeader onBack={() => navigate(-1)}>Verificar Código</PageHeader>
      <Logo />
      <FormHeader subtitle="Digite o código de 4 dígitos que enviamos para você">
        Verifique seu e-mail!
      </FormHeader>

      <form onSubmit={handleSubmit}>
        <div className={styles.codeWrapper}>
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`${styles.digitInput} ${error ? styles.digitInputError : ""}`}
            />
          ))}
        </div>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <Button type="submit">{buttonLabel}</Button>
      </form>
    </Container>
  );
}
