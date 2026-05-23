import exerciseAbdominal from "../assets/img/exercise/abdominal.gif";
import exerciseAgachamento from "../assets/img/exercise/agachamento.gif";
import exerciseCrucifixo from "../assets/img/exercise/crucifixo.gif";
import exerciseLegpress from "../assets/img/exercise/legpress.gif";
import exercisePuxada from "../assets/img/exercise/puxada.gif";
import exerciseRemada from "../assets/img/exercise/remada.gif";
import exerciseSupino from "../assets/img/exercise/supino.gif";

import muscleAbdomen from "../assets/img/muscleGroup/abdomen.png";
import muscleAntebracos from "../assets/img/muscleGroup/ante-bracos.png";
import muscleBiceps from "../assets/img/muscleGroup/biceps.png";
import muscleCostas from "../assets/img/muscleGroup/costas.png";
import muscleGluteos from "../assets/img/muscleGroup/gluteos.png";
import muscleOmbros from "../assets/img/muscleGroup/ombros.png";
import musclePanturrilhas from "../assets/img/muscleGroup/panturrilhas.png";
import musclePeitoral from "../assets/img/muscleGroup/peitoral.png";
import musclePernas from "../assets/img/muscleGroup/pernas.png";
import muscleTriceps from "../assets/img/muscleGroup/triceps.png";

import profileAnonymous from "../assets/img/profile/anonymous.png";
import profileAvatar from "../assets/img/profile/avatar.png";

// User
// profilePhoto usa anonymous por padrão; o usuário pode alterar em /perfil

export const mockUser = {
  id: "u1",
  name: "Arthur",
  profilePhoto: profileAnonymous,
};

// Exercises

export type Exercise = {
  id: string;
  exerciseName: string;
  image: string;
  alt: string;
  muscleGroupImage: string;
  muscleGroup: string;
  series: { series: number; kg: number; reps: number }[];
};

export const mockExercises: Exercise[] = [
  {
    id: "1",
    exerciseName: "Supino Reto",
    image: exerciseSupino,
    alt: "Supino Reto",
    muscleGroupImage: musclePeitoral,
    muscleGroup: "Peitoral",
    series: [
      { series: 1, kg: 40, reps: 12 },
      { series: 2, kg: 42, reps: 10 },
      { series: 3, kg: 45, reps: 8 },
    ],
  },
  {
    id: "2",
    exerciseName: "Crucifixo",
    image: exerciseCrucifixo,
    alt: "Crucifixo",
    muscleGroupImage: musclePeitoral,
    muscleGroup: "Peitoral",
    series: [
      { series: 1, kg: 20, reps: 15 },
      { series: 2, kg: 22, reps: 12 },
    ],
  },
  {
    id: "3",
    exerciseName: "Abdominal",
    image: exerciseAbdominal,
    alt: "Abdominal",
    muscleGroupImage: muscleAbdomen,
    muscleGroup: "Abdômen",
    series: [
      { series: 1, kg: 0, reps: 20 },
      { series: 2, kg: 0, reps: 20 },
      { series: 3, kg: 0, reps: 15 },
    ],
  },
  {
    id: "4",
    exerciseName: "Remada",
    image: exerciseRemada,
    alt: "Remada",
    muscleGroupImage: muscleCostas,
    muscleGroup: "Costas",
    series: [
      { series: 1, kg: 50, reps: 10 },
      { series: 2, kg: 55, reps: 8 },
    ],
  },
  {
    id: "5",
    exerciseName: "Puxada",
    image: exercisePuxada,
    alt: "Puxada",
    muscleGroupImage: muscleCostas,
    muscleGroup: "Costas",
    series: [
      { series: 1, kg: 60, reps: 10 },
      { series: 2, kg: 60, reps: 8 },
      { series: 3, kg: 55, reps: 8 },
    ],
  },
  {
    id: "6",
    exerciseName: "Agachamento",
    image: exerciseAgachamento,
    alt: "Agachamento",
    muscleGroupImage: musclePernas,
    muscleGroup: "Pernas",
    series: [
      { series: 1, kg: 80, reps: 10 },
      { series: 2, kg: 85, reps: 8 },
      { series: 3, kg: 90, reps: 6 },
    ],
  },
  {
    id: "7",
    exerciseName: "Leg Press",
    image: exerciseLegpress,
    alt: "Leg Press",
    muscleGroupImage: musclePernas,
    muscleGroup: "Pernas",
    series: [
      { series: 1, kg: 120, reps: 12 },
      { series: 2, kg: 130, reps: 10 },
    ],
  },
];

