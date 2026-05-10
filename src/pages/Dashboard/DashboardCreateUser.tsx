import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Container } from "../../components/Container";
import { DashboardGrid } from "../../components/DashboardGrid";
import { PageHeader } from "../../components/PageHeader";
import { SideMenu } from "../../components/SideMenu";
import { Input } from "../../components/Input/input";
import { Select } from "../../components/Select";
import { FileUpload } from "../../components/FileUpload";
import { Button } from "../../components/Button";

import { useUserForm } from "../../hooks/useUserForm";

import {
  GENDER_OPTIONS,
  GOAL_OPTIONS,
  EXPERIENCE_OPTIONS,
  DISABILITY_OPTIONS,
  RESTRICTION_OPTIONS,
  PROFILE_OPTIONS,
} from "../../utils/formOptions";

const errorStyle: React.CSSProperties = {
  color: "var(--error)",
  fontSize: "1.2rem",
  margin: 0,
};

export function DashboardCreateUser() {
  const navigate = useNavigate();
  const [medicalReportFile, setMedicalReportFile] = useState<File | null>(null);

  const {
    values,
    handleChange,
    handleSubmitValidate,
    getError,
    requiresMedicalReport,
  } = useUserForm({ mode: "create" });

  const isAluno = values.profile === "Aluno";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!handleSubmitValidate(medicalReportFile)) return;
    // Em produção: await api.post('/users', { ... })
    console.log("Criar usuário", { ...values, medicalReportFile });
    navigate("/dashboard/usuarios", { state: { created: true } });
  }

  return (
    <DashboardGrid>
      <SideMenu />
      <Container isDashboard>
        <PageHeader onBack={() => navigate(-1)}>Criar Usuário</PageHeader>

        <form onSubmit={handleSubmit}>
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
              <Select
                id="disability"
                labelText="Deficiência"
                value={values.disability}
                onChange={(val) => handleChange("disability", val)}
                options={DISABILITY_OPTIONS}
              />
              <Select
                id="medicalRestriction"
                labelText="Restrição Médica"
                value={values.medicalRestriction}
                onChange={(val) => handleChange("medicalRestriction", val)}
                options={RESTRICTION_OPTIONS}
              />
              {requiresMedicalReport && (
                <>
                  <FileUpload
                    id="medicalReport"
                    onFileChange={setMedicalReportFile}
                  >
                    Coloque seu documento ou laudo médico liberando a prática de
                    atividades físicas
                  </FileUpload>
                  {getError("medicalReport") && (
                    <p style={errorStyle}>{getError("medicalReport")}</p>
                  )}
                </>
              )}
            </>
          )}

          <Button type="submit">Criar Usuário</Button>
        </form>
      </Container>
    </DashboardGrid>
  );
}
