import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { Container } from "../../components/Container";
import { PageHeader } from "../../components/PageHeader";
import { Logo } from "../../components/Logo";
import { FormHeader } from "../../components/FormHeader";
import { Button } from "../../components/Button";

import { useMFAForm } from "../../hooks/useMFAForm";
import { apiPost, guardarSessao, rotaPorPerfil } from "../../services/api";

import styles from "./MFAVerification.module.css";

type LocationState = {
  action?: "change-password" | "change-email" | "register" | "login";
  email?: string;
  pendingEmail?: string;
  perfil?: string;
  origem?: "aluno" | "equipe";
  redirectTo?: string;
};

export function MFAVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const action = state?.action;
  const dashboard = location.pathname.startsWith("/dashboard");
  const redirectTo = state?.redirectTo;
  const email = state?.email ?? state?.pendingEmail ?? "";
  const [requestError, setRequestError] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  const {
    digits,
    error,
    inputsRef,
    handleDigitChange,
    handleKeyDown,
    handleSubmit,
  } = useMFAForm((code) => {
    void confirmarCodigo(code);
  });

  async function confirmarCodigo(code: string) {
    if (!email) {
      setRequestError(
        "Não foi possível identificar o e-mail desta solicitação.",
      );
      return;
    }
    setSubmitting(true);
    setRequestError("");
    try {
      if (action === "change-password") {
        navigate(dashboard ? "/dashboard/nova-senha" : "/nova-senha", {
          state: { email, codigo: code, redirectTo },
        });
        return;
      }
      if (action === "login") {
        const result = await apiPost<{
          access_token: string;
          refresh_token: string;
          usuario: { perfil: string };
        }>("/auth/login/verificar-email", {
          email,
          codigo: code,
          origem: state?.origem ?? "equipe",
        });
        guardarSessao(
          result.access_token,
          result.refresh_token,
          result.usuario.perfil,
        );
        navigate(rotaPorPerfil(result.usuario.perfil), { replace: true });
        return;
      }
      const resultado = await apiPost<{ cadastro_token?: string }>(
        "/auth/email/verificar",
        { email, codigo: code },
      );
      if (resultado.cadastro_token) {
        navigate("/enviar-laudo", { replace: true });
        return;
      }
      if (action === "change-email") {
        navigate(
          redirectTo ??
            (dashboard ? "/dashboard/configuracoes" : "/configuracoes"),
          {
            state: {
              showSuccessToast: true,
              toastMessage: "E-mail alterado com sucesso!",
            },
          },
        );
      } else {
        navigate("/login", { state: { showRegisterToast: true } });
      }
    } catch (error) {
      setRequestError(
        error instanceof Error
          ? error.message
          : "Não foi possível validar o código.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function reenviarCodigo() {
    if (!email) {
      setRequestError(
        "Não foi possível identificar o e-mail desta solicitação.",
      );
      return;
    }
    setResending(true);
    setRequestError("");
    setResendMessage("");
    try {
      const endpoint =
        action === "login"
          ? "/auth/login/reenviar-codigo"
          : action === "change-password"
            ? "/auth/esqueci-senha"
            : "/auth/email/reenviar-verificacao";
      const result = await apiPost<{ mensagem: string }>(
        endpoint,
        action === "login"
          ? { email, origem: state?.origem ?? "equipe" }
          : { email },
      );
      setResendMessage(result.mensagem);
    } catch (error) {
      setRequestError(
        error instanceof Error
          ? error.message
          : "Não foi possível reenviar o código.",
      );
    } finally {
      setResending(false);
    }
  }

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
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
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
        {requestError && <p className={styles.errorMessage}>{requestError}</p>}
        {resendMessage && <p role="status">{resendMessage}</p>}
        <Button type="submit" disabled={submitting}>
          {submitting ? "Verificando..." : buttonLabel}
        </Button>
      </form>
      <Button
        type="button"
        style={{ background: "transparent" }}
        disabled={resending}
        onClick={reenviarCodigo}
      >
        {resending ? "Reenviando..." : "Reenviar código"}
      </Button>
    </Container>
  );
}
