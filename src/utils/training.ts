export function normalizeMuscleGroups(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter(
      (group): group is string => typeof group === "string",
    );
  }
  if (typeof value !== "string" || !value.trim()) return [];

  const groups = value.trim();
  if (groups.startsWith("[") && groups.endsWith("]")) {
    try {
      const parsed: unknown = JSON.parse(groups);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (group): group is string => typeof group === "string",
        );
      }
    } catch {
      return [groups];
    }
  }
  if (groups.startsWith("{") && groups.endsWith("}")) {
    return groups
      .slice(1, -1)
      .split(",")
      .map((group) => group.trim().replace(/^"(.*)"$/, "$1"))
      .filter(Boolean);
  }
  return [groups];
}
