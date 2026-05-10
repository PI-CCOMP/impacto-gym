import { useState } from "react";
import { Plus, Trash2, Check } from "lucide-react";

import { DashboardGrid } from "../../components/DashboardGrid";
import { SideMenu } from "../../components/SideMenu";
import { Container } from "../../components/Container";
import { DashboardRow } from "../../components/DashboardRow";
import { ActionButton } from "../../components/ActionButton";
import { AlertCard } from "../../components/AlertCard";
import { QuickEditModal } from "../../components/QuickEditModal";
import { Toast } from "../../components/Toast";
import { Button } from "../../components/Button";
import { ButtonStroke } from "../../components/ButtonStroke";

import { mockAlerts, mockLoggedUser, type Alert } from "../../mocks/mockData";

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("pt-BR");
}

export function DashboardAlert() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);
  const [deletingAlert, setDeletingAlert] = useState<Alert | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const canManage =
    mockLoggedUser.role === "admin" ||
    mockLoggedUser.role === "instructor" ||
    mockLoggedUser.role === "receptionist";

  function handleCreate(description: string) {
    const newAlert: Alert = {
      id: `alert-${Date.now()}`,
      author: mockLoggedUser.name,
      image: "", // em produção viria do perfil do usuário logado
      publishedAt: Date.now(),
      description,
    };
    setAlerts((prev) => [newAlert, ...prev]);
    setSuccessMessage("Aviso criado com sucesso!");
    setShowSuccessToast(true);
  }

  function handleEdit(description: string) {
    if (!editingAlert) return;
    setAlerts((prev) =>
      prev.map((a) => (a.id === editingAlert.id ? { ...a, description } : a)),
    );
    setSuccessMessage("Aviso editado com sucesso!");
    setShowSuccessToast(true);
  }

  function handleConfirmDelete() {
    if (!deletingAlert) return;
    setAlerts((prev) => prev.filter((a) => a.id !== deletingAlert.id));
    setDeletingAlert(null);
    setSuccessMessage("Aviso excluído com sucesso!");
    setShowSuccessToast(true);
  }

  return (
    <DashboardGrid>
      <SideMenu />
      <Container>
        <DashboardRow variant="sideBySide">
          <h1>Avisos</h1>
          {canManage && (
            <ActionButton
              variant="accept"
              icon={<Plus size={16} />}
              title="Criar aviso"
              onClick={() => setShowCreateModal(true)}
            />
          )}
        </DashboardRow>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--size-md)",
          }}
        >
          {alerts.length === 0 && <p>Nenhum aviso cadastrado.</p>}
          {alerts.map((alert) => (
            <AlertCard
              key={alert.id}
              id={alert.id}
              image={alert.image}
              author={alert.author}
              date={formatDate(alert.publishedAt)}
              description={alert.description}
              onEdit={canManage ? () => setEditingAlert(alert) : undefined}
              onDelete={canManage ? () => setDeletingAlert(alert) : undefined}
            />
          ))}
        </div>

        {showCreateModal && (
          <QuickEditModal
            name=""
            title="Criar Aviso"
            onSave={(description) => {
              handleCreate(description);
              setShowCreateModal(false);
            }}
            onClose={() => setShowCreateModal(false)}
          />
        )}

        {editingAlert && (
          <QuickEditModal
            name={editingAlert.description}
            onSave={(description) => {
              handleEdit(description);
              setEditingAlert(null);
            }}
            onClose={() => setEditingAlert(null)}
          />
        )}

        {deletingAlert && (
          <Toast
            message={`Você realmente quer deletar este aviso?`}
            icon={<Trash2 />}
            onClose={() => setDeletingAlert(null)}
          >
            <Button
              style={{ marginTop: 0 }}
              onClick={() => setDeletingAlert(null)}
            >
              Cancelar
            </Button>
            <ButtonStroke onClick={handleConfirmDelete}>Deletar</ButtonStroke>
          </Toast>
        )}

        {showSuccessToast && (
          <Toast
            message={successMessage}
            icon={<Check />}
            onClose={() => setShowSuccessToast(false)}
          />
        )}
      </Container>
    </DashboardGrid>
  );
}
