import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Container } from "../components/Container";
import { Logo } from "../components/Logo";
import { PageHeader } from "../components/PageHeader";
import { FormHeader } from "../components/FormHeader";
import { Input } from "../components/Input/input";
import { Button } from "../components/Button";
import { Row } from "../components/Row";
import { CheckboxCard } from "../components/CheckboxCard";
import { InputCheckbox } from "../components/InputCheckbox";
import { FileUpload } from "../components/FileUpload";

import maleImg from "../assets/img/male.png";
import femaleImg from "../assets/img/female.png";

import { useRegistrarForm } from "../hooks/useRegistrarForm";

import styles from "../pages/Auth.module.css";

const steps = [
  { id: 1, title: "Cadastre-se!", subtitle: "Preencha os campos abaixo" },
  { id: 2, title: "Cadastre-se!", subtitle: "Preencha os campos abaixo" },
  { id: 3, title: "Qual é o seu sexo?", subtitle: "Escolha uma opção abaixo" },
  {
    id: 4,
    title: "Você possui alguma deficiência?",
    subtitle: "Escolha uma opção abaixo",
  },
  {
    id: 5,
    title: "Você possui alguma restrição médica?",
    subtitle: "Escolha as opções abaixo",
  },
  {
    id: 6,
    title: "Laudo Médico",
    subtitle: "Preencha o campo abaixo - Apenas PDF",
  },
  {
    id: 7,
    title: "Qual é o seu objetivo?",
    subtitle: "Escolha as opções abaixo",
  },
  {
    id: 8,
    title: "Qual é o sua experiência com musculação?",
    subtitle: "Escolha uma opção abaixo",
  },
];

const DEFICIENCY_OPTIONS = [
  "visual",
  "auditiva",
  "motora",
  "intelectual",
  "múltipla",
  "outra-def",
];
const RESTRICTION_OPTIONS = [
  "problemas-cardiacos",
  "dores-no-peito",
  "tontura-desmaios",
  "problemas-osseos",
  "medicamentos",
  "cirurgias-recentes",
  "outra-rest",
];

const errorStyle: React.CSSProperties = {
  color: "var(--error)",
  fontSize: "1.2rem",
  margin: 0,
};

