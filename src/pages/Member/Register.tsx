import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Container } from "../../components/Container";
import { Logo } from "../../components/Logo";
import { PageHeader } from "../../components/PageHeader";
import { FormHeader } from "../../components/FormHeader";
import { Input } from "../../components/Input/input";
import { Button } from "../../components/Button";
import { Row } from "../../components/Row";
import { CheckboxCard } from "../../components/CheckboxCard";
import { InputCheckbox } from "../../components/InputCheckbox";

import maleImg from "../../assets/img/register/male.png";
import femaleImg from "../../assets/img/register/female.png";
import weightLossImg from "../../assets/img/register/emagrecimento.png";
import hypertrophyImg from "../../assets/img/register/hipertrofia.png";
import physicalConditioningImg from "../../assets/img/register/condicionamento_fisico.png";
import medicalRecommendationImg from "../../assets/img/register/recomendacao_medica.png";
import beginnerImg from "../../assets/img/register/iniciante.png";
import intermediateImg from "../../assets/img/register/intermediario.png";
import advancedImg from "../../assets/img/register/avancado.png";

import { useRegistrarForm } from "../../hooks/useRegistrarForm";
import { apiPost } from "../../services/api";

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
    subtitle: "Você poderá enviar o laudo depois da confirmação do e-mail",
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
  "multipla",
  "outra",
];

const errorStyle: React.CSSProperties = {
  color: "var(--error)",
  fontSize: "1.2rem",
  margin: 0,
};

export function Register() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [requestError, setRequestError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
      !formValues.deficiency.includes("nenhuma")) ||
    (formValues.medicalRestriction.length > 0 &&
      !formValues.medicalRestriction.includes("nenhuma"));

  const activeSteps = steps.filter(
    (step) => step.id !== 6 || hasDeficiencyOrRestriction,
  );
  const currentStepData = activeSteps[currentStep];

  function handleNextStep() {
    setSubmitAttempted(true);
    const stepErrors = validateStep(currentStepData.id);
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitAttempted(true);
    setRequestError("");
    const stepErrors = validateStep(currentStepData.id);
    if (Object.keys(stepErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...stepErrors }));
      return;
    }
    setSubmitting(true);
    try {
      await apiPost("/cadastros", {
        nome: formValues.name,
        cpf: formValues.cpf,
        email: formValues.email,
        senha: formValues.password,
        sexo:
          formValues.gender === "masculino"
            ? "M"
            : formValues.gender === "feminino"
              ? "F"
              : "OUTRO",
        deficiencia: formValues.deficiency,
        restricao_medica: formValues.medicalRestriction,
        objetivo: formValues.objective.replaceAll("-", "_"),
        nivel: formValues.experience,
      });
      navigate("/verificar-email", {
        state: {
          email: formValues.email,
          redirectTo: "/login",
          showSuccessToast: true,
          action: "register",
        },
      });
    } catch (error) {
      setRequestError(
        error instanceof Error
          ? error.message
          : "Não foi possível criar a conta.",
      );
    } finally {
      setSubmitting(false);
    }
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
            <Row typeRow="row">
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
              <CheckboxCard
                image={maleImg}
                alt="Outro"
                labelText="Outro"
                id="outro"
                name="gender"
                value="outro"
                checked={formValues.gender === "outro"}
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
              id="nenhuma"
              checked={formValues.deficiency.includes("nenhuma")}
              onChange={(id, checked) =>
                handleCheckboxChange("deficiency", "nenhuma", id, checked)
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
                disabled={formValues.deficiency.includes("nenhuma")}
                onChange={(id, checked) =>
                  handleCheckboxChange("deficiency", "nenhuma", id, checked)
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
              id="nenhuma"
              checked={formValues.medicalRestriction.includes("nenhuma")}
              onChange={(id, checked) =>
                handleCheckboxChange(
                  "medicalRestriction",
                  "nenhuma",
                  id,
                  checked,
                )
              }
            />
            {[
              { id: "problemas_cardiacos", label: "Problemas cardíacos" },
              {
                id: "dores_no_peito",
                label: "Dores no peito durante esforço físico ou em repouso",
              },
              { id: "tontura_ou_desmaios", label: "Tontura ou desmaios" },
              {
                id: "problemas_osseos",
                label: "Problemas ósseos ou articulares",
              },
              {
                id: "medicamentos",
                label:
                  "Uso contínuo de medicamentos (ex.: pressão arterial, problemas cardíacos)",
              },
              { id: "cirurgias_recentes", label: "Cirurgias recentes" },
              { id: "outra", label: "Outra" },
            ].map(({ id, label }) => (
              <InputCheckbox
                key={id}
                labelText={label}
                id={id}
                checked={formValues.medicalRestriction.includes(id)}
                disabled={formValues.medicalRestriction.includes(
                  "nenhuma",
                )}
                onChange={(id, checked) =>
                  handleCheckboxChange(
                    "medicalRestriction",
                    "nenhuma",
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
          <p>
            Você poderá enviar o laudo depois de confirmar seu e-mail. A conta
            continuará pendente até a aprovação da academia.
          </p>
        )}

        {currentStepData.id === 7 && (
          <>
            <Row typeRow="row">
              {[
                {
                  id: "emagrecimento",
                  label: "Emagrecimento",
                  img: weightLossImg,
                },
                {
                  id: "hipertrofia",
                  label: "Hipertrofia",
                  img: hypertrophyImg,
                },
                {
                  id: "condicionamento",
                  label: "Condicionamento Físico",
                  img: physicalConditioningImg,
                },
                {
                  id: "recomendacao-medica",
                  label: "Recomendação Médica",
                  img: medicalRecommendationImg,
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
            <Row typeRow="row">
              {[
                { id: "iniciante", label: "Iniciante", img: beginnerImg },
                {
                  id: "intermediario",
                  label: "Intermediário",
                  img: intermediateImg,
                },
                { id: "avancado", label: "Avançado", img: advancedImg },
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

        {requestError && <p style={errorStyle}>{requestError}</p>}
        <div>
          {currentStep < activeSteps.length - 1 && (
            <Button type="button" onClick={handleNextStep}>
              Continuar
            </Button>
          )}
          {currentStep === activeSteps.length - 1 && (
            <Button type="submit" disabled={submitting}>
              {submitting ? "Enviando..." : "Finalizar"}
            </Button>
          )}
        </div>
      </form>
    </Container>
  );
}
