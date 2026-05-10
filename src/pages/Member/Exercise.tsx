import { useParams, useNavigate, Link } from "react-router-dom";

import { getActiveTraining } from "../../utils/activeTraining";
import {
  mockExercises,
  exerciseBelongsToActiveTraining,
} from "../../mocks/mockData";

import { Container } from "../../components/Container";
import { PageHeader } from "../../components/PageHeader";
import { Accordion } from "../../components/Accordion";
import { ButtonStroke } from "../../components/ButtonStroke";
import { Dumbbell, HeartPulse, Clock, Droplet } from "lucide-react";
import styles from "./Exercise.module.css";

const tips = [
  { icon: <Dumbbell />, text: "Mantenha o peito estufado e a coluna reta!" },
  { icon: <HeartPulse />, text: "Controle a respiração." },
  { icon: <Clock />, text: "Descanse de 1 a 2 minutos!" },
  { icon: <Droplet />, text: "Não esqueça de se hidratar!" },
];

export function Exercise() {
  const { idExercicio } = useParams();
  const navigate = useNavigate();

  const exercise = mockExercises.find((e) => e.id === idExercicio);
  const activeTraining = getActiveTraining();
  const canAskForHelp = exerciseBelongsToActiveTraining(
    idExercicio ?? "",
    activeTraining?.id,
  );

  if (!exercise) {
    navigate(-1);
    return null;
  }

  return (
    <Container>
      <PageHeader>{exercise.exerciseName}</PageHeader>
      <img src={exercise.image} alt={exercise.alt} className={styles.image} />
      {/* depois trocar por vídeo */}
      <h2>{exercise.exerciseName}</h2>
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
            src={exercise.muscleGroupImage}
            alt={exercise.exerciseName}
            className={styles.imageGroupMuscle}
          />
          {/* depois colocar cada imagem de acordo com o seu grupo */}
        </ul>
      </Accordion>
      {canAskForHelp ? (
        <Link to="/ajuda" state={{ exerciseName: exercise.exerciseName }}>
          <ButtonStroke>Preciso de Ajuda</ButtonStroke>
        </Link>
      ) : (
        <ButtonStroke disabled>Preciso de Ajuda</ButtonStroke>
      )}
    </Container>
  );
}
