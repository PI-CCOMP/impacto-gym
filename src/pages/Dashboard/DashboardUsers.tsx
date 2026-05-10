import { useState } from "react";
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

import {
  mockUsers,
  mockLoggedUser,
  mockPendingRegistrations,
  type UserRole,
  type PendingRegistration,
} from "../../mocks/mockData";

import { hasPermission } from "../../utils/permissions";

import styles from "./DashboardUsers.module.css";

export function DashboardUsers() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);
  const navigate = useNavigate();

  const location = useLocation();
  const [showCreatedToast, setShowCreatedToast] = useState(
    location.state?.created === true,
  );

  function toggleRole(role: UserRole) {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
    setPage(1);
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setPage(1);
  }

  const filtered = mockUsers.filter((user) => {
    const matchesSearch = user.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesRole =
      selectedRoles.length === 0 || selectedRoles.includes(user.profile);
    return matchesSearch && matchesRole;
  });

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const [pendingPage, setPendingPage] = useState(1);
  const [pendingPageSize, setPendingPageSize] = useState(10);
  const [pendingSearch, setPendingSearch] = useState("");

  // lista local — em produção virá do servidor; aqui simulamos approve/reject removendo do array
  const [pending, setPending] = useState<PendingRegistration[]>(
    mockPendingRegistrations,
  );

  function handlePendingSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setPendingSearch(e.target.value);
    setPendingPage(1);
  }

  function handleApprove(id: string) {
    setPending((prev) => prev.filter((p) => p.id !== id));
  }

  function handleReject(id: string) {
    setPending((prev) => prev.filter((p) => p.id !== id));
  }

  const filteredPending = pending.filter((p) =>
    p.name.toLowerCase().includes(pendingSearch.toLowerCase()),
  );

  const paginatedPending = filteredPending.slice(
    (pendingPage - 1) * pendingPageSize,
    pendingPage * pendingPageSize,
  );

  const [editingUser, setEditingUser] = useState<{
    id: string;
    name: string;
  } | null>(null);

  function handleSaveName(newName: string) {
    // Em produção: await api.patch(`/users/${editingUser.id}`, { name: newName })
    console.log("Salvar:", editingUser?.id, newName);
    navigate("/dashboard/usuarios", { state: { created: true } });
  }

  const [deletingUser, setDeletingUser] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  function handleConfirmDelete() {
    // Em produção: await api.delete(`/users/${deletingUser.id}`)
    setDeletingUser(null);
    setShowSuccessToast(true);
  }

  return (
    <DashboardGrid>
      <SideMenu />
      <Container isDashboard>
        <DashboardRow variant="sideBySide">
          <h1>Usuários</h1>
          <ActionButton
            icon={<Plus size={16} />}
            title="Criar usuário"
            onClick={() => navigate("/dashboard/usuarios/criar")}
          />
        </DashboardRow>

        <DashboardRow>
          <Input
            type="text"
            id="user"
            name="user"
            placeholder="Nome do usuário"
            leftIcon={<Search />}
            value={search}
            onChange={handleSearch}
          />
          <InputCheckbox
            labelText="Aluno"
            checked={selectedRoles.includes("Aluno")}
            onChange={() => toggleRole("Aluno")}
          />
          <InputCheckbox
            labelText="Instrutor"
            checked={selectedRoles.includes("Instrutor")}
            onChange={() => toggleRole("Instrutor")}
          />
          <InputCheckbox
            labelText="Recepcionista"
            checked={selectedRoles.includes("Recepcionista")}
            onChange={() => toggleRole("Recepcionista")}
          />
          {mockLoggedUser.role === "admin" && (
            <InputCheckbox
              labelText="Administrador"
              checked={selectedRoles.includes("Administrador")}
              onChange={() => toggleRole("Administrador")}
            />
          )}
        </DashboardRow>

        <div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Perfil</th>
                <th>Instrutor Vinculado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((user) => (
                <tr key={user.id}>
                  <td data-label="Nome">{user.name}</td>
                  <td data-label="CPF">{user.cpf}</td>
                  <td data-label="Perfil">{user.profile}</td>
                  <td data-label="Instrutor Vinculado">
                    {user.profile === "Aluno"
                      ? (user.instructor ?? "N/A")
                      : "N/A"}
                  </td>
                  <td data-label="Ações">
                    <div
                      style={{
                        display: "flex",
                        gap: "var(--size-md)",
                        justifyContent: "flex-end",
                      }}
                    >
                      {hasPermission("view_member") && (
                        <Link to={`/dashboard/usuario/${user.id}`}>
                          <ActionButton
                            variant="view"
                            icon={<RectangleEllipsis size={16} />}
                            title="Ver detalhes"
                          />
                        </Link>
                      )}
                      {hasPermission("edit_member") && (
                        <ActionButton
                          variant="edit"
                          icon={<Edit2 size={16} />}
                          title="Editar usuário"
                          onClick={() =>
                            setEditingUser({ id: user.id, name: user.name })
                          }
                        />
                      )}
                      {hasPermission("delete_member") && (
                        <ActionButton
                          variant="delete"
                          icon={<Trash2 size={16} />}
                          title="Excluir usuário"
                          onClick={() =>
                            setDeletingUser({ id: user.id, name: user.name })
                          }
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {paginated.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    style={{ textAlign: "center", padding: "var(--size-xl)" }}
                  >
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <Pagination
            total={filtered.length}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        </div>

        <Line />

        <Container style={{ padding: "0" }}>
          <h2>Aprovar Cadastro</h2>

          <Input
            type="text"
            id="pending-search"
            name="pending-search"
            placeholder="Nome do usuário"
            leftIcon={<Search />}
            value={pendingSearch}
            onChange={handlePendingSearch}
          />

          <div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>Laudo</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {paginatedPending.map((reg) => (
                  <tr key={reg.id}>
                    <td data-label="Nome">{reg.name}</td>
                    <td data-label="CPF">{reg.cpf}</td>
                    <td data-label="Laudo">
                      <a
                        href={reg.medicalReportUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={reg.medicalReportName}
                        className={styles.reportLink}
                      >
                        <FileText size={14} />
                        {reg.medicalReportName}
                      </a>
                    </td>
                    <td data-label="Ações">
                      <div
                        style={{
                          display: "flex",
                          gap: "var(--size-md)",
                          justifyContent: "flex-end",
                        }}
                      >
                        <ActionButton
                          variant="accept"
                          icon={<Check size={16} />}
                          title="Aprovar cadastro"
                          onClick={() => handleApprove(reg.id)}
                        />
                        <ActionButton
                          variant="delete"
                          icon={<X size={16} />}
                          title="Rejeitar cadastro"
                          onClick={() => handleReject(reg.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}

                {paginatedPending.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      style={{ textAlign: "center", padding: "var(--size-xl)" }}
                    >
                      Nenhum cadastro pendente.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <Pagination
              total={filteredPending.length}
              page={pendingPage}
              pageSize={pendingPageSize}
              onPageChange={setPendingPage}
              onPageSizeChange={(size) => {
                setPendingPageSize(size);
                setPendingPage(1);
              }}
            />
          </div>
        </Container>
      </Container>
      {editingUser && (
        <QuickEditModal
          name={editingUser.name}
          onSave={handleSaveName}
          onClose={() => setEditingUser(null)}
        />
      )}

      {deletingUser && (
        <Toast
          message={`Você realmente quer deletar ${deletingUser.name}?`}
          icon={<Trash2 />}
          onClose={() => setDeletingUser(null)}
        >
          <Button
            style={{ marginTop: 0 }}
            onClick={() => setDeletingUser(null)}
          >
            Cancelar
          </Button>
          <ButtonStroke onClick={handleConfirmDelete}>Deletar</ButtonStroke>
        </Toast>
      )}

      {showCreatedToast && (
        <Toast
          message="criado com sucesso!"
          highlight="Usuário"
          highlightPosition="before"
          icon={<Check />}
          onClose={() => setShowCreatedToast(false)}
        />
      )}

      {showSuccessToast && (
        <Toast
          message="excluído com sucesso!"
          highlight="Usuário"
          highlightPosition="before"
          icon={<Check />}
          onClose={() => setShowSuccessToast(false)}
        />
      )}
    </DashboardGrid>
  );
}
