import { useNavigate, useLocation } from "react-router-dom";

import { Container } from "../../components/Container";
import { PageHeader } from "../../components/PageHeader";
import { MenuItem } from "../../components/MenuItem";
import { Toast } from "../../components/Toast";

import { User, HelpCircle } from "lucide-react";
import { apiPostAuthed, encerrarSessaoLocal } from "../../services/api";
import { useState } from "react";

import styles from "./Settings.module.css";

type LocationState = {
  showSuccessToast?: boolean;
  toastMessage?: string;
};

export function Settings() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const showToast = state?.showSuccessToast ?? false;
  const toastMessage = state?.toastMessage ?? "Alteração realizada com sucesso!";
  const [logoutError, setLogoutError] = useState("");

  async function handleLogout() {
    setLogoutError("");
    try {
      await apiPostAuthed("/auth/logout", {});
      encerrarSessaoLocal();
      navigate("/login", { replace: true });
    } catch (error) {
      setLogoutError(
        error instanceof Error
          ? error.message
          : "Não foi possível encerrar a sessão.",
      );
    }
  }

  return (
    <Container>
      {showToast && (
        <Toast
          message={toastMessage}
          duration={2000}
          onClose={() =>
            navigate("/configuracoes", { replace: true, state: null })
          }
        />
      )}

      <PageHeader>Configurações</PageHeader>
      {logoutError && <p role="alert">{logoutError}</p>}
      <div className={styles.content}>
        <MenuItem sectionTitle="Conta" page="perfil">
          <User />
          Perfil
        </MenuItem>
        <MenuItem sectionTitle="Ajuda" page="faq">
          <HelpCircle />
          Perguntas Frequentes
        </MenuItem>
        <button className={styles.logout} onClick={() => void handleLogout()}>
          Sair
        </button>
      </div>
    </Container>
  );
}
