import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Container } from "../../components/Container";
import { DashboardGrid } from "../../components/DashboardGrid";
import { PageHeader } from "../../components/PageHeader";
import { SideMenu } from "../../components/SideMenu";
import { Input } from "../../components/Input/input";
import { Select } from "../../components/Select";
import { FileUpload } from "../../components/FileUpload";
import { Button } from "../../components/Button";

import { useUserForm } from "../../hooks/useUserForm";

import { mockUsers } from "../../mocks/mockData";

import {
  GENDER_OPTIONS,
  GOAL_OPTIONS,
  EXPERIENCE_OPTIONS,
  DISABILITY_OPTIONS,
  RESTRICTION_OPTIONS,
} from "../../utils/formOptions";

import supinoImg from "../../assets/img/exercise/supino-reto.jpg";

const errorStyle: React.CSSProperties = {
  color: "var(--error)",
  fontSize: "1.2rem",
  margin: 0,
};

export function DashboardEditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = mockUsers.find((u) => u.id === id);

  // todos os hooks ANTES de qualquer return condicional
  const {
    values,
    handleChange,
    handleSubmitValidate,
    getError,
    requiresMedicalReport,
  } = useUserForm({
    mode: "edit",
    initial: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      gender: user?.gender ?? "Masculino",
      goal: user?.goal ?? "Hipertrofia",
      experience: user?.experience ?? "Iniciante",
      disability: user?.disability ?? "Nenhuma",
      medicalRestriction: user?.medicalRestriction ?? "Nenhuma",
    },
  });

  const [medicalReportFile, setMedicalReportFile] = useState<File | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string>(
    user?.image ?? supinoImg,
  );

  // return condicional só depois dos hooks
  if (!user) {
    return (
      <DashboardGrid>
        <SideMenu />
        <Container>
          <PageHeader onBack={() => navigate(-1)}>Editar Usuário</PageHeader>
          <h1>Usuário não encontrado.</h1>
        </Container>
      </DashboardGrid>
    );
  }

  const isAluno = user.profile === "Aluno";

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewPhoto(URL.createObjectURL(file));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!handleSubmitValidate(medicalReportFile)) return;
    // Em produção: await api.patch(`/users/${user.id}`, { ... })
    console.log("Salvar edição", user.id, { ...values, medicalReportFile });
    navigate(-1);
  }

  return (
    <DashboardGrid>
      <SideMenu />
      <Container isDashboard>
        <PageHeader onBack={() => navigate(-1)}>Editar Usuário</PageHeader>

        <form onSubmit={handleSubmit}>
          {/* Foto */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "var(--size-sm)",
              marginBottom: "var(--size-lg)",
            }}
          >
            <img
              src={previewPhoto}
              alt="Foto do usuário"
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <label
              htmlFor="photoUpload"
              style={{
                cursor: "pointer",
                color: "var(--primary)",
                fontSize: "1.2rem",
              }}
            >
              Alterar foto
            </label>
            <input
              id="photoUpload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handlePhotoChange}
            />
          </div>

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
            type="email"
            labelText="E-mail"
            placeholder="Ex: arthur@exemplo.com"
            name="email"
            id="email"
            value={values.email}
            onChange={(e) => handleChange("email", e.target.value)}
            errorMessage={getError("email")}
          />

          {isAluno && (
            <Select
              id="gender"
              labelText="Sexo"
              value={values.gender}
              onChange={(val) => handleChange("gender", val)}
              options={GENDER_OPTIONS}
            />
          )}

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

          <Button type="submit">Salvar</Button>
        </form>
      </Container>
    </DashboardGrid>
  );
}
