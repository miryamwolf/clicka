import React, { ReactNode } from "react";
import { hasPermission, UserRole } from "../permissions";

interface WithPermissionProps {
    userRole: UserRole | undefined;
    allowedRoles: UserRole[];
    children: ReactNode;
    fallback?: ReactNode; // מה להציג אם אין הרשאה (לא חובה)
}

export const WithPermission: React.FC<WithPermissionProps> = ({
    userRole,
    allowedRoles,
    children,
    fallback = null,
}) => {
    return hasPermission(userRole, allowedRoles) ? <>{children}</> : <>{fallback}</>;
};