// Trainings

export type Training = {
  id: string;
  trainingName: string;
  author: string;
  image: string;
  alt: string;
  muscleGroups: string[];
  exercises: Exercise[];
};

export const mockTrainings: Training[] = [
  {
    id: "1",
    trainingName: "Treino A",
    author: "Catarina",
    image: exerciseSupino,
    alt: "Foto do treino A",
    muscleGroups: ["Peitoral", "Abdômen"],
    exercises: [
      mockExercises[0], // Supino Reto
      mockExercises[1], // Crucifixo
      mockExercises[2], // Abdominal
    ],
  },
  {
    id: "2",
    trainingName: "Treino B",
    author: "Catarina",
    image: exerciseRemada,
    alt: "Foto do treino B",
    muscleGroups: ["Costas", "Bíceps"],
    exercises: [
      mockExercises[3], // Remada
      mockExercises[4], // Puxada
    ],
  },
  {
    id: "3",
    trainingName: "Treino C",
    author: "Catarina",
    image: exerciseAgachamento,
    alt: "Foto do treino C",
    muscleGroups: ["Pernas", "Glúteos"],
    exercises: [
      mockExercises[5], // Agachamento
      mockExercises[6], // Leg Press
    ],
  },
];

// Helpers

export function exerciseBelongsToActiveTraining(
  exerciseId: string,
  activeTrainingId: string | undefined,
): boolean {
  if (!activeTrainingId) return false;
  const training = mockTrainings.find((t) => t.id === activeTrainingId);
  return training?.exercises.some((e) => e.id === exerciseId) ?? false;
}

export type HelpRequest = {
  id: string;
  trainingId: string;
  exerciseId: string;
  requestedAt: number;
};

export const mockHelpRequests: HelpRequest[] = [
  {
    id: "hr1",
    trainingId: "1",
    exerciseId: "1",
    requestedAt: new Date("2026-05-13T16:00:00").getTime(),
  },
  {
    id: "hr2",
    trainingId: "1",
    exerciseId: "2",
    requestedAt: new Date("2026-05-13T16:15:00").getTime(),
  },
];

// Alerts

export type Alert = {
  id: string;
  author: string;
  image: string;
  publishedAt: number;
  description: string;
};

export const mockAlerts: Alert[] = [
  {
    id: "1",
    author: "Bassiro",
    image: profileAnonymous,
    publishedAt: new Date("2026-05-13T16:15:00").getTime(),
    description: "Amanhã a academia funcionará até as 14h devido ao feriado.",
  },
  {
    id: "2",
    author: "Luiz",
    image: profileAnonymous,
    publishedAt: new Date("2026-05-15T16:15:00").getTime(),
    description: "Evento: Nova parceria",
  },
];

// History

export type HistoryTraining = {
  id: string;
  trainingName: string;
  author: string;
  image: string;
  alt: string;
  finishedAt: number;
  muscleGroups: string[];
  exercises: Exercise[];
  duration: number;
  totalVolume: number;
};

