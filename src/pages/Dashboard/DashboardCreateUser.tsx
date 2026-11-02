import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Container } from "../../components/Container";
import { DashboardGrid } from "../../components/DashboardGrid";
import { PageHeader } from "../../components/PageHeader";
import { SideMenu } from "../../components/SideMenu";
import { Input } from "../../components/Input/input";
import { Select } from "../../components/Select";
import { InputCheckbox } from "../../components/InputCheckbox";
import { Button } from "../../components/Button";
import { apiPostAuthed } from "../../services/api";

import { useUserForm } from "../../hooks/useUserForm";

import {
  GENDER_OPTIONS,
  GOAL_OPTIONS,
  EXPERIENCE_OPTIONS,
  DISABILITY_OPTIONS,
  RESTRICTION_OPTIONS,
  PROFILE_OPTIONS,
} from "../../utils/formOptions";

export function DashboardCreateUser() {
  const navigate = useNavigate();
  const {
    values,
    handleChange,
    handleSubmitValidate,
    getError,
    requiresMedicalReport,
    handleMedicalToggle,
  } = useUserForm({ mode: "create" });

  const isAluno = values.profile === "Aluno";
  const [requestError, setRequestError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!handleSubmitValidate()) return;
    setRequestError("");
    setSubmitting(true);
    try {
      const profile = {
        Aluno: "aluno",
        Instrutor: "instrutor",
        Recepcionista: "recepcionista",
        Administrador: "admin",
      }[values.profile];
      await apiPostAuthed("/usuarios", {
        nome: values.name,
        cpf: values.cpf,
        email: values.email,
        sexo:
          values.gender === "Masculino"
            ? "M"
            : values.gender === "Feminino"
              ? "F"
              : "OUTRO",
        perfil: profile,
        ...(isAluno
          ? {
              aluno: {
                objetivo: values.goal
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .replaceAll(" ", "_")
                  .toLowerCase(),
                nivel: values.experience.toLowerCase().replaceAll("á", "a"),
                deficiencia: values.disability,
                restricao_medica: values.medicalRestriction,
              },
            }
          : {}),
      });
      navigate("/dashboard/usuarios", { state: { created: true } });
    } catch (error) {
      setRequestError(
        error instanceof Error
          ? error.message
          : "Não foi possível criar o usuário.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardGrid>
      <SideMenu />
      <Container isDashboard>
        <PageHeader onBack={() => navigate(-1)}>Criar Usuário</PageHeader>

        <form onSubmit={handleSubmit}>
          {requestError && <p role="alert">{requestError}</p>}
          <b>Informações Pessoais</b>

          <Input
            type="text"
            labelText="Nome"
            placeholder="Ex: Arthur"
            name="name"
            id="name"
            value={values.name}
            onChange={(e) => handleChange("name", e.target.value)}
            errorMessage={getError("name")}
          />

          <Input
            type="text"
            labelText="CPF"
            placeholder="000.000.000-00"
            name="cpf"
            id="cpf"
            value={values.cpf}
            onChange={(e) => handleChange("cpf", e.target.value)}
            errorMessage={getError("cpf")}
          />

          <Input
            type="email"
            labelText="E-mail"
            placeholder="Ex: arthur@exemplo.com"
            name="email"
            id="email"
            value={values.email}
            onChange={(e) => handleChange("email", e.target.value)}
            errorMessage={getError("email")}
          />

          <Select
            id="profile"
            labelText="Tipo de Perfil"
            value={values.profile}
            onChange={(val) => handleChange("profile", val)}
            options={PROFILE_OPTIONS}
          />

          <Select
            id="gender"
            labelText="Sexo"
            value={values.gender}
            onChange={(val) => handleChange("gender", val)}
            options={GENDER_OPTIONS}
          />

          {isAluno && (
            <>
              <b>Informações de Treino</b>
              <Select
                id="goal"
                labelText="Objetivo"
                value={values.goal}
                onChange={(val) => handleChange("goal", val)}
                options={GOAL_OPTIONS}
              />
              <Select
                id="experience"
                labelText="Experiência"
                value={values.experience}
                onChange={(val) => handleChange("experience", val)}
                options={EXPERIENCE_OPTIONS}
              />
            </>
          )}

          {isAluno && (
            <>
              <b>Informações Médicas</b>
              <b>Deficiência</b>
              {DISABILITY_OPTIONS.map((option) => (
                <InputCheckbox
                  key={option.value}
                  id={`disability-${option.value}`}
                  labelText={option.label}
                  checked={values.disability.includes(option.value)}
                  disabled={
                    option.value !== "nenhuma" &&
                    values.disability.includes("nenhuma")
                  }
                  onChange={(_, checked) =>
                    handleMedicalToggle("disability", option.value, checked)
                  }
                />
              ))}
              <b>Restrição médica</b>
              {RESTRICTION_OPTIONS.map((option) => (
                <InputCheckbox
                  key={option.value}
                  id={`restriction-${option.value}`}
                  labelText={option.label}
                  checked={values.medicalRestriction.includes(option.value)}
                  disabled={
                    option.value !== "nenhuma" &&
                    values.medicalRestriction.includes("nenhuma")
                  }
                  onChange={(_, checked) =>
                    handleMedicalToggle(
                      "medicalRestriction",
                      option.value,
                      checked,
                    )
                  }
                />
              ))}
              {requiresMedicalReport && (
                <p style={{ marginTop: "var(--size-sm)" }}>
                  O aluno poderá enviar o laudo depois da criação. O acesso
                  permanece bloqueado até a aprovação do cadastro.
                </p>
              )}
            </>
          )}

          <Button type="submit" disabled={submitting}>
            {submitting ? "Criando..." : "Criar Usuário"}
          </Button>
        </form>
      </Container>
    </DashboardGrid>
  );
}
