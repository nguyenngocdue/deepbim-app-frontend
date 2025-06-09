export function isAdmin(user: any): boolean {
  if (!user || !user.userRoles) return false;

  return user.userRoles.some((ur: any) => ur.role?.name === 'admin');
}
