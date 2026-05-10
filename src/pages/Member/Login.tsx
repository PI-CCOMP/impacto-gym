import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState } from "react";
import { Dumbbell } from "lucide-react";

import { Container } from "../../components/Container";
import { PageHeader } from "../../components/PageHeader";
import { Logo } from "../../components/Logo";
import { FormHeader } from "../../components/FormHeader";
import { Input } from "../../components/Input/input";
import { Button } from "../../components/Button";
import { Toast } from "../../components/Toast";

import { useLoginForm } from "../../hooks/useLoginForm";

import styles from "../Member/Auth.module.css";

type LoginLocationState = {
  showRegisterToast?: boolean;
};

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LoginLocationState | null;

  const [showToast, setShowToast] = useState(
    locationState?.showRegisterToast ?? false,
  );

  const { values, handleChange, handleSubmitValidate, getError } =
    useLoginForm();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!handleSubmitValidate()) return;
    console.log("Login!", values);
    navigate("/inicio");
  }

  return (
    <Container>
      {showToast && (
        <Toast
          message="A Impacto Gym irá validar suas informações e, em breve, sua conta estará disponível."
          onClose={() => setShowToast(false)}
          duration={6000}
          icon={<Dumbbell />}
        />
      )}
      <PageHeader onBack={() => navigate("/")}>Login</PageHeader>
      <Logo />
      <FormHeader subtitle="Preencha os campos abaixo">Conecte-se!</FormHeader>

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
        <Button type="submit">Entrar</Button>
      </form>

      <Link to="/alterar-senha" className={styles.secondaryLink}>
        Esqueceu sua senha?
      </Link>
    </Container>
  );
}
