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

import { mockUsers } from "../../mocks/mockData";
import { validateName, validateEmail } from "../../validators";

import {
  GENDER_OPTIONS,
  GOAL_OPTIONS,
  EXPERIENCE_OPTIONS,
  DISABILITY_OPTIONS,
  RESTRICTION_OPTIONS,
} from "../../utils/formOptions";

import supinoImg from "../../assets/img/supino-reto.jpg";

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
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [gender, setGender] = useState(user?.gender ?? "Masculino");
  const [goal, setGoal] = useState(user?.goal ?? "Hipertrofia");
  const [experience, setExperience] = useState(user?.experience ?? "Iniciante");
  const [disability, setDisability] = useState(user?.disability ?? "Nenhuma");
  const [medicalRestriction, setMedicalRestriction] = useState(
    user?.medicalRestriction ?? "Nenhuma",
  );
  const [medicalReportFile, setMedicalReportFile] = useState<File | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string>(
    user?.image ?? supinoImg,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

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

  function validate() {
    const newErrors: Record<string, string> = {};
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    if (nameError) newErrors.name = nameError;
    if (emailError) newErrors.email = emailError;
    return newErrors;
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewPhoto(URL.createObjectURL(file));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitAttempted(true);
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // Em produção: await api.patch(`/users/${user.id}`, { ... })
    console.log("Salvar edição", user.id, {
      name,
      email,
      gender,
      goal,
      experience,
      disability,
      medicalRestriction,
      medicalReportFile,
    });
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

          {/* Informações Pessoais */}
          <b>Informações Pessoais</b>

          <Input
            type="text"
            labelText="Nome"
            placeholder="Ex: Arthur"
            name="name"
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (submitAttempted)
                setErrors((prev) => ({
                  ...prev,
                  name: validateName(e.target.value),
                }));
            }}
            errorMessage={submitAttempted ? errors.name : undefined}
          />

          <Input
            type="email"
            labelText="E-mail"
            placeholder="Ex: arthur@exemplo.com"
            name="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (submitAttempted)
                setErrors((prev) => ({
                  ...prev,
                  email: validateEmail(e.target.value),
                }));
            }}
            errorMessage={submitAttempted ? errors.email : undefined}
          />

          {isAluno && (
            <Select
              id="gender"
              labelText="Sexo"
              value={gender}
              onChange={setGender}
              options={GENDER_OPTIONS}
            />
          )}

          {/* Informações de Treino — só Aluno */}
          {isAluno && (
            <>
              <b>Informações de Treino</b>
              <Select
                id="goal"
                labelText="Objetivo"
                value={goal}
                onChange={setGoal}
                options={GOAL_OPTIONS}
              />
              <Select
                id="experience"
                labelText="Experiência"
                value={experience}
                onChange={setExperience}
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
                value={disability}
                onChange={setDisability}
                options={DISABILITY_OPTIONS}
              />
              <Select
                id="medicalRestriction"
                labelText="Restrição Médica"
                value={medicalRestriction}
                onChange={setMedicalRestriction}
                options={RESTRICTION_OPTIONS}
              />
              <FileUpload
                id="medicalReport"
                onFileChange={setMedicalReportFile}
              >
                Coloque seu documento ou laudo médico liberando a prática de
                atividades físicas
              </FileUpload>
            </>
          )}

          <Button type="submit">Salvar</Button>
        </form>
      </Container>
    </DashboardGrid>
  );
}
