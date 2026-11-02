import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  RectangleEllipsis,
  Edit2,
  Trash2,
  Check,
  X,
  FileText,
  Plus,
  RefreshCw,
  UserPlus,
} from "lucide-react";

import { DashboardGrid } from "../../components/DashboardGrid";
import { SideMenu } from "../../components/SideMenu";
import { Container } from "../../components/Container";
import { DashboardRow } from "../../components/DashboardRow";
import { Input } from "../../components/Input/input";
import { InputCheckbox } from "../../components/InputCheckbox";
import { ActionButton } from "../../components/ActionButton";
import { Pagination } from "../../components/Pagination";
import { Line } from "../../components/Line";
import { QuickEditModal } from "../../components/QuickEditModal";
import { Toast } from "../../components/Toast";
import { Button } from "../../components/Button";
import { ButtonStroke } from "../../components/ButtonStroke";
import { MaskedCPF } from "../../components/MakedCPF";
import {
  apiDeleteAuthed,
  apiGet,
  apiGetBlob,
  apiPatchAuthed,
  apiPutAuthed,
} from "../../services/api";
import { hasPermission } from "../../utils/permissions";

import styles from "./DashboardUsers.module.css";

type UserProfile = "aluno" | "instrutor" | "recepcionista" | "admin";
type UserItem = {
  id_usuario: number;
  nome: string;
  perfil: UserProfile;
  status: string | null;
  cpf?: string;
  email?: string;
  instrutor_vinculado?: string | null;
};
type Registration = {
  id_aluno: number;
  nome: string;
  email_verificado: boolean;
  deficiencia?: string[];
  restricao_medica?: string[];
  cpf?: string;
  documento: {
    id_documento: number;
    nome_arquivo: string;
    status: string;
  } | null;
};
type PageResult<T> = {
  dados: T[];
  total: number;
  pagina: number;
  por_pagina: number;
};

const profileLabels: Record<UserProfile, string> = {
  aluno: "Aluno",
  instrutor: "Instrutor",
  recepcionista: "Recepcionista",
  admin: "Administrador",
};
const profileValues: Record<string, UserProfile> = {
  Aluno: "aluno",
  Instrutor: "instrutor",
  Recepcionista: "recepcionista",
  Administrador: "admin",
};

