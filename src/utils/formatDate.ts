// Formato simples: "10/05/2026" — usado em DashboardUser, DashboardAlert
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("pt-BR");
}

// Formato com hora: "10/05/2026 às 14:30" — usado em Member/Alert
export function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp);
  return (
    date.toLocaleDateString("pt-BR") +
    " às " +
    date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  );
}

// Formato histórico: "sex - 10 de mai" — usado em History, HistoryDetail
export function formatDateWeekday(timestamp: number): string {
  const date = new Date(timestamp);
  const weekday = date.toLocaleDateString("pt-BR", { weekday: "short" });
  const day = date.getDate();
  const month = date.toLocaleDateString("pt-BR", { month: "short" });
  return `${weekday} - ${day} de ${month}`;
}

// Formato completo: "Qua - 13 de mai 2026 - 16:00h" — usado em HelpRequestCard
export function formatDateFull(timestamp: number): string {
  const date = new Date(timestamp);
  const weekday = date.toLocaleDateString("pt-BR", { weekday: "short" });
  const day = date.getDate();
  const month = date.toLocaleDateString("pt-BR", { month: "short" });
  const year = date.getFullYear();
  const time = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${weekday} - ${day} de ${month} ${year} - ${time}h`;
}
