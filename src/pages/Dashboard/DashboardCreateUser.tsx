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

import {
  validateName,
  validateEmail,
  validateCPF,
  formatCPF,
} from "../../validators";

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

  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("Masculino");
  const [profile, setProfile] = useState("Aluno");
  const [goal, setGoal] = useState("Hipertrofia");
  const [experience, setExperience] = useState("Iniciante");
  const [disability, setDisability] = useState("Nenhuma");
  const [medicalRestriction, setMedicalRestriction] = useState("Nenhuma");
  const [medicalReportFile, setMedicalReportFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const isAluno = profile === "Aluno";

  function validate() {
    const newErrors: Record<string, string> = {};
    const nameError = validateName(name);
    const cpfError = validateCPF(cpf);
    const emailError = validateEmail(email);
    if (nameError) newErrors.name = nameError;
    if (cpfError) newErrors.cpf = cpfError;
    if (emailError) newErrors.email = emailError;
    return newErrors;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitAttempted(true);
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // Em produção: await api.post('/users', { ... })
    console.log("Criar usuário", {
      name,
      cpf,
      email,
      gender,
      profile,
      ...(isAluno && {
        goal,
        experience,
        disability,
        medicalRestriction,
        medicalReportFile,
      }),
    });
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
            type="text"
            labelText="CPF"
            placeholder="000.000.000-00"
            name="cpf"
            id="cpf"
            value={cpf}
            onChange={(e) => {
              const formatted = formatCPF(e.target.value);
              setCpf(formatted);
              if (submitAttempted)
                setErrors((prev) => ({ ...prev, cpf: validateCPF(formatted) }));
            }}
            errorMessage={submitAttempted ? errors.cpf : undefined}
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

          <Select
            id="profile"
            labelText="Tipo de Perfil"
            value={profile}
            onChange={setProfile}
            options={PROFILE_OPTIONS}
          />

          <Select
            id="gender"
            labelText="Sexo"
            value={gender}
            onChange={setGender}
            options={GENDER_OPTIONS}
          />

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

          <Button type="submit">Criar Usuário</Button>
        </form>
      </Container>
    </DashboardGrid>
  );
}
