import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  apiGet,
  midiaExercicioPrivadaPorUrl,
} from "../../services/api";

import { Container } from "../../components/Container";
import { PageHeader } from "../../components/PageHeader";
import { Accordion } from "../../components/Accordion";
import { ButtonStroke } from "../../components/ButtonStroke";
import { Dumbbell, HeartPulse, Clock, Droplet } from "lucide-react";
import styles from "./Exercise.module.css";
import musclePeitoral from "../../assets/img/muscleGroup/peitoral.png";

type ExerciseDetail = {
  id_exercicio: number;
  nome: string;
  foto_url: string | null;
  video_url: string | null;
  imagem_ativacao_muscular_url: string | null;
  grupo_muscular: string;
};

type ExerciseLocationState = {
  exerciseName?: string;
  idAlunoTreinoExercicio?: number;
};

const tips = [
  { icon: <Dumbbell />, text: "Mantenha o peito estufado e a coluna reta!" },
  { icon: <HeartPulse />, text: "Controle a respiração." },
  { icon: <Clock />, text: "Descanse de 1 a 2 minutos!" },
  { icon: <Droplet />, text: "Não esqueça de se hidratar!" },
];

export function Exercise() {
  const { idExercicio } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ExerciseLocationState | null;
  const [exercise, setExercise] = useState<ExerciseDetail | null>(null);
  const [exerciseMedia, setExerciseMedia] = useState<{
    foto: string | null;
    video: string | null;
    ativacao: string | null;
  }>({ foto: null, video: null, ativacao: null });
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiGet<ExerciseDetail>(`/exercicios/${idExercicio}`)
      .then((result) => {
        if (active) setExercise(result);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Não foi possível carregar o exercício.",
          );
        }
      });
    return () => {
      active = false;
    };
  }, [idExercicio]);

  useEffect(() => {
    if (!exercise) return;
    let active = true;
    Promise.all([
      midiaExercicioPrivadaPorUrl(exercise.foto_url),
      midiaExercicioPrivadaPorUrl(exercise.video_url),
      midiaExercicioPrivadaPorUrl(exercise.imagem_ativacao_muscular_url),
    ])
      .then(([foto, video, ativacao]) => {
        if (active) setExerciseMedia({ foto, video, ativacao });
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Não foi possível carregar as mídias do exercício.",
          );
        }
      });
    return () => {
      active = false;
    };
  }, [exercise]);

  if (!exercise) {
    return (
      <Container>
        <PageHeader onBack={() => navigate(-1)}>Exercício</PageHeader>
        {error ? <p role="alert">{error}</p> : <p>Carregando exercício...</p>}
      </Container>
    );
  }

  const canAskForHelp = Boolean(state?.idAlunoTreinoExercicio);
  const isGif =
    !!exerciseMedia.video &&
    new URL(exerciseMedia.video, window.location.href).pathname
      .toLowerCase()
      .endsWith(".gif");

  return (
    <Container>
      <PageHeader onBack={() => navigate(-1)}>{exercise.nome}</PageHeader>
      {exerciseMedia.video && isGif ? (
        <img
          src={exerciseMedia.video}
          alt={exercise.nome}
          className={styles.image}
        />
      ) : exerciseMedia.video ? (
        <video
          src={exerciseMedia.video}
          controls
          className={styles.image}
          aria-label={exercise.nome}
        />
      ) : (
        exerciseMedia.foto && (
          <img
            src={exerciseMedia.foto}
            alt={exercise.nome}
            className={styles.image}
          />
        )
      )}
      <h2>{exercise.nome}</h2>
      <Accordion title="Dicas" transparent>
        <ul className={styles.tipsList}>
          {tips.map((tip, index) => (
            <li key={index} className={styles.tipItem}>
              <span className={styles.tipIcon}>{tip.icon}</span>
              <span>{tip.text}</span>
            </li>
          ))}
        </ul>
      </Accordion>
      <Accordion title="Ativação Muscular" transparent>
        <ul className={styles.tipsList}>
          <img
            src={exerciseMedia.ativacao ?? musclePeitoral}
            alt={exercise.grupo_muscular}
            className={styles.imageGroupMuscle}
          />
        </ul>
      </Accordion>
      {canAskForHelp ? (
        <Link
          to="/ajuda"
          state={{
            exerciseName: exercise.nome,
            idAlunoTreinoExercicio: state?.idAlunoTreinoExercicio,
          }}
        >
          <ButtonStroke>Preciso de Ajuda</ButtonStroke>
        </Link>
      ) : (
        <ButtonStroke disabled>Preciso de Ajuda</ButtonStroke>
      )}
    </Container>
  );
}
