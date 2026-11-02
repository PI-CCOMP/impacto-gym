import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

import { Container } from "../../components/Container";
import { Logo } from "../../components/Logo";
import { FormHeader } from "../../components/FormHeader";
import { Input } from "../../components/Input/input";
import { Button } from "../../components/Button";

import { useLoginForm } from "../../hooks/useLoginForm";
import { apiPost, guardarSessao, rotaPorPerfil } from "../../services/api";

import dashboardHeroImg from "../../assets/img/backgrounds/dashboard-hero.jpeg";

import styles from "./Auth.module.css";

export function DashboardLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [requestError, setRequestError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const logoutWarning =
    (location.state as { logoutWarning?: string } | null)?.logoutWarning ?? "";

  const { values, handleChange, handleSubmitValidate, getError } =
    useLoginForm();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!handleSubmitValidate()) return;
    setRequestError("");
    setSubmitting(true);
    try {
      const result = await apiPost<{
        access_token?: string;
        refresh_token?: string;
        perfil?: string;
        usuario?: { perfil: string };
        email_verification_required?: boolean;
      }>("/auth/login", {
        email: values.email,
        senha: values.password,
        origem: "equipe",
      });
      if (result.email_verification_required) {
        navigate("/dashboard/mfa", {
          state: {
            action: "login",
            email: values.email,
            perfil: result.perfil,
            origem: "equipe",
          },
        });
        return;
      }
      if (!result.access_token || !result.refresh_token || !result.usuario) {
        throw new Error("Resposta de autenticação inválida.");
      }
      guardarSessao(
        result.access_token,
        result.refresh_token,
        result.usuario.perfil,
      );
      navigate(rotaPorPerfil(result.usuario.perfil), { replace: true });
    } catch (error) {
      setRequestError(
        error instanceof Error ? error.message : "Não foi possível entrar.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container style={{ justifyContent: "center" }}>
      <div className={styles.container}>
        <img
          src={dashboardHeroImg}
          alt="Banner"
          className={styles.heroBanner}
        />
        <div className={styles.formContainer}>
          <Logo />
          <FormHeader subtitle="Preencha os campos abaixo">
            Conecte-se!
          </FormHeader>
          <form onSubmit={handleSubmit}>
            <Input
              type="email"
              labelText="E-mail"
              id="email"
              name="email"
              placeholder="arthur@exemplo.com"
              value={values.email}
              onChange={handleChange}
              errorMessage={getError("email")}
              autoComplete="email"
            />
            <Input
              type="password"
              labelText="Senha"
              id="password"
              name="password"
              placeholder="••••••••"
              value={values.password}
              onChange={handleChange}
              errorMessage={getError("password")}
              autoComplete="current-password"
            />
            {requestError && <p role="alert">{requestError}</p>}
            {logoutWarning && (
              <p role="alert">
                Sessão encerrada neste dispositivo, mas a API informou:{" "}
                {logoutWarning}
              </p>
            )}
            <Button type="submit" disabled={submitting}>
              {submitting ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <Link to="/dashboard/alterar-senha" className={styles.secondaryLink}>
            Esqueceu sua senha?
          </Link>
        </div>
      </div>
    </Container>
  );
}
