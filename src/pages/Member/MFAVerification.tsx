import { useNavigate, useLocation } from "react-router-dom";

import { Container } from "../../components/Container";
import { PageHeader } from "../../components/PageHeader";
import { Logo } from "../../components/Logo";
import { FormHeader } from "../../components/FormHeader";
import { Button } from "../../components/Button";

import { useMFAForm } from "../../hooks/useMFAForm";

import styles from "./MFAVerification.module.css";

type LocationState = {
  action?: "change-password" | "change-email" | "register";
  pendingEmail?: string;
  redirectTo?: string;
};

export function MFAVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const action = state?.action;
  const redirectTo = state?.redirectTo;

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
      navigate("/nova-senha", { state: { redirectTo } });
    } else if (action === "change-email") {
      navigate(redirectTo ?? "/configuracoes", {
        state: { showSuccessToast: true, toastMessage: "E-mail alterado com sucesso!" },
      });
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
      <PageHeader onBack={() => navigate(-1)}>Verificar Código</PageHeader>
      <Logo />
      <FormHeader subtitle="Digite o código de 6 dígitos que enviamos para você">
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