export const mockHistoryTrainings: HistoryTraining[] = [
  {
    id: "1",
    trainingName: "Treino A",
    author: "Catarina",
    image: exerciseSupino,
    alt: "Foto do treino A",
    finishedAt: new Date("2026-05-07T16:15:00").getTime(),
    muscleGroups: ["Peitoral", "Abdômen"],
    exercises: [
      mockExercises[0], // Supino Reto
      mockExercises[1], // Crucifixo
      mockExercises[2], // Abdominal
    ],
    duration: 3240, // 54 minutos em segundos
    totalVolume: 2450, // kg totais
  },
  {
    id: "2",
    trainingName: "Treino B",
    author: "Catarina",
    image: exerciseRemada,
    alt: "Foto do treino B",
    finishedAt: new Date("2026-05-08T10:15:00").getTime(),
    muscleGroups: ["Costas", "Bíceps"],
    exercises: [
      mockExercises[3], // Remada
      mockExercises[4], // Puxada
    ],
    duration: 3840,
    totalVolume: 2950,
  },
];

// Dashboard Users

export type UserRole =
  | "Aluno"
  | "Instrutor"
  | "Recepcionista"
  | "Administrador";

export type UserRow = {
  id: string;
  name: string;
  cpf: string;
  profile: UserRole;
  image?: string;
  email: string;
  gender: "Masculino" | "Feminino" | "Outro";
  createdAt: number;
  // só para Aluno
  instructor?: string;
  goal?: string;
  experience?: string;
  disability?: string;
  medicalRestriction?: string;
  // treinos vinculados (ids de mockTrainings)
  trainingIds?: string[];
};

