import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

import { mockTrainings, mockUsers, mockLoggedUser } from "../../mocks/mockData";

import styles from "./DashboardUsers.module.css";

export function DashboardTrainingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const training = mockTrainings.find((t) => t.id === id);

  const [linkedUserIds, setLinkedUserIds] = useState<string[]>(
    mockUsers
      .filter((u) => u.profile === "Aluno" && u.trainingIds?.includes(id ?? ""))
      .map((u) => u.id),
  );
  const [userSearch, setUserSearch] = useState("");
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!training) {
    return (
      <DashboardGrid>
        <SideMenu />
        <Container>
          <PageHeader onBack={() => navigate(-1)}>
            Treino não encontrado.
          </PageHeader>
        </Container>
      </DashboardGrid>
    );
  }

  const canEdit =
    mockLoggedUser.role === "admin" || mockLoggedUser.role === "instructor";

  const linkedUsers = mockUsers.filter((u) => linkedUserIds.includes(u.id));

  const availableUsers = mockUsers.filter(
    (u) =>
      u.profile === "Aluno" &&
      !linkedUserIds.includes(u.id) &&
      u.name.toLowerCase().includes(userSearch.toLowerCase()),
  );

  function handleUnlink(userId: string) {
    setLinkedUserIds((prev) => prev.filter((uid) => uid !== userId));
  }

  function handleLink() {
    if (!selectedUserId) return;
    setLinkedUserIds((prev) => [...prev, selectedUserId]);
    setSelectedUserId(null);
    setUserSearch("");
    setShowLinkModal(false);
  }

  function handleDeleteTraining() {
    if (linkedUserIds.length > 0) {
      setErrorMessage(
        "Remova todos os alunos vinculados antes de deletar o treino.",
      );
      return;
    }
    setShowDeleteToast(true);
  }

  return (
    <DashboardGrid>
      <SideMenu />
      <Container style={{ paddingTop: 0 }}>
        <DashboardRow variant="sideBySide" style={{ paddingTop: 0 }}>
          <PageHeader onBack={() => navigate(-1)}>
            {training.trainingName}
          </PageHeader>
          {canEdit && (
            <ActionButton
              variant="edit"
              icon={<Edit2 size={16} />}
              onClick={() =>
                navigate(`/dashboard/treino/${training.id}/editar`)
              }
            />
          )}
        </DashboardRow>

        <div
          style={{
            display: "flex",
            gap: "var(--size-sm)",
            alignItems: "center",
          }}
        >
          <b>Grupos Musculares:</b>
          <p>{training.muscleGroups.join(", ")}</p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--size-md)",
          }}
        >
          <h2>Exercícios</h2>
          {training.exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              id={exercise.id}
              image={exercise.image}
              alt={exercise.alt}
              exerciseName={exercise.exerciseName}
            />
          ))}
        </div>

        <Line />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--size-md)",
          }}
        >
          <DashboardRow>
            <h2>Alunos Vinculados</h2>
            {canEdit && (
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
                {canEdit && <th></th>}
              </tr>
            </thead>
            <tbody>
              {linkedUsers.map((user) => (
                <tr key={user.id}>
                  <td data-label="Nome">{user.name}</td>
                  <td data-label="CPF">{user.cpf}</td>
                  {canEdit && (
                    <td data-label="Ações">
                      <div
                        style={{
                          display: "flex",
                          gap: "var(--size-md)",
                          justifyContent: "flex-end",
                        }}
                      >
                        <ActionButton
                          variant="close"
                          icon={<X size={16} />}
                          title="Desvincular aluno"
                          onClick={() => handleUnlink(user.id)}
                        />
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {linkedUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    style={{ textAlign: "center", padding: "var(--size-xl)" }}
                  >
                    Nenhum aluno vinculado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {canEdit && (
          <Button variant="red" onClick={handleDeleteTraining}>
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
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ textAlign: "center", margin: 0 }}>Vincular Aluno</h2>
              <p
                style={{
                  textAlign: "center",
                  margin: 0,
                  color: "var(--text-default)",
                }}
              >
                Busque e selecione um aluno
              </p>

              <Input
                type="text"
                id="link-user-search"
                name="link-user-search"
                placeholder="Nome do aluno"
                leftIcon={<Search />}
                value={userSearch}
                onChange={(e) => {
                  setUserSearch(e.target.value);
                  setSelectedUserId(null);
                }}
              />

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--size-sm)",
                }}
              >
                {availableUsers.length === 0 && (
                  <p
                    style={{
                      color: "var(--text-default)",
                      textAlign: "center",
                    }}
                  >
                    Nenhum aluno disponível.
                  </p>
                )}
                {availableUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUserId(user.id)}
                    style={{
                      padding: "var(--size-sm) var(--size-md)",
                      borderRadius: "var(--size-sm)",
                      cursor: "pointer",
                      border: `2px solid ${selectedUserId === user.id ? "var(--secondary)" : "var(--primary-light-contrast)"}`,
                      color: "var(--text-default)",
                    }}
                  >
                    {user.name}
                  </div>
                ))}
              </div>

              <Button
                onClick={handleLink}
                disabled={!selectedUserId}
                style={{ marginTop: 0 }}
              >
                Adicionar
              </Button>
            </div>
          </div>
        )}

        {showDeleteToast && (
          <Toast
            message={`Você realmente quer deletar "${training.trainingName}"?`}
            icon={<Trash2 />}
            onClose={() => setShowDeleteToast(false)}
          >
            <Button
              style={{ marginTop: 0 }}
              onClick={() => setShowDeleteToast(false)}
            >
              Cancelar
            </Button>
            <ButtonStroke
              onClick={() => {
                console.log("Deletar treino", training.id);
                setShowDeleteToast(false);
                setShowSuccessToast(true);
              }}
            >
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
          <Toast
            message={errorMessage}
            icon={<X />}
            onClose={() => setErrorMessage(null)}
          />
        )}
      </Container>
    </DashboardGrid>
  );
}
