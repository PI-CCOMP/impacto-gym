import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Edit2, Plus, Search, Trash2, Check, X } from "lucide-react";

import { DashboardGrid } from "../../components/DashboardGrid";
import { SideMenu } from "../../components/SideMenu";
import { Container } from "../../components/Container";
import { DashboardRow } from "../../components/DashboardRow";
import { PageHeader } from "../../components/PageHeader";
import { ActionButton } from "../../components/ActionButton";
import { ExerciseCard } from "../../components/ExerciseCard";
import { Line } from "../../components/Line";
import { Button } from "../../components/Button";
import { ButtonStroke } from "../../components/ButtonStroke";
import { Input } from "../../components/Input/input";
import { Toast } from "../../components/Toast";
import {
  apiDeleteAuthed,
  apiGet,
  apiGetAllPages,
  apiPostAuthed,
} from "../../services/api";
import { normalizeMuscleGroups } from "../../utils/training";
import { can } from "../../utils/permissions";
import styles from "./DashboardUsers.module.css";

type TrainingExercise = {
  id_exercicio: number;
  nome: string;
  foto_url: string | null;
  grupo_muscular: string;
  series: number;
  repeticoes: number;
  carga_sugerida: number;
  tempo_descanso: number;
};
type LinkedStudent = {
  id_usuario: number;
  id_aluno_treino: number;
  nome: string;
  cpf?: string;
};
type TrainingDetail = {
  id_treino: number;
  nome: string;
  grupos_musculares: string[];
  exercicios: TrainingExercise[];
  alunos_vinculados: LinkedStudent[];
};
type TrainingDetailResponse = Omit<TrainingDetail, "grupos_musculares"> & {
  grupos_musculares: unknown;
};
type Student = {
  id_usuario: number;
  nome: string;
  status: string | null;
};

function displayGroup(group: string): string {
  if (group === "Bracos") return "Braços";
  if (group === "Abdomen") return "Abdômen";
  return group;
}

