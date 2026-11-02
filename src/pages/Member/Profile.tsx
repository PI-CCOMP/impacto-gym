import { useEffect, useRef, useState } from "react";
import { Container } from "../../components/Container";
import { PageHeader } from "../../components/PageHeader";
import { MenuItem } from "../../components/MenuItem";

import styles from "./Profile.module.css";

import { Mail, RectangleEllipsis } from "lucide-react";

import {
  apiGet,
  apiUploadAuthed,
  fotoPerfilPrivada,
  invalidarFotoPerfil,
} from "../../services/api";
import anonymousImg from "../../assets/img/profile/anonymous.png";

type CurrentUser = {
  id_usuario: number;
  foto_url: string | null;
};

export function Profile() {
  const [photo, setPhoto] = useState(anonymousImg);
  const [userId, setUserId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    async function loadProfile() {
      try {
        const user = await apiGet<CurrentUser>("/usuarios/eu");
        if (!active) return;
        setUserId(user.id_usuario);
        if (user.foto_url) {
          const imageUrl = await fotoPerfilPrivada(user.id_usuario);
          if (active) setPhoto(imageUrl);
        }
      } catch (requestError) {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Não foi possível carregar o perfil.",
          );
        }
      }
    }
    void loadProfile();
    return () => {
      active = false;
    };
  }, []);

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    setError("");
    setSaving(true);
    try {
      await apiUploadAuthed("/usuarios/eu/foto", file, "foto");
      invalidarFotoPerfil(userId);
      setPhoto(await fotoPerfilPrivada(userId));
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível atualizar a foto.",
      );
    } finally {
      setSaving(false);
      e.target.value = "";
    }
  }

  return (
    <Container>
      <PageHeader>Modificar Perfil</PageHeader>
      <div className={styles.profile}>
        <img src={photo} alt="Foto de perfil" className={styles.profilePhoto} />
        <button
          className={styles.btnChangePassword}
          onClick={() => inputRef.current?.click()}
          disabled={saving}
        >
          {saving ? "Salvando..." : "Alterar Foto"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          style={{ display: "none" }}
          onChange={handlePhotoChange}
        />
        {error && <p role="alert">{error}</p>}
      </div>
      <MenuItem sectionTitle="E-mail" page="alterar-email">
        <Mail />
        Alterar E-mail
      </MenuItem>
      <MenuItem sectionTitle="Senha" page="alterar-senha">
        <RectangleEllipsis />
        Alterar Senha
      </MenuItem>
    </Container>
  );
}
