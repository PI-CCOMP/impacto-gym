import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import {
  apiDeleteAuthed,
  apiGet,
  fotoPerfilPrivada,
} from "../../services/api";

import anonymousImg from "../../assets/img/profile/anonymous.png";
import exerciseSupino from "../../assets/img/exercise/supino.gif";
import styles from "./DashboardUser.module.css";

type UserDetail = {
  id_usuario: number;
  nome: string;
  cpf?: string;
  email?: string;
  sexo?: string;
  perfil: "aluno" | "instrutor" | "recepcionista" | "admin";
  foto_url: string | null;
  criado_em?: string;
  aluno: {
    id_aluno: number;
    nivel: string;
    objetivo: string;
    deficiencia?: string[];
    restricao_medica?: string[];
    status: string;
    id_instrutor: number | null;
  } | null;
  treinos_vinculados: {
    id_aluno_treino: number;
    id_treino: number;
    nome_treino: string;
  }[];
};

const profileLabels: Record<UserDetail["perfil"], string> = {
  aluno: "Aluno",
  instrutor: "Instrutor",
  recepcionista: "Recepcionista",
  admin: "Administrador",
};

export function DashboardUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [photo, setPhoto] = useState(anonymousImg);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadUser() {
      try {
        const detail = await apiGet<UserDetail>(`/usuarios/${id}`);
        if (!active) return;
        setUser(detail);
        if (detail.foto_url) {
          const imageUrl = await fotoPerfilPrivada(detail.id_usuario);
          if (active) setPhoto(imageUrl);
        }
      } catch (requestError) {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Não foi possível carregar o usuário.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadUser();
    return () => {
      active = false;
    };
  }, [id]);

  async function handleUnlink(trainingId: number) {
    if (!user) return;
    setError("");
    try {
      await apiDeleteAuthed(
        `/usuarios/${user.id_usuario}/treinos/${trainingId}`,
      );
      setUser((current) =>
        current
          ? {
              ...current,
              treinos_vinculados: current.treinos_vinculados.filter(
                (training) => training.id_aluno_treino !== trainingId,
              ),
            }
          : current,
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível desvincular o treino.",
      );
    }
  }

  async function handleDelete() {
    if (!user) return;
    setDeleting(true);
    setError("");
    try {
      await apiDeleteAuthed(`/usuarios/${user.id_usuario}`);
      setShowDeleteToast(false);
      setShowSuccessToast(true);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível excluir o usuário.",
      );
    } finally {
      setDeleting(false);
    }
  }

  if (loading || !user) {
    return (
      <DashboardGrid>
        <SideMenu />
        <Container isDashboard>
          <h1>Usuário</h1>
          {loading ? <p>Carregando...</p> : <p role="alert">{error}</p>}
        </Container>
      </DashboardGrid>
    );
  }

  const isAluno = user.perfil === "aluno";
  const isAdmin = sessionStorage.getItem("perfil") === "admin";

  return (
    <DashboardGrid>
      <SideMenu />
      <Container style={{ paddingTop: 0, minHeight: "unset" }}>
        <Row typeRow="row-space">
          <h1>Usuário</h1>
          {isAdmin && (
            <ActionButton
              variant="edit"
              icon={<Edit2 size={16} />}
              onClick={() =>
                navigate(`/dashboard/usuario/${user.id_usuario}/editar`)
              }
            />
          )}
        </Row>
        {error && <p role="alert">{error}</p>}
        <div>
          <UserCard
            id={String(user.id_usuario)}
            image={photo}
            name={user.nome}
            cpf={user.cpf ?? "—"}
          />

          <div className={styles.contentUser}>
            <ul>
              <h2>Informações Pessoais</h2>
              {user.email && (
                <li>
                  <b>E-mail:</b>
                  <p>{user.email}</p>
                </li>
              )}
              {user.sexo && (
                <li>
                  <b>Sexo:</b>
                  <p>{user.sexo}</p>
                </li>
              )}
            </ul>

            {isAluno && user.aluno && (
              <>
                <ul>
                  <h2>Informações de Treino</h2>
                  <li>
                    <b>Objetivo:</b>
                    <p>{user.aluno.objetivo}</p>
                  </li>
                  <li>
                    <b>Experiência:</b>
                    <p>{user.aluno.nivel}</p>
                  </li>
                  <li>
                    <b>Status:</b>
                    <p>{user.aluno.status}</p>
                  </li>
                </ul>
                {(user.aluno.deficiencia || user.aluno.restricao_medica) && (
                  <ul>
                    <h2>Informações Médicas</h2>
                    {user.aluno.deficiencia && (
                      <li>
                        <b>Deficiência:</b>
                        <p>{user.aluno.deficiencia.join(", ")}</p>
                      </li>
                    )}
                    {user.aluno.restricao_medica && (
                      <li>
                        <b>Restrição Médica:</b>
                        <p>{user.aluno.restricao_medica.join(", ")}</p>
                      </li>
                    )}
                  </ul>
                )}
              </>
            )}

            <ul>
              <h2>Dados da Conta</h2>
              {user.criado_em && (
                <li>
                  <b>Criada em:</b>
                  <p>{new Date(user.criado_em).toLocaleDateString("pt-BR")}</p>
                </li>
              )}
              <li>
                <b>Tipo:</b>
                <p>{profileLabels[user.perfil]}</p>
              </li>
            </ul>
          </div>

          {isAluno && (
            <>
              <Line />
              <div className={styles.trainingContent}>
                <h1>Treinos Vinculados</h1>
                {user.treinos_vinculados.length === 0 ? (
                  <p>Nenhum treino vinculado.</p>
                ) : (
                  user.treinos_vinculados.map((training) => (
                    <div
                      key={training.id_aluno_treino}
                      onClick={() =>
                        navigate(
                          `/dashboard/treino/${training.id_treino}`,
                        )
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <TrainingCard
                        variant="dashboard"
                        dataState="default"
                        image={exerciseSupino}
                        alt={training.nome_treino}
                        trainingName={training.nome_treino}
                        muscleGroups={[]}
                        onUnlink={
                          isAdmin
                            ? () => void handleUnlink(training.id_aluno_treino)
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
        {isAdmin && (
          <Button variant="red" onClick={() => setShowDeleteToast(true)}>
            Deletar Usuário
          </Button>
        )}

        {showDeleteToast && (
          <Toast
            message={`Você realmente quer deletar ${user.nome}?`}
            icon={<Trash2 />}
            onClose={() => setShowDeleteToast(false)}
          >
            <Button
              style={{ marginTop: 0 }}
              onClick={() => setShowDeleteToast(false)}
              disabled={deleting}
            >
              Cancelar
            </Button>
            <ButtonStroke onClick={() => void handleDelete()} disabled={deleting}>
              {deleting ? "Excluindo..." : "Deletar"}
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
