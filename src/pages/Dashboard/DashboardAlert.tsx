import { useEffect, useState } from "react";
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

import {
  apiDeleteAuthed,
  apiGet,
  apiPostAuthed,
  apiPutAuthed,
  fotoPerfilPrivadaPorUrl,
} from "../../services/api";
import { formatDate } from "../../utils/formatDate";
import { can } from "../../utils/permissions";
import anonymousImg from "../../assets/img/profile/anonymous.png";

type Notice = {
  id_aviso: number;
  titulo: string;
  mensagem: string;
  publicado_em: string;
  autor: { nome: string; foto_url: string | null };
  autorFoto: string;
};

export function DashboardAlert() {
  const [alerts, setAlerts] = useState<Notice[]>([]);
  const [editingAlert, setEditingAlert] = useState<Notice | null>(null);
  const [deletingAlert, setDeletingAlert] = useState<Notice | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    void loadAlerts(active);
    return () => {
      active = false;
    };
  }, []);

  async function loadAlerts(active = true) {
    try {
      const result = await apiGet<{ dados: Omit<Notice, "autorFoto">[] }>(
        "/avisos/dashboard",
      );
      let photoFailed = false;
      const notices = await Promise.all(
        result.dados.map(async (notice) => {
          try {
            return {
              ...notice,
              autorFoto:
                (await fotoPerfilPrivadaPorUrl(notice.autor.foto_url)) ??
                anonymousImg,
            };
          } catch {
            photoFailed = true;
            return { ...notice, autorFoto: anonymousImg };
          }
        }),
      );
      if (active) {
        setAlerts(notices);
        setError(
          photoFailed
            ? "Não foi possível carregar uma ou mais fotos dos autores."
            : "",
        );
      }
    } catch (requestError: unknown) {
      if (active) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Não foi possível carregar os avisos.",
        );
      }
    }
  }

  async function handleCreate(title: string, message?: string) {
    if (!message) return;
    setError("");
    try {
      await apiPostAuthed("/avisos", { titulo: title, mensagem: message });
      await loadAlerts();
      setSuccessMessage("Aviso criado com sucesso!");
      setShowSuccessToast(true);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível criar o aviso.",
      );
    }
  }

  async function handleEdit(title: string, message?: string) {
    if (!editingAlert || !message) return;
    setError("");
    try {
      await apiPutAuthed(`/avisos/${editingAlert.id_aviso}`, {
        titulo: title,
        mensagem: message,
      });
      await loadAlerts();
      setEditingAlert(null);
      setSuccessMessage("Aviso editado com sucesso!");
      setShowSuccessToast(true);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível editar o aviso.",
      );
    }
  }

  async function handleConfirmDelete() {
    if (!deletingAlert) return;
    setError("");
    try {
      await apiDeleteAuthed(`/avisos/${deletingAlert.id_aviso}`);
      setAlerts((previous) =>
        previous.filter((notice) => notice.id_aviso !== deletingAlert.id_aviso),
      );
      setDeletingAlert(null);
      setSuccessMessage("Aviso excluído com sucesso!");
      setShowSuccessToast(true);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível excluir o aviso.",
      );
    }
  }

  return (
    <DashboardGrid>
      <SideMenu />
      <Container isDashboard>
        <DashboardRow variant="sideBySide">
          <h1>Avisos</h1>
          {can.manageAlerts && (
            <ActionButton
              variant="accept"
              icon={<Plus size={16} />}
              title="Criar aviso"
              onClick={() => setShowCreateModal(true)}
            />
          )}
        </DashboardRow>

        {error && <p role="alert">{error}</p>}
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
              key={alert.id_aviso}
              id={String(alert.id_aviso)}
              image={alert.autorFoto}
              author={alert.autor.nome}
              date={formatDate(new Date(alert.publicado_em).getTime())}
              title={alert.titulo}
              description={alert.mensagem}
              onEdit={
                can.manageAlerts ? () => setEditingAlert(alert) : undefined
              }
              onDelete={
                can.manageAlerts ? () => setDeletingAlert(alert) : undefined
              }
            />
          ))}
        </div>

        {showCreateModal && (
          <QuickEditModal
            name=""
            description=""
            descriptionLabel="Mensagem"
            title="Criar Aviso"
            onSave={(title, message) => void handleCreate(title, message)}
            onClose={() => setShowCreateModal(false)}
          />
        )}

        {editingAlert && (
          <QuickEditModal
            name={editingAlert.titulo}
            description={editingAlert.mensagem}
            descriptionLabel="Mensagem"
            title="Editar Aviso"
            onSave={(title, message) => void handleEdit(title, message)}
            onClose={() => setEditingAlert(null)}
          />
        )}

        {deletingAlert && (
          <Toast
            message="Você realmente quer deletar este aviso?"
            icon={<Trash2 />}
            onClose={() => setDeletingAlert(null)}
          >
            <Button
              style={{ marginTop: 0 }}
              onClick={() => setDeletingAlert(null)}
            >
              Cancelar
            </Button>
            <ButtonStroke onClick={() => void handleConfirmDelete()}>
              Deletar
            </ButtonStroke>
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
