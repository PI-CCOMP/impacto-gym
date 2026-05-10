import { mockLoggedUser, type Permission } from "../mocks/mockData";

export function hasPermission(permission: Permission): boolean {
  return mockLoggedUser.permissions.includes(permission);
}

export const role = mockLoggedUser.role;

export const can = {
  editTraining: role === "admin" || role === "instructor",
  editUser: role === "admin",
  manageAlerts:
    role === "admin" || role === "instructor" || role === "receptionist",
  viewTrainings: role !== "receptionist",
  unlinkTraining: role === "admin" || role === "instructor",
};
