import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { Container } from "../components/Container";
import { PageHeader } from "../components/PageHeader";
import { Logo } from "../components/Logo";
import { FormHeader } from "../components/FormHeader";
import { Input } from "../components/Input/input";
import { Button } from "../components/Button";

import { validateEmailRequired, validatePasswordLogin } from "../validators";

import styles from "../pages/Auth.module.css";

export function Login() {
  const navigate = useNavigate();

  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [submitAttempted, setSubmitAttempted] = useState(false);

  function validate(name: string, value: string): string {
    if (name === "email") return validateEmailRequired(value);
    if (name === "password") return validatePasswordLogin(value);
    return "";
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitAttempted(true);
    const newErrors = {
      email: validate("email", values.email),
      password: validate("password", values.password),
    };
    setErrors(newErrors);
    if (newErrors.email || newErrors.password) return;
    console.log("Login!", {
      email: values.email.trim(),
      password: values.password,
    });
    navigate("/home");
  }

  function getError(name: "email" | "password") {
    return touched[name] || submitAttempted ? errors[name] : "";
  }

  return (
    <Container>
      <PageHeader>Login</PageHeader>
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

      <Link to="/esqueci_senha" className={styles.secondaryLink}>
        Esqueceu sua senha?
      </Link>
    </Container>
  );
}
