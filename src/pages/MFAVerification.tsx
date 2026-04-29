import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { Container } from "../components/Container";
import { PageHeader } from "../components/PageHeader";
import { Logo } from "../components/Logo";
import { FormHeader } from "../components/FormHeader";
import { Button } from "../components/Button";

import styles from "./MFAVerification.module.css";

import _authStyles from "./Auth.module.css";

type LocationState = {
  redirectTo: string;
};

export function MFAVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const redirectTo = state?.redirectTo ?? "/login";

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
    // aqui você chamaria a API para verificar o código
    console.log("Código MFA:", code);
    navigate(redirectTo);
  }

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
        {error && (
          <p style={{ color: "var(--error)", fontSize: "1.2rem", margin: 0 }}>
            {error}
          </p>
        )}
        <Button type="submit">Entrar</Button>{" "}
        {/* FAZER VALIDACAO SE VEIO DE CADASTRO FINALIZAR SE VEIO DE ALTERAR SENHA SALVAR e dps jogar para /login */}
      </form>
    </Container>
  );
}
