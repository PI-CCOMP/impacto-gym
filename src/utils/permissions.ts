import { getPerfil } from "../services/api";

export type Permission =
  | "view_member"
  | "edit_member"
  | "delete_member"
  | "edit_workout"
  | "view_financial";

function isAdmin() {
  return getPerfil() === "admin";
}

function isInstructor() {
  return getPerfil() === "instrutor";
}

function isReceptionist() {
  return getPerfil() === "recepcionista";
}

export function hasPermission(permission: Permission): boolean {
  switch (permission) {
    case "view_member":
      return isAdmin() || isInstructor() || isReceptionist();
    case "edit_member":
    case "delete_member":
      return isAdmin();
    case "edit_workout":
      return isAdmin() || isInstructor();
    case "view_financial":
      return isAdmin();
  }
}

export const can = {
  get editTraining() {
    return isAdmin() || isInstructor();
  },
  get editUser() {
    return isAdmin();
  },
  get manageAlerts() {
    return isAdmin() || isReceptionist();
  },
  get viewTrainings() {
    return isAdmin() || isInstructor();
  },
  get unlinkTraining() {
    return isAdmin() || isInstructor();
  },
};
