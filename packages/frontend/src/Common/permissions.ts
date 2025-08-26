export type UserRole = "ADMIN" | "MANAGER" | "SYSTEM_ADMIN";

export function hasPermission(
    userRole: UserRole | undefined,
    allowedRoles: UserRole[]
): boolean {
    if (!userRole) return false;
    return allowedRoles.includes(userRole);
}
