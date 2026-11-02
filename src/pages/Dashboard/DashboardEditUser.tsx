import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Container } from "../../components/Container";
import { DashboardGrid } from "../../components/DashboardGrid";
import { PageHeader } from "../../components/PageHeader";
import { SideMenu } from "../../components/SideMenu";
import { Input } from "../../components/Input/input";
import { Select } from "../../components/Select";
import { InputCheckbox } from "../../components/InputCheckbox";
import { Button } from "../../components/Button";
import { Toast } from "../../components/Toast";

import { useUserForm, type UserFormValues } from "../../hooks/useUserForm";
import {
  GENDER_OPTIONS,
  GOAL_OPTIONS,
  EXPERIENCE_OPTIONS,
  DISABILITY_OPTIONS,
  RESTRICTION_OPTIONS,
} from "../../utils/formOptions";
import { apiGet, apiPutAuthed } from "../../services/api";

type UserDetail = {
  id_usuario: number;
  nome: string;
  email?: string;
  sexo?: string;
  perfil: "aluno" | "instrutor" | "recepcionista" | "admin";
  aluno: {
    objetivo: string;
    nivel: string;
    deficiencia?: string[];
    restricao_medica?: string[];
  } | null;
};

const profileLabel: Record<UserDetail["perfil"], string> = {
  aluno: "Aluno",
  instrutor: "Instrutor",
  recepcionista: "Recepcionista",
  admin: "Administrador",
};

function optionLabel(value: string | undefined, options: { value: string; label: string }[], fallback: string) {
  return options.find((option) => option.value === value)?.label ?? fallback;
}

function initialValues(user: UserDetail): Partial<UserFormValues> {
  return {
    name: user.nome,
    email: user.email ?? "",
    gender:
      user.sexo === "F"
        ? "Feminino"
        : user.sexo === "M"
          ? "Masculino"
          : "Outro",
    profile: profileLabel[user.perfil],
    goal: optionLabel(user.aluno?.objetivo, GOAL_OPTIONS, "Hipertrofia"),
    experience: optionLabel(
      user.aluno?.nivel,
      EXPERIENCE_OPTIONS,
      "Iniciante",
    ),
    disability:
      user.aluno?.deficiencia?.length
        ? user.aluno.deficiencia
        : ["nenhuma"],
    medicalRestriction:
      user.aluno?.restricao_medica?.length
        ? user.aluno.restricao_medica
        : ["nenhuma"],
  };
}

function enumValue(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll(" ", "_")
    .toLowerCase();
}

export function DashboardEditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiGet<UserDetail>(`/usuarios/${id}`)
      .then((result) => {
        if (active) setUser(result);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Não foi possível carregar o usuário.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (loading || !user) {
    return (
      <DashboardGrid>
        <SideMenu />
        <Container isDashboard>
          <PageHeader onBack={() => navigate(-1)}>Editar Usuário</PageHeader>
          {loading ? <p>Carregando...</p> : <p role="alert">{error}</p>}
        </Container>
      </DashboardGrid>
    );
  }

  return <EditUserForm user={user} />;
}

function EditUserForm({ user }: { user: UserDetail }) {
  const navigate = useNavigate();
  const [requestError, setRequestError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [emailConfirmationRequired, setEmailConfirmationRequired] =
    useState(false);
  const {
    values,
    handleChange,
    handleSubmitValidate,
    getError,
    requiresMedicalReport,
    handleMedicalToggle,
  } = useUserForm({ mode: "edit", initial: initialValues(user) });
  const isAluno = user.perfil === "aluno";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!handleSubmitValidate()) return;
    setRequestError("");
    setSubmitting(true);
    try {
      const result = await apiPutAuthed<{
        email_verification_required?: boolean;
      }>(`/usuarios/${user.id_usuario}`, {
        nome: values.name,
        email: values.email,
        sexo:
          values.gender === "Masculino"
            ? "M"
            : values.gender === "Feminino"
              ? "F"
              : "OUTRO",
        perfil: user.perfil,
        ...(isAluno
          ? {
              aluno: {
                objetivo: enumValue(values.goal),
                nivel: enumValue(values.experience),
                deficiencia: values.disability,
                restricao_medica: values.medicalRestriction,
              },
            }
          : {}),
      });
      if (result.email_verification_required) {
        setEmailConfirmationRequired(true);
      } else {
        navigate(`/dashboard/usuario/${user.id_usuario}`, {
          replace: true,
          state: { updated: true },
        });
      }
    } catch (requestError) {
      setRequestError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível atualizar o usuário.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardGrid>
      <SideMenu />
      <Container isDashboard>
        <PageHeader onBack={() => navigate(-1)}>Editar Usuário</PageHeader>
        {requestError && <p role="alert">{requestError}</p>}
        {emailConfirmationRequired && (
          <Toast
            message="Os dados foram atualizados. O usuário precisa confirmar o novo e-mail para concluir a alteração."
            onClose={() => {
              setEmailConfirmationRequired(false);
              navigate(`/dashboard/usuario/${user.id_usuario}`);
            }}
          />
        )}

        <form onSubmit={handleSubmit}>
          <b>Informações Pessoais</b>
          <Input
            type="text"
            labelText="Nome"
            placeholder="Ex: Arthur"
            name="name"
            id="name"
            value={values.name}
            onChange={(event) => handleChange("name", event.target.value)}
            errorMessage={getError("name")}
          />
          <Input
            type="email"
            labelText="E-mail"
            placeholder="Ex: arthur@exemplo.com"
            name="email"
            id="email"
            value={values.email}
            onChange={(event) => handleChange("email", event.target.value)}
            errorMessage={getError("email")}
          />
          {isAluno && (
            <Select
              id="gender"
              labelText="Sexo"
              value={values.gender}
              onChange={(value) => handleChange("gender", value)}
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
                onChange={(value) => handleChange("goal", value)}
                options={GOAL_OPTIONS}
              />
              <Select
                id="experience"
                labelText="Experiência"
                value={values.experience}
                onChange={(value) => handleChange("experience", value)}
                options={EXPERIENCE_OPTIONS}
              />
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
                  Alterações médicas podem exigir novo laudo e revisão antes de
                  liberar o acesso.
                </p>
              )}
            </>
          )}
          <Button type="submit" disabled={submitting}>
            {submitting ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </Container>
    </DashboardGrid>
  );
}