export const mockUsers: UserRow[] = [
  {
    id: "u1",
    name: "Rafael Augusto Moreira Silva",
    cpf: "123.456.789-10",
    profile: "Aluno",
    email: "rafael@email.com",
    gender: "Masculino",
    image: profileAvatar,
    createdAt: new Date("2025-01-10").getTime(),
    instructor: "Mateus",
    goal: "Hipertrofia",
    experience: "Intermediário",
    disability: "Nenhuma",
    medicalRestriction: "Nenhuma",
    trainingIds: ["1", "2"],
  },
  {
    id: "u2",
    name: "Camilla Fernandes de Almeida",
    cpf: "123.456.789-10",
    profile: "Aluno",
    email: "camilla@email.com",
    gender: "Feminino",
    createdAt: new Date("2025-02-14").getTime(),
    instructor: "N/A",
    goal: "Emagrecimento",
    experience: "Iniciante",
    disability: "Nenhuma",
    medicalRestriction: "Lordose",
    trainingIds: ["3"],
  },
  {
    id: "u3",
    name: "Isabela Freitas Carvalho Andrade",
    cpf: "123.456.789-10",
    profile: "Aluno",
    email: "isabela@email.com",
    gender: "Feminino",
    createdAt: new Date("2025-03-05").getTime(),
    instructor: "Bassiro",
    goal: "Condicionamento",
    experience: "Avançado",
    disability: "Nenhuma",
    medicalRestriction: "Nenhuma",
    trainingIds: ["1"],
  },
  {
    id: "u4",
    name: "Thiago Henrique Martins Souza",
    cpf: "123.456.789-10",
    profile: "Aluno",
    email: "thiago@email.com",
    gender: "Masculino",
    createdAt: new Date("2025-04-20").getTime(),
    instructor: "N/A",
    goal: "Força",
    experience: "Intermediário",
    disability: "Nenhuma",
    medicalRestriction: "Hérnia de disco",
    trainingIds: ["2"],
  },
  {
    id: "u5",
    name: "Mariana Lopes Ferreira",
    cpf: "123.456.789-10",
    profile: "Aluno",
    email: "mariana@email.com",
    gender: "Feminino",
    createdAt: new Date("2025-05-01").getTime(),
    instructor: "Luiz",
    goal: "Emagrecimento",
    experience: "Iniciante",
    disability: "Nenhuma",
    medicalRestriction: "Nenhuma",
    trainingIds: ["3"],
  },
  {
    id: "u6",
    name: "Lucas Gabrielle de Souza Medeiros",
    cpf: "123.456.789-10",
    profile: "Aluno",
    email: "lucas@email.com",
    gender: "Masculino",
    createdAt: new Date("2025-06-18").getTime(),
    instructor: "Catarina",
    goal: "Hipertrofia",
    experience: "Avançado",
    disability: "Nenhuma",
    medicalRestriction: "Nenhuma",
    trainingIds: ["1", "2", "3"],
  },
  {
    id: "u7",
    name: "Fellipe Antônio da Rocha Mancebo",
    cpf: "123.456.789-10",
    profile: "Aluno",
    email: "fellipe@email.com",
    gender: "Masculino",
    createdAt: new Date("2025-07-22").getTime(),
    instructor: "Eric",
    goal: "Força",
    experience: "Intermediário",
    disability: "Nenhuma",
    medicalRestriction: "Nenhuma",
    trainingIds: ["2"],
  },
  {
    id: "u8",
    name: "Fernanda Castro Aldarques",
    cpf: "123.456.789-10",
    profile: "Aluno",
    email: "fernanda@email.com",
    gender: "Feminino",
    createdAt: new Date("2025-08-09").getTime(),
    instructor: "Catarina",
    goal: "Condicionamento",
    experience: "Iniciante",
    disability: "Nenhuma",
    medicalRestriction: "Nenhuma",
    trainingIds: ["3"],
  },
  {
    id: "u9",
    name: "Bruno Henrique Teixeira Lima",
    cpf: "123.456.789-10",
    profile: "Aluno",
    email: "bruno@email.com",
    gender: "Masculino",
    createdAt: new Date("2025-09-03").getTime(),
    instructor: "Mateus",
    goal: "Hipertrofia",
    experience: "Avançado",
    disability: "Nenhuma",
    medicalRestriction: "Nenhuma",
    trainingIds: ["1", "3"],
  },
  {
    id: "u10",
    name: "Giovana Ramos de Oliveira",
    cpf: "123.456.789-10",
    profile: "Aluno",
    email: "giovana@email.com",
    gender: "Feminino",
    createdAt: new Date("2025-10-11").getTime(),
    instructor: "Luiz",
    goal: "Emagrecimento",
    experience: "Iniciante",
    disability: "Nenhuma",
    medicalRestriction: "Escoliose",
    trainingIds: ["3"],
  },
  {
    id: "u11",
    name: "André Luis Barbosa Cunha",
    cpf: "123.456.789-10",
    profile: "Aluno",
    email: "andre@email.com",
    gender: "Masculino",
    createdAt: new Date("2025-11-02").getTime(),
    instructor: "Bassiro",
    goal: "Força",
    experience: "Intermediário",
    disability: "Nenhuma",
    medicalRestriction: "Nenhuma",
    trainingIds: ["2"],
  },
  {
    id: "u12",
    name: "Patrícia Souza Monteiro",
    cpf: "123.456.789-10",
    profile: "Aluno",
    email: "patricia@email.com",
    gender: "Feminino",
    createdAt: new Date("2025-12-15").getTime(),
    instructor: "Eric",
    goal: "Condicionamento",
    experience: "Avançado",
    disability: "Surdez parcial",
    medicalRestriction: "Nenhuma",
    trainingIds: ["1"],
  },
  // Instrutores
  {
    id: "u13",
    name: "Mateus Carvalho Duarte",
    cpf: "123.456.789-10",
    profile: "Instrutor",
    email: "mateus@email.com",
    gender: "Masculino",
    createdAt: new Date("2024-06-01").getTime(),
  },
  {
    id: "u14",
    name: "Catarina Alves Pereira",
    cpf: "123.456.789-10",
    profile: "Instrutor",
    email: "catarina@email.com",
    gender: "Feminino",
    createdAt: new Date("2024-07-15").getTime(),
  },
  // Recepcionista
  {
    id: "u15",
    name: "Luiz Fernando Gomes",
    cpf: "123.456.789-10",
    profile: "Recepcionista",
    email: "luiz@email.com",
    gender: "Masculino",
    createdAt: new Date("2024-08-20").getTime(),
  },
  // Administrador
  {
    id: "u16",
    name: "Beatriz Oliveira Figueiredo",
    cpf: "123.456.789-10",
    profile: "Administrador",
    email: "beatriz@email.com",
    gender: "Feminino",
    createdAt: new Date("2024-01-01").getTime(),
  },
];

