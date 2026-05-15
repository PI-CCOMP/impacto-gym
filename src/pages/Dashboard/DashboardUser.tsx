import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Check, Edit2, Trash2 } from "lucide-react";

import { DashboardGrid } from "../../components/DashboardGrid";
import { SideMenu } from "../../components/SideMenu";
import { Container } from "../../components/Container";
import { Row } from "../../components/Row";
import { ActionButton } from "../../components/ActionButton";
import { UserCard } from "../../components/UserCard";
import { Line } from "../../components/Line";
import { TrainingCard } from "../../components/TrainingCard";
import { Button } from "../../components/Button";
import { Toast } from "../../components/Toast";
import { ButtonStroke } from "../../components/ButtonStroke";

import supinoImg from "../../assets/img/exercise/supino-reto.jpg";

import styles from "./DashboardUser.module.css";

import { mockUsers, mockTrainings, mockLoggedUser } from "../../mocks/mockData";

import { formatDate } from "../../utils/formatDate";
import { hasPermission, can } from "../../utils/permissions";

export function DashboardUser() {
  const { id } = useParams();

  const user = mockUsers.find((u) => u.id === id);

  if (!user) {
    return (
      <DashboardGrid>
        <SideMenu />
        <Container isDashboard>
          <h1>Usuário não encontrado.</h1>
        </Container>
      </DashboardGrid>
    );
  }

  const isAluno = user.profile === "Aluno";

  // treinos vinculados ao aluno
  const linkedTrainings = isAluno
    ? mockTrainings.filter((t) => user.trainingIds?.includes(t.id))
    : [];

  const navigate = useNavigate();

  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  return (
    <DashboardGrid>
      <SideMenu />
      <Container style={{ paddingTop: 0, minHeight: "unset" }}>
        <Row typeRow="row-space">
          <h1>Usuário</h1>
          {mockLoggedUser.role === "admin" && (
            <ActionButton
              variant="edit"
              icon={<Edit2 size={16} />}
              onClick={() => navigate(`/dashboard/usuario/${user.id}/editar`)}
            />
          )}
        </Row>

        <div>
          <UserCard
            image={user.image ?? supinoImg}
            name={user.name}
            cpf={user.cpf}
            instructor={user.instructor}
          />

          <div className={styles.contentUser}>
            <ul>
              <h2>Informações Pessoais</h2>
              <li>
                <b>E-mail:</b>
                <p>{user.email}</p>
              </li>
              <li>
                <b>Sexo:</b>
                <p>{user.gender}</p>
              </li>
            </ul>

            {isAluno && (
              <ul>
                <h2>Informações de Treino</h2>
                <li>
                  <b>Objetivo:</b>
                  <p>{user.goal ?? "—"}</p>
                </li>
                <li>
                  <b>Experiência:</b>
                  <p>{user.experience ?? "—"}</p>
                </li>
              </ul>
            )}

            {isAluno && (
              <ul>
                <h2>Informações Médicas</h2>
                <li>
                  <b>Deficiência:</b>
                  <p>{user.disability ?? "—"}</p>
                </li>
                <li>
                  <b>Restrição Médica:</b>
                  <p>{user.medicalRestriction ?? "—"}</p>
                </li>
              </ul>
            )}

            <ul>
              <h2>Dados da Conta</h2>
              <li>
                <b>Criada em:</b>
                <p>{formatDate(user.createdAt)}</p>
              </li>
              <li>
                <b>Tipo:</b>
                <p>{user.profile}</p>
              </li>
            </ul>
          </div>

          {isAluno && (
            <>
              <Line />
              <div className={styles.trainingContent}>
                <h1>Treinos Vinculados</h1>
                {linkedTrainings.length === 0 ? (
                  <p>Nenhum treino vinculado.</p>
                ) : (
                  linkedTrainings.map((training) => (
                    <div
                      key={training.id}
                      onClick={() =>
                        navigate(`/dashboard/treino/${training.id}`)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <TrainingCard
                        variant="dashboard"
                        dataState="default"
                        image={training.image}
                        alt={training.alt}
                        trainingName={training.trainingName}
                        muscleGroups={training.muscleGroups}
                        onUnlink={
                          can.unlinkTraining
                            ? (e) => {
                                e.stopPropagation();
                                console.log(
                                  "Desvincular treino",
                                  training.id,
                                  "do usuário",
                                  user.id,
                                );
                              }
                            : undefined
                        }
                      />
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
        {mockLoggedUser.role === "admin" && (
          <Button variant="red" onClick={() => setShowDeleteToast(true)}>
            Deletar Usuário
          </Button>
        )}

        {showDeleteToast && (
          <Toast
            message={`Você realmente quer deletar ${user.name}?`}
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
                // Em produção: await api.delete(`/users/${user.id}`)
                console.log("Deletar usuário", user.id);
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
            highlight="Usuário"
            highlightPosition="before"
            icon={<Check />}
            onClose={() => {
              setShowSuccessToast(false);
              navigate("/dashboard/usuarios");
            }}
          />
        )}
      </Container>
    </DashboardGrid>
  );
}