export function Registrar() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [medicalReportFile, setMedicalReportFile] = useState<File | null>(null);

  const {
    formValues,
    errors,
    submitAttempted,
    setSubmitAttempted,
    setErrors,
    setTouched,
    handleInputChange,
    handleCheckboxChange,
    handleRadioChange,
    validateStep,
    getFieldError,
  } = useRegistrarForm();

  const hasDeficiencyOrRestriction =
    (formValues.deficiency.length > 0 &&
      !formValues.deficiency.includes("nenhuma-def")) ||
    (formValues.medicalRestriction.length > 0 &&
      !formValues.medicalRestriction.includes("nenhuma-rest"));

  const activeSteps = steps.filter(
    (step) => step.id !== 6 || hasDeficiencyOrRestriction,
  );
  const currentStepData = activeSteps[currentStep];

  function handleNextStep() {
    setSubmitAttempted(true);
    const stepErrors = validateStep(currentStepData.id, medicalReportFile);
    if (Object.keys(stepErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...stepErrors }));
      setTouched((prev) => ({
        ...prev,
        ...Object.keys(stepErrors).reduce(
          (acc, k) => ({ ...acc, [k]: true }),
          {},
        ),
      }));
      return;
    }
    setSubmitAttempted(false);
    setCurrentStep((prev) => prev + 1);
  }

  function handleBack() {
    setSubmitAttempted(false);
    if (currentStep === 0) navigate(-1);
    else setCurrentStep((prev) => prev - 1);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitAttempted(true);
    const stepErrors = validateStep(currentStepData.id, medicalReportFile);
    if (Object.keys(stepErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...stepErrors }));
      return;
    }
    navigate("/verificar-email", {
      state: { redirectTo: "/login", showSuccessToast: true },
    });
  }

  return (
    <Container>
      <Logo />
      <PageHeader onBack={handleBack}>Criar conta</PageHeader>
      <FormHeader subtitle={currentStepData.subtitle}>
        {currentStepData.title}
      </FormHeader>

      <form onSubmit={handleSubmit}>
        {currentStepData.id === 1 && (
          <>
            <Input
              labelText="Nome"
              type="text"
              id="name"
              name="name"
              placeholder="Arthur Ramos"
              value={formValues.name}
              onChange={handleInputChange}
              errorMessage={getFieldError("name")}
              autoComplete="name"
            />
            <Input
              labelText="CPF"
              type="text"
              id="cpf"
              name="cpf"
              placeholder="123.456.789-10"
              value={formValues.cpf}
              onChange={handleInputChange}
              errorMessage={getFieldError("cpf")}
            />
            <Input
              labelText="E-mail"
              type="email"
              id="email"
              name="email"
              placeholder="arthur@exemplo.com"
              value={formValues.email}
              onChange={handleInputChange}
              errorMessage={getFieldError("email")}
              autoComplete="email"
            />
            <Input
              labelText="Confirmar E-mail"
              type="email"
              id="confirmEmail"
              name="confirmEmail"
              placeholder="arthur@exemplo.com"
              value={formValues.confirmEmail}
              onChange={handleInputChange}
              errorMessage={getFieldError("confirmEmail")}
              autoComplete="email"
            />
          </>
        )}

        {currentStepData.id === 2 && (
          <>
            <Input
              labelText="Senha"
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={formValues.password}
              onChange={handleInputChange}
              errorMessage={getFieldError("password")}
              autoComplete="new-password"
            />
            <Input
              labelText="Confirmar Senha"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="••••••••"
              value={formValues.confirmPassword}
              onChange={handleInputChange}
              errorMessage={getFieldError("confirmPassword")}
              autoComplete="new-password"
            />
          </>
        )}

        {currentStepData.id === 3 && (
          <>
            <Row>
              <CheckboxCard
                image={maleImg}
                alt="Masculino"
                labelText="Masculino"
                id="masculino"
                name="gender"
                value="masculino"
                checked={formValues.gender === "masculino"}
                onChange={(val) => handleRadioChange("gender", val)}
              />
              <CheckboxCard
                image={femaleImg}
                alt="Feminino"
                labelText="Feminino"
                id="feminino"
                name="gender"
                value="feminino"
                checked={formValues.gender === "feminino"}
                onChange={(val) => handleRadioChange("gender", val)}
              />
            </Row>
            {errors.gender && submitAttempted && (
              <p style={errorStyle}>{errors.gender}</p>
            )}
          </>
        )}

        {currentStepData.id === 4 && (
          <>
            <InputCheckbox
              labelText="Nenhuma"
              id="nenhuma-def"
              checked={formValues.deficiency.includes("nenhuma-def")}
              onChange={(id, checked) =>
                handleCheckboxChange("deficiency", "nenhuma-def", id, checked)
              }
            />
            {DEFICIENCY_OPTIONS.map((opt) => (
              <InputCheckbox
                key={opt}
                labelText={
                  opt.charAt(0).toUpperCase() + opt.slice(1).replace("-def", "")
                }
                id={opt}
                checked={formValues.deficiency.includes(opt)}
                disabled={formValues.deficiency.includes("nenhuma-def")}
                onChange={(id, checked) =>
                  handleCheckboxChange("deficiency", "nenhuma-def", id, checked)
                }
              />
            ))}
            {errors.deficiency && submitAttempted && (
              <p style={errorStyle}>{errors.deficiency}</p>
            )}
          </>
        )}

        {currentStepData.id === 5 && (
          <>
            <InputCheckbox
              labelText="Nenhuma"
              id="nenhuma-rest"
              checked={formValues.medicalRestriction.includes("nenhuma-rest")}
              onChange={(id, checked) =>
                handleCheckboxChange(
                  "medicalRestriction",
                  "nenhuma-rest",
                  id,
                  checked,
                )
              }
            />
            {[
              { id: "problemas-cardiacos", label: "Problemas cardíacos" },
              {
                id: "dores-no-peito",
                label: "Dores no peito durante esforço físico ou em repouso",
              },
              { id: "tontura-desmaios", label: "Tontura ou desmaios" },
              {
                id: "problemas-osseos",
                label: "Problemas ósseos ou articulares",
              },
              {
                id: "medicamentos",
                label:
                  "Uso contínuo de medicamentos (ex.: pressão arterial, problemas cardíacos)",
              },
              { id: "cirurgias-recentes", label: "Cirurgias recentes" },
              { id: "outra-rest", label: "Outra" },
            ].map(({ id, label }) => (
              <InputCheckbox
                key={id}
                labelText={label}
                id={id}
                checked={formValues.medicalRestriction.includes(id)}
                disabled={formValues.medicalRestriction.includes(
                  "nenhuma-rest",
                )}
                onChange={(id, checked) =>
                  handleCheckboxChange(
                    "medicalRestriction",
                    "nenhuma-rest",
                    id,
                    checked,
                  )
                }
              />
            ))}
            {errors.medicalRestriction && submitAttempted && (
              <p style={errorStyle}>{errors.medicalRestriction}</p>
            )}
          </>
        )}

        {currentStepData.id === 6 && (
          <>
            <FileUpload id="medicalReport" onFileChange={setMedicalReportFile}>
              Coloque seu documento ou laudo médico liberando a prática de
              atividades físicas
            </FileUpload>
            {errors.medicalReport && submitAttempted && (
              <p style={errorStyle}>{errors.medicalReport}</p>
            )}
          </>
        )}

        {currentStepData.id === 7 && (
          <>
            <Row>
              {[
                { id: "emagrecimento", label: "Emagrecimento", img: maleImg },
                { id: "hipertrofia", label: "Hipertrofia", img: femaleImg },
                {
                  id: "condicionamento",
                  label: "Condicionamento Físico",
                  img: femaleImg,
                },
                {
                  id: "recomendacao-medica",
                  label: "Recomendação Médica",
                  img: femaleImg,
                },
              ].map(({ id, label, img }) => (
                <CheckboxCard
                  key={id}
                  image={img}
                  alt={label}
                  labelText={label}
                  id={id}
                  name="objective"
                  value={id}
                  checked={formValues.objective === id}
                  onChange={(val) => handleRadioChange("objective", val)}
                />
              ))}
            </Row>
            {errors.objective && submitAttempted && (
              <p style={errorStyle}>{errors.objective}</p>
            )}
          </>
        )}

        {currentStepData.id === 8 && (
          <>
            <Row>
              {[
                { id: "iniciante", label: "Iniciante", img: maleImg },
                { id: "intermediario", label: "Intermediário", img: femaleImg },
                { id: "avancado", label: "Avançado", img: femaleImg },
              ].map(({ id, label, img }) => (
                <CheckboxCard
                  key={id}
                  image={img}
                  alt={label}
                  labelText={label}
                  id={id}
                  name="experience"
                  value={id}
                  checked={formValues.experience === id}
                  onChange={(val) => handleRadioChange("experience", val)}
                />
              ))}
            </Row>
            {errors.experience && submitAttempted && (
              <p style={errorStyle}>{errors.experience}</p>
            )}
          </>
        )}

        <div>
          {currentStep < activeSteps.length - 1 && (
            <Button type="button" onClick={handleNextStep}>
              Continuar
            </Button>
          )}
          {currentStep === activeSteps.length - 1 && (
            <Button type="submit">Finalizar</Button>
          )}
        </div>
      </form>
    </Container>
  );
}
