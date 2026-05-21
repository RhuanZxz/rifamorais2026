// Server-only admin credentials. NEVER import from client code.
export const ADMIN_USERNAME = "MoraisAcesso";
export const ADMIN_PASSWORD = "SenhaRifaMorais";

export function checkAdminAuth(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}