// Logged User + Permissions
//
// Em produção, esses dados vêm do endpoint /me ou /auth/login:
// {
//   id: number,
//   name: string,
//   role: "admin" | "instructor" | "receptionist" | "member",
//   permissions: Permission[]   ← backend controla; frontend só renderiza
// }

export type Permission =
  | "view_member"
  | "edit_member"
  | "delete_member"
  | "edit_workout"
  | "view_financial";

export type LoggedUser = {
  id: number;
  name: string;
  role: "admin" | "instructor" | "receptionist" | "member";
  permissions: Permission[];
};

export const mockLoggedUserAdmin: LoggedUser = {
  id: 1,
  name: "Beatriz Oliveira",
  role: "admin",
  permissions: [
    "view_member",
    "edit_member",
    "delete_member",
    "edit_workout",
    "view_financial",
  ],
};

export const mockLoggedUserInstructor: LoggedUser = {
  id: 2,
  name: "Mateus Carvalho",
  role: "instructor",
  permissions: ["view_member", "edit_member", "edit_workout"],
};

export const mockLoggedUserReceptionist: LoggedUser = {
  id: 3,
  name: "Luiz Fernando",
  role: "receptionist",
  permissions: ["view_member", "edit_member"],
};

/** Troque aqui para testar cada perfil */
export const mockLoggedUser: LoggedUser = mockLoggedUserAdmin;
// export const mockLoggedUser: LoggedUser = mockLoggedUserInstructor;
// export const mockLoggedUser: LoggedUser = mockLoggedUserReceptionist;

// Cadastros Pendentes (Aprovar Cadastro)
//
// Em produção vêm do endpoint GET /registrations?status=pending
// O backend só retorna aqui cadastros com laudo anexado —
// a regra de "só com laudo" é validada no backend.

export type PendingRegistration = {
  id: string;
  name: string;
  cpf: string;
  /** URL do laudo médico para download/visualização */
  medicalReportUrl: string;
  /** Nome de exibição do arquivo */
  medicalReportName: string;
  submittedAt: number;
};

export const mockPendingRegistrations: PendingRegistration[] = [
  {
    id: "pr1",
    name: "Carlos Eduardo Nascimento",
    cpf: "123.456.789-10",
    medicalReportUrl: "/mock-files/laudo-carlos.pdf",
    medicalReportName: "laudo-carlos.pdf",
    submittedAt: new Date("2026-05-08T09:30:00").getTime(),
  },
  {
    id: "pr2",
    name: "Juliana Moraes Ribeiro",
    cpf: "123.456.789-10",
    medicalReportUrl: "/mock-files/laudo-juliana.pdf",
    medicalReportName: "laudo-juliana.pdf",
    submittedAt: new Date("2026-05-08T11:00:00").getTime(),
  },
  {
    id: "pr3",
    name: "Diego Santana Pires",
    cpf: "123.456.789-10",
    medicalReportUrl: "/mock-files/laudo-diego.pdf",
    medicalReportName: "laudo-diego.pdf",
    submittedAt: new Date("2026-05-09T08:15:00").getTime(),
  },
  {
    id: "pr4",
    name: "Aline Torres Vasconcelos",
    cpf: "123.456.789-10",
    medicalReportUrl: "/mock-files/laudo-aline.pdf",
    medicalReportName: "laudo-aline.pdf",
    submittedAt: new Date("2026-05-09T10:45:00").getTime(),
  },
  {
    id: "pr5",
    name: "Renato Fonseca Almeida",
    cpf: "123.456.789-10",
    medicalReportUrl: "/mock-files/laudo-renato.pdf",
    medicalReportName: "laudo-renato.pdf",
    submittedAt: new Date("2026-05-09T14:00:00").getTime(),
  },
];