export function DashboardUsers() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersRefresh, setUsersRefresh] = useState(0);
  const [pendingPage, setPendingPage] = useState(1);
  const [pendingPageSize, setPendingPageSize] = useState(10);
  const [pendingSearch, setPendingSearch] = useState("");
  const [pending, setPending] = useState<Registration[]>([]);
  const [totalPending, setTotalPending] = useState(0);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [pendingRefresh, setPendingRefresh] = useState(0);
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserItem | null>(null);
  const [managingStudentInstructor, setManagingStudentInstructor] =
    useState<UserItem | null>(null);
  const [managingInstructorBusy, setManagingInstructorBusy] = useState(false);
  const [rejectingRegistration, setRejectingRegistration] =
    useState<Registration | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const isInstructor = sessionStorage.getItem("perfil") === "instrutor";
  const showAdminFilter = sessionStorage.getItem("perfil") === "admin";

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams({
      pagina: String(page),
      por_pagina: String(pageSize),
    });
    if (!isInstructor) {
      params.set("busca", search);
      const selected = selectedRoles
        .map((label) => profileValues[label])
        .filter((profile): profile is UserProfile => Boolean(profile));
      if (selected.length > 0) params.set("perfil", selected.join(","));
    }
    setUsersLoading(true);
    apiGet<PageResult<UserItem>>(`/usuarios?${params}`)
      .then((result) => {
        if (!active) return;
        const lastPage = Math.max(1, Math.ceil(result.total / pageSize));
        if (page > lastPage) {
          setPage(lastPage);
          return;
        }
        setUsers(result.dados);
        setTotalUsers(result.total);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Não foi possível carregar os usuários.",
          );
        }
      })
      .finally(() => {
        if (active) setUsersLoading(false);
      });
    return () => {
      active = false;
    };
  }, [
    page,
    pageSize,
    search,
    selectedRoles,
    isInstructor,
    usersRefresh,
  ]);

  useEffect(() => {
    if (isInstructor) {
      setPending([]);
      setTotalPending(0);
      setPendingLoading(false);
      return;
    }
    let active = true;
    const params = new URLSearchParams({
      status: "pendente",
      busca: pendingSearch,
      pagina: String(pendingPage),
      por_pagina: String(pendingPageSize),
    });
    setPendingLoading(true);
    apiGet<PageResult<Registration>>(`/cadastros?${params}`)
      .then((result) => {
        if (!active) return;
        setPending(result.dados);
        setTotalPending(result.total);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Não foi possível carregar os cadastros pendentes.",
          );
        }
      })
      .finally(() => {
        if (active) setPendingLoading(false);
      });
    return () => {
      active = false;
    };
  }, [isInstructor, pendingPage, pendingPageSize, pendingSearch, pendingRefresh]);

  function toggleRole(role: string) {
    setSelectedRoles((previous) =>
      previous.includes(role)
        ? previous.filter((item) => item !== role)
        : [...previous, role],
    );
    setPage(1);
  }

  async function handleApprove(registration: Registration) {
    const requiresApprovedReport = [
      ...(registration.deficiencia ?? []),
      ...(registration.restricao_medica ?? []),
    ].some((value) => value !== "nenhuma");
    if (
      !registration.email_verificado ||
      (requiresApprovedReport &&
        registration.documento?.status !== "aprovado")
    ) {
      return;
    }
    setError("");
    setApprovingId(registration.id_aluno);
    try {
      const approval = await apiPatchAuthed<{
        id_aluno: number;
        status: string;
      }>(
        `/cadastros/${registration.id_aluno}/aprovar`,
        {},
      );
      if (
        approval.id_aluno !== registration.id_aluno ||
        approval.status !== "ativo"
      ) {
        throw new Error(
          "A API não confirmou a ativação do cadastro. Atualize a lista antes de tentar novamente.",
        );
      }
      setPending((current) =>
        current.filter((item) => item.id_aluno !== registration.id_aluno),
      );
      if (pending.length === 1 && pendingPage > 1) {
        setPendingPage((pageNumber) => pageNumber - 1);
      }
      setTotalPending((current) => Math.max(0, current - 1));
      setPendingRefresh((count) => count + 1);
      setUsersRefresh((count) => count + 1);
      setSuccessMessage("Cadastro aprovado com sucesso.");
      setShowSuccessToast(true);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível aprovar o cadastro.",
      );
    } finally {
      setApprovingId(null);
    }
  }

  async function handleReject(reason: string) {
    if (!rejectingRegistration) return;
    setError("");
    try {
      await apiPatchAuthed(
        `/cadastros/${rejectingRegistration.id_aluno}/rejeitar`,
        { motivo_rejeicao: reason },
      );
      setRejectingRegistration(null);
      setPendingRefresh((count) => count + 1);
      setSuccessMessage("Cadastro rejeitado.");
      setShowSuccessToast(true);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível rejeitar o cadastro.",
      );
    }
  }

  async function handleSaveName(name: string) {
    if (!editingUser) return;
    setError("");
    try {
      await apiPutAuthed(`/usuarios/${editingUser.id_usuario}`, { nome: name });
      setEditingUser(null);
      setSuccessMessage("Usuário atualizado.");
      setShowSuccessToast(true);
      setUsersRefresh((current) => current + 1);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível atualizar o usuário.",
      );
    }
  }

  async function handleDeleteUser() {
    if (!deletingUser) return;
    setError("");
    try {
      await apiDeleteAuthed(`/usuarios/${deletingUser.id_usuario}`);
      setDeletingUser(null);
      setSuccessMessage("Usuário excluído.");
      setShowSuccessToast(true);
      setUsersRefresh((current) => current + 1);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível excluir o usuário.",
      );
    }
  }

  async function handleManageStudentInstructor() {
    if (!managingStudentInstructor) return;
    const user = managingStudentInstructor;
    setError("");
    setManagingInstructorBusy(true);
    try {
      await apiPatchAuthed(`/usuarios/${user.id_usuario}/instrutor`, {});
      setManagingStudentInstructor(null);
      setSuccessMessage(`${user.nome} foi vinculado a você.`);
      setShowSuccessToast(true);
      setUsersRefresh((current) => current + 1);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível atualizar o vínculo do aluno.",
      );
    } finally {
      setManagingInstructorBusy(false);
    }
  }

  async function openMedicalReport(registration: Registration) {
    if (!registration.documento) return;
    setError("");
    try {
      const blob = await apiGetBlob(
        `/cadastros/${registration.id_aluno}/documentos/${registration.documento.id_documento}`,
      );
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível abrir o laudo.",
      );
    }
  }

  return (
    <DashboardGrid>
      <SideMenu />
      <Container isDashboard>
        <DashboardRow variant="sideBySide">
          <h1>{isInstructor ? "Alunos sem instrutor" : "Usuários"}</h1>
          {sessionStorage.getItem("perfil") === "admin" && (
            <ActionButton
              icon={<Plus size={16} />}
              title="Criar usuário"
              onClick={() => navigate("/dashboard/usuarios/criar")}
            />
          )}
        </DashboardRow>

        {location.state?.created && (
          <Toast
            message="criado com sucesso!"
            highlight="Usuário"
            highlightPosition="before"
            icon={<Check />}
            onClose={() => navigate("/dashboard/usuarios", { replace: true, state: null })}
          />
        )}
        {error && <p role="alert">{error}</p>}

        {!isInstructor && (
          <DashboardRow>
            <Input
              type="text"
              id="user"
              name="user"
              placeholder="Nome do usuário"
              leftIcon={<Search />}
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
            {(["Aluno", "Instrutor", "Recepcionista"] as const).map((role) => (
              <InputCheckbox
                key={role}
                labelText={role}
                checked={selectedRoles.includes(role)}
                onChange={() => toggleRole(role)}
              />
            ))}
            {showAdminFilter && (
              <InputCheckbox
                labelText="Administrador"
                checked={selectedRoles.includes("Administrador")}
                onChange={() => toggleRole("Administrador")}
              />
            )}
          </DashboardRow>
        )}

        <div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                {showAdminFilter && <th>CPF</th>}
                {!isInstructor && <th>Perfil</th>}
                <th>Situação</th>
                {!isInstructor && <th>Instrutor Vinculado</th>}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id_usuario}>
                  <td data-label="Nome">{user.nome}</td>
                  {showAdminFilter && (
                    <td data-label="CPF">
                      {user.cpf ? <MaskedCPF cpf={user.cpf} /> : "—"}
                    </td>
                  )}
                  {!isInstructor && (
                    <td data-label="Perfil">{profileLabels[user.perfil]}</td>
                  )}
                  <td data-label="Situação">
                    {user.perfil === "aluno"
                      ? user.status === "ativo"
                        ? "Ativo"
                        : user.status === "pendente"
                          ? "Pendente"
                          : user.status === "rejeitado"
                            ? "Rejeitado"
                            : user.status === "inativo"
                              ? "Inativo"
                              : "—"
                      : "—"}
                  </td>
                  {!isInstructor && (
                    <td data-label="Instrutor Vinculado">
                      {user.perfil === "aluno"
                        ? (user.instrutor_vinculado ?? "N/A")
                        : "N/A"}
                    </td>
                  )}
                  <td data-label="Ações">
                    <div
                      style={{
                        display: "flex",
                        gap: "var(--size-md)",
                        justifyContent: "flex-end",
                      }}
                    >
                      {hasPermission("view_member") && (
                        <Link to={`/dashboard/usuario/${user.id_usuario}`}>
                          <ActionButton
                            variant="view"
                            icon={<RectangleEllipsis size={16} />}
                            title="Ver detalhes"
                          />
                        </Link>
                      )}
                      {hasPermission("edit_member") && !isInstructor && (
                        <ActionButton
                          variant="edit"
                          icon={<Edit2 size={16} />}
                          title="Editar usuário"
                          onClick={() => setEditingUser(user)}
                        />
                      )}
                      {hasPermission("delete_member") && !isInstructor && (
                        <ActionButton
                          variant="delete"
                          icon={<Trash2 size={16} />}
                          title="Excluir usuário"
                          onClick={() => setDeletingUser(user)}
                        />
                      )}
                      {user.perfil === "aluno" &&
                        isInstructor &&
                        user.status === "ativo" &&
                        !user.instrutor_vinculado && (
                          <ActionButton
                            icon={<UserPlus size={16} />}
                            title="Assumir aluno"
                            onClick={() => setManagingStudentInstructor(user)}
                          />
                        )}
                    </div>
                  </td>
                </tr>
              ))}
              {!usersLoading && users.length === 0 && (
                <tr>
                  <td colSpan={isInstructor ? 3 : showAdminFilter ? 6 : 5} style={{ textAlign: "center" }}>
                    {isInstructor
                      ? "Nenhum aluno ativo sem instrutor."
                      : "Nenhum usuário encontrado."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination
            total={totalUsers}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        </div>

        {managingStudentInstructor && (
          <Toast
            message="Deseja assumir este aluno? Os treinos ativos dele serão inativados."
            highlight={managingStudentInstructor.nome}
            duration={999999}
            onClose={() => {
              if (!managingInstructorBusy) setManagingStudentInstructor(null);
            }}
          >
            <Button
              onClick={() => setManagingStudentInstructor(null)}
              disabled={managingInstructorBusy}
            >
              Cancelar
            </Button>
            <ButtonStroke
              onClick={() => void handleManageStudentInstructor()}
              disabled={managingInstructorBusy}
            >
              {managingInstructorBusy
                ? "Salvando..."
                : "Assumir aluno"}
            </ButtonStroke>
          </Toast>
        )}

        {!isInstructor && (
          <>
        <Line />
        <Container style={{ padding: 0 }}>
          <DashboardRow variant="sideBySide">
            <h2>Aprovar Cadastro</h2>
            <ActionButton
              icon={<RefreshCw size={16} />}
              title="Atualizar cadastros pendentes"
              onClick={() => setPendingRefresh((count) => count + 1)}
            />
          </DashboardRow>
          <Input
            type="text"
            id="pending-search"
            name="pending-search"
            placeholder="Nome do usuário"
            leftIcon={<Search />}
            value={pendingSearch}
            onChange={(event) => {
              setPendingSearch(event.target.value);
              setPendingPage(1);
            }}
          />
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                {showAdminFilter && <th>CPF</th>}
                <th>Laudo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pending.map((registration) => (
                <tr key={registration.id_aluno}>
                  <td data-label="Nome">{registration.nome}</td>
                  <td data-label="E-mail">
                    {registration.email_verificado
                      ? "Confirmado"
                      : "Aguardando confirmação"}
                  </td>
                  {showAdminFilter && (
                    <td data-label="CPF">
                      {registration.cpf ? (
                        <MaskedCPF cpf={registration.cpf} />
                      ) : (
                        "—"
                      )}
                    </td>
                  )}
                  <td data-label="Laudo">
                    {registration.documento ? (
                      <button
                        type="button"
                        className={styles.reportLink}
                        onClick={() => void openMedicalReport(registration)}
                      >
                        <FileText size={14} />
                        {registration.documento.nome_arquivo}
                      </button>
                    ) : (
                      "Sem laudo"
                    )}
                  </td>
                  <td data-label="Ações">
                    <div style={{ display: "flex", gap: "var(--size-md)" }}>
                      <ActionButton
                        variant="accept"
                        icon={<Check size={16} />}
                        title={
                          !registration.email_verificado
                            ? "O aluno precisa confirmar o e-mail antes da aprovação"
                            : [...(registration.deficiencia ?? []), ...(registration.restricao_medica ?? [])].some(
                                  (value) => value !== "nenhuma",
                                ) && registration.documento?.status !== "aprovado"
                              ? "O laudo precisa ser aprovado antes do cadastro"
                            : "Aprovar cadastro"
                        }
                        disabled={
                          !registration.email_verificado ||
                          ([...(registration.deficiencia ?? []), ...(registration.restricao_medica ?? [])].some(
                            (value) => value !== "nenhuma",
                          ) &&
                            registration.documento?.status !== "aprovado") ||
                          approvingId !== null
                        }
                        onClick={() => void handleApprove(registration)}
                      />
                      <ActionButton
                        variant="delete"
                        icon={<X size={16} />}
                        title="Rejeitar cadastro"
                        disabled={approvingId !== null}
                        onClick={() => setRejectingRegistration(registration)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {!pendingLoading && pending.length === 0 && (
                <tr>
                  <td colSpan={showAdminFilter ? 5 : 4} style={{ textAlign: "center" }}>
                    Nenhum cadastro pendente.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination
            total={totalPending}
            page={pendingPage}
            pageSize={pendingPageSize}
            onPageChange={setPendingPage}
            onPageSizeChange={(size) => {
              setPendingPageSize(size);
              setPendingPage(1);
            }}
          />
        </Container>
          </>
        )}
      </Container>

      {editingUser && (
        <QuickEditModal
          name={editingUser.nome}
          title="Editar nome"
          onSave={(name) => void handleSaveName(name)}
          onClose={() => setEditingUser(null)}
        />
      )}
      {deletingUser && (
        <Toast
          message={`Você realmente quer deletar ${deletingUser.nome}?`}
          icon={<Trash2 />}
          onClose={() => setDeletingUser(null)}
        >
          <Button style={{ marginTop: 0 }} onClick={() => setDeletingUser(null)}>
            Cancelar
          </Button>
          <ButtonStroke onClick={() => void handleDeleteUser()}>
            Deletar
          </ButtonStroke>
        </Toast>
      )}
      {rejectingRegistration && (
        <QuickEditModal
          name="Informe o motivo"
          title={`Rejeitar ${rejectingRegistration.nome}`}
          onSave={(reason) => void handleReject(reason)}
          onClose={() => setRejectingRegistration(null)}
        />
      )}
      {showSuccessToast && (
        <Toast
          message={successMessage}
          icon={<Check />}
          onClose={() => setShowSuccessToast(false)}
        />
      )}
    </DashboardGrid>
  );
}
