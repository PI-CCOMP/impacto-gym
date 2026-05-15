import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { Container } from "../../components/Container";
import { Logo } from "../../components/Logo";
import { FormHeader } from "../../components/FormHeader";
import { Select } from "../../components/Select";
import { Input } from "../../components/Input/input";
import { Button } from "../../components/Button";

import { useLoginForm } from "../../hooks/useLoginForm";

import dashboardHeroImg from "../../assets/img/backgrounds/dashboard-hero.jpeg";

import styles from "./Auth.module.css";

export function DashboardLogin() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  const { values, handleChange, handleSubmitValidate, getError } =
    useLoginForm();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!handleSubmitValidate()) return;
    console.log("Login!", values);
    navigate("/dashboard/usuarios");
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
            <Select
              labelText="Cargo"
              value={role}
              onChange={setRole}
              options={[
                { value: "admin", label: "Administrador" },
                { value: "instructor", label: "Instrutor" },
                { value: "receptionist", label: "Recepcionista" },
              ]}
            />
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

          <Link to="/dashboard/alterar-senha" className={styles.secondaryLink}>
            Esqueceu sua senha?
          </Link>
        </div>
      </div>
    </Container>
  );
}