export function DashboardTrainingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [training, setTraining] = useState<TrainingDetail | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState("");
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadTraining = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [detail, userResult] = await Promise.all([
        apiGet<TrainingDetailResponse>(`/treinos/${id}`),
        apiGetAllPages<Student>("/usuarios?perfil=aluno"),
      ]);
      setTraining({
        ...detail,
        grupos_musculares: normalizeMuscleGroups(detail.grupos_musculares),
      });
      setStudents(userResult.filter((student) => student.status === "ativo"));
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Não foi possível carregar o treino.",
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadTraining();
  }, [loadTraining]);

  const linkedIds = new Set(
    training?.alunos_vinculados.map((student) => student.id_usuario) ?? [],
  );
  const availableStudents = students.filter(
    (student) =>
      !linkedIds.has(student.id_usuario) &&
      student.nome.toLowerCase().includes(userSearch.toLowerCase()),
  );

  async function handleUnlink(userId: number) {
    if (!id) return;
    setSaving(true);
    try {
      await apiDeleteAuthed(`/treinos/${id}/alunos/${userId}`);
      await loadTraining();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Não foi possível desvincular o aluno.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleLink() {
    if (!id || selectedUserId === null) return;
    setSaving(true);
    try {
      await apiPostAuthed(`/treinos/${id}/alunos`, {
        id_aluno: selectedUserId,
      });
      setShowLinkModal(false);
      setSelectedUserId(null);
      setUserSearch("");
      await loadTraining();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Não foi possível vincular o aluno.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteTraining() {
    if (!id) return;
    setSaving(true);
    try {
      await apiDeleteAuthed(`/treinos/${id}`);
      setShowDeleteToast(false);
      setShowSuccessToast(true);
    } catch (error) {
      setShowDeleteToast(false);
      setErrorMessage(
        error instanceof Error ? error.message : "Não foi possível excluir o treino.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <DashboardGrid>
        <SideMenu />
        <Container isDashboard>
          <p role="status">Carregando treino...</p>
        </Container>
      </DashboardGrid>
    );
  }

  if (!training) {
    return (
      <DashboardGrid>
        <SideMenu />
        <Container isDashboard>
          <PageHeader onBack={() => navigate(-1)}>
            {errorMessage ?? "Treino não encontrado."}
          </PageHeader>
        </Container>
      </DashboardGrid>
    );
  }

  return (
    <DashboardGrid>
      <SideMenu />
      <Container isDashboard>
        <DashboardRow variant="sideBySide" style={{ paddingTop: 0 }}>
          <PageHeader onBack={() => navigate(-1)}>{training.nome}</PageHeader>
          {can.editTraining && (
            <ActionButton
              variant="edit"
              icon={<Edit2 size={16} />}
              onClick={() =>
                navigate(`/dashboard/treino/${training.id_treino}/editar`)
              }
            />
          )}
        </DashboardRow>

        <div style={{ display: "flex", gap: "var(--size-sm)", alignItems: "center" }}>
          <b>Grupos Musculares:</b>
          <p>{training.grupos_musculares.map(displayGroup).join(", ")}</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--size-md)" }}>
          <h2>Exercícios</h2>
          {training.exercicios.map((exercise) => (
            <ExerciseCard
              key={exercise.id_exercicio}
              id={String(exercise.id_exercicio)}
              image={exercise.foto_url}
              alt={exercise.nome}
              exerciseName={exercise.nome}
            />
          ))}
        </div>

        <Line />
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--size-md)" }}>
          <DashboardRow>
            <h2>Alunos Vinculados</h2>
            {can.editTraining && (
              <ActionButton
                variant="accept"
                icon={<Plus size={16} />}
                title="Vincular aluno"
                onClick={() => setShowLinkModal(true)}
              />
            )}
          </DashboardRow>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                {can.editTraining && <th>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {training.alunos_vinculados.map((student) => (
                <tr key={student.id_aluno_treino}>
                  <td data-label="Nome">{student.nome}</td>
                  <td data-label="CPF">{student.cpf ?? "—"}</td>
                  {can.editTraining && (
                    <td data-label="Ações">
                      <ActionButton
                        variant="close"
                        icon={<X size={16} />}
                        title="Desvincular aluno"
                        onClick={() => void handleUnlink(student.id_usuario)}
                      />
                    </td>
                  )}
                </tr>
              ))}
              {training.alunos_vinculados.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center", padding: "var(--size-xl)" }}>
                    Nenhum aluno vinculado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {can.editTraining && (
          <Button variant="red" onClick={() => setShowDeleteToast(true)}>
            Deletar Treino
          </Button>
        )}

        {showLinkModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 300,
              padding: "var(--size-md)",
              boxSizing: "border-box",
            }}
            onClick={() => setShowLinkModal(false)}
          >
            <div
              style={{
                backgroundColor: "var(--primary-light)",
                borderRadius: "var(--size-sm)",
                padding: "var(--size-xl)",
                width: "100%",
                maxWidth: 420,
                display: "flex",
                flexDirection: "column",
                gap: "var(--size-md)",
                maxHeight: "80dvh",
                overflowY: "auto",
                boxSizing: "border-box",
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <h2 style={{ textAlign: "center", margin: 0 }}>Vincular Aluno</h2>
              <p style={{ textAlign: "center", margin: 0, color: "var(--text-default)" }}>
                Busque e selecione um aluno ativo
              </p>
              <Input
                type="text"
                id="link-user-search"
                name="link-user-search"
                placeholder="Nome do aluno"
                leftIcon={<Search />}
                value={userSearch}
                onChange={(event) => {
                  setUserSearch(event.target.value);
                  setSelectedUserId(null);
                }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--size-sm)" }}>
                {availableStudents.length === 0 && (
                  <p style={{ color: "var(--text-default)", textAlign: "center" }}>
                    Nenhum aluno disponível.
                  </p>
                )}
                {availableStudents.map((student) => (
                  <button
                    key={student.id_usuario}
                    type="button"
                    onClick={() => setSelectedUserId(student.id_usuario)}
                    style={{
                      padding: "var(--size-sm) var(--size-md)",
                      borderRadius: "var(--size-sm)",
                      cursor: "pointer",
                      border: `2px solid ${selectedUserId === student.id_usuario ? "var(--secondary)" : "var(--primary-light-contrast)"}`,
                      color: "var(--text-default)",
                      background: "transparent",
                      textAlign: "left",
                    }}
                  >
                    {student.nome}
                  </button>
                ))}
              </div>
              <Button
                onClick={() => void handleLink()}
                disabled={selectedUserId === null || saving}
                style={{ marginTop: 0 }}
              >
                Adicionar
              </Button>
            </div>
          </div>
        )}

        {showDeleteToast && (
          <Toast
            message={`Você realmente quer deletar "${training.nome}"?`}
            icon={<Trash2 />}
            onClose={() => setShowDeleteToast(false)}
          >
            <Button style={{ marginTop: 0 }} onClick={() => setShowDeleteToast(false)}>
              Cancelar
            </Button>
            <ButtonStroke onClick={() => void handleDeleteTraining()}>
              Deletar
            </ButtonStroke>
          </Toast>
        )}
        {showSuccessToast && (
          <Toast
            message="excluído com sucesso!"
            highlight="Treino"
            highlightPosition="before"
            icon={<Check />}
            onClose={() => {
              setShowSuccessToast(false);
              navigate("/dashboard/treinos");
            }}
          />
        )}
        {errorMessage && (
          <Toast message={errorMessage} icon={<X />} onClose={() => setErrorMessage(null)} />
        )}
        {saving && <p role="status">Salvando...</p>}
      </Container>
    </DashboardGrid>
  );
}
