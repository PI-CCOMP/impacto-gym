import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { Container } from "../../components/Container";
import { PageHeader } from "../../components/PageHeader";
import { Logo } from "../../components/Logo";
import { FormHeader } from "../../components/FormHeader";
import { Button } from "../../components/Button";

import styles from "./Auth.module.css";

type LocationState = {
  action?: "change-password";
};

export function DashboardMFAVerification() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState | null;

  const action = state?.action;

  const [digits, setDigits] = useState(["", "", "", ""]);
  const [error, setError] = useState("");

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  function handleDigitChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);

    const updated = [...digits];
    updated[index] = digit;

    setDigits(updated);
    setError("");

    if (digit && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const code = digits.join("");

    if (code.length < 4) {
      setError("Digite o código completo de 4 dígitos.");
      return;
    }

    // verificar código MFA aqui
    console.log("Código MFA:", code);

    if (action === "change-password") {
      navigate("/dashboard/login");
      return;
    }

    navigate("/dashboard/usuarios");
  }

  const buttonLabel = action === "change-password" ? "Salvar" : "Finalizar";

  return (
    <Container>
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
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`${styles.digitInput} ${
                error ? styles.digitInputError : ""
              }`}
            />
          ))}
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}

        <Button type="submit">{buttonLabel}</Button>
      </form>
    </Container>
  );
}
