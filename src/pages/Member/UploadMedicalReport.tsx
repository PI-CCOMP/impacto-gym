import { useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "../../components/Container";
import { PageHeader } from "../../components/PageHeader";
import { Logo } from "../../components/Logo";
import { FormHeader } from "../../components/FormHeader";
import { Input } from "../../components/Input/input";
import { Button } from "../../components/Button";
import { apiPost, apiPostPdf } from "../../services/api";

type UploadTokenResponse = {
  cadastro_token: string;
  id_aluno: number;
};

export function UploadMedicalReport() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!file) {
      setError("Selecione o arquivo PDF do laudo.");
      return;
    }

    setSubmitting(true);
    try {
      const upload = await apiPost<UploadTokenResponse>(
        "/auth/email/solicitar-upload-laudo",
        { email, senha: password },
      );
      await apiPostPdf(
        `/cadastros/${upload.id_aluno}/documento`,
        upload.cadastro_token,
        file,
      );
      setSuccess(true);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível enviar o laudo.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container>
      <PageHeader>Enviar laudo</PageHeader>
      <Logo />
      <FormHeader subtitle="O envio pode ser feito mesmo depois do prazo informado">
        Complete seu cadastro
      </FormHeader>
      {success ? (
        <p role="status">
          Laudo enviado para análise. Seu acesso continua pendente até a
          aprovação da academia.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <Input
            labelText="E-mail da conta"
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
          />
          <Input
            labelText="Senha"
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />
          <label htmlFor="medical-report">Laudo em PDF</label>
          <input
            id="medical-report"
            type="file"
            accept="application/pdf,.pdf"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
          {error && <p role="alert">{error}</p>}
          <Button type="submit" disabled={submitting}>
            {submitting ? "Enviando..." : "Enviar laudo"}
          </Button>
        </form>
      )}
      <Link to="/login">Voltar ao login</Link>
    </Container>
  );
}
