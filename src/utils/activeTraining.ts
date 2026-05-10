const KEY = "activeTraining";

type CheckedSerie = {
  exerciseIndex: number;
  serieIndex: number;
  kg: number;
};

type ActiveTraining = {
  id: string;
  trainingName: string;
  isActive: boolean;
  startedAt: number; // timestamp ms
  checkedSeries: CheckedSerie[];
  totalVolume: number;
};

export function getActiveTraining(): ActiveTraining | null {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setActiveTraining(data: ActiveTraining) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function clearActiveTraining() {
  localStorage.removeItem(KEY);
}
