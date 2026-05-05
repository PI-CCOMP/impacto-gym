import { useParams, useNavigate } from "react-router-dom";

import { Container } from "../../components/Container";
import { PageHeader } from "../../components/PageHeader";
import { Accordion } from "../../components/Accordion";
import { Dumbbell, HeartPulse, Clock, Droplet } from "lucide-react";
import { ButtonStroke } from "../../components/ButtonStroke";
import styles from "./Exercise.module.css";

import supinoImg from "../../assets/img/supino-reto.jpg";
import peitoImg from "../../assets/img/peito.png";

const tips = [
  { icon: <Dumbbell />, text: "Mantenha o peito estufado e a coluna reta!" },
  { icon: <HeartPulse />, text: "Controle a respiração." },
  { icon: <Clock />, text: "Descanse de 1 a 2 minutos!" },
  { icon: <Droplet />, text: "Não esqueça de se hidratar!" },
];

const mockExercises = [
  { id: "1", name: "Supino Reto", image: supinoImg },
  { id: "2", name: "Crucifixo", image: supinoImg },
  { id: "3", name: "Abdominal", image: supinoImg },
  { id: "4", name: "Remada", image: supinoImg },
  { id: "5", name: "Puxada", image: supinoImg },
  { id: "6", name: "Agachamento", image: supinoImg },
  { id: "7", name: "Leg Press", image: supinoImg },
];

export function Exercise() {
  const { idExercicio } = useParams();
  const navigate = useNavigate();

  const exercise = mockExercises.find((e) => e.id === idExercicio);

  if (!exercise) {
    navigate(-1);
    return null;
  }

  return (
    <Container>
      <PageHeader>{exercise.name}</PageHeader>
      <img src={exercise.image} alt={exercise.name} className={styles.image} />
      <h2>{exercise.name}</h2>
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
            src={peitoImg}
            alt={exercise.name}
            className={styles.imageGroupMuscle}
          />
        </ul>
      </Accordion>
      <ButtonStroke>Preciso de Ajuda</ButtonStroke>{" "}
      {/* ir para pagina de pedir ajuda ao clicar, depois nessa pagina de ajuda se clicar no bptap azul chamar instrutor ja puxa automaticamnte o exercicio e qm precisa de ajuda e sobe toast informando, qnd fecha joga pro treino e aparece em Training.tsx o icone de ajuda q ao clicar nele leva para pagina com a fila de solicitacoes de auxilio q o usuario fex */}
    </Container>
  );
}
